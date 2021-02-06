<template>
  <v-card
    flat
    tile
  >
    <template v-if="loading">
      <div class="text-center">
        <v-progress-circular
          size="50"
          color="cyan"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>

    <template v-if="!loading">
      <v-row>
        <v-col
          cols="12"
          md="4"
          class="px-2"
        >
          <h3
            class="blue-grey--text text--darken-2 mb-5"
            style="letter-spacing: 0.07em;"
          >Question {{ q }}</h3>

          <markdown
            class="mb-7"
            :markdownText="expText"
            style="max-width: 700px"
          ></markdown>

          <div
            v-if="type=='correct'"
            class="py-3 mb-3">
            <p
              class="text-center mb-2"
              style="font-size: 0.83em; color: #062c36;"
            >下のコードは修正できません。<br>修正する前の間違ったコードです。</p>

            <read-editor
              :code="question.initCode"
              style="width: 100%; min-height: 250px;"
            ></read-editor>
          </div>

          <v-card-actions>
            <v-spacer></v-spacer>

            <page-btn
              :color="'yellow darken-1'"
              :path="'/'+user.user+page.backPath"
              :text="'スライドに戻る'"
            ></page-btn>
          </v-card-actions>
        </v-col>

        <v-col
          cols="12"
          md="8"
          class="pt-14 pb-2 px-2"
        >
          <v-card
            class="pa-1 mb-2"
            color="#92cfd8"
            elevation="2"
            rounded="lg"
          >
            <p class="text-center white--text font-weight-bold px-8 mb-1">エディター（ソースコードを書いてください）</p>

            <editor
              :code="code.current"
              :idName="'python-editor'"
              ref="editor"
              style="width: 100%; min-height: 500px;"
            ></editor>

            <div
              v-if="alert.open"
              class="alert-container px-3 pb-1"
            >
              <v-alert
                class="mb-0 px-12"
                dense
                height="38"
                outlined
                text
                type="success"
              >{{ alert.msg }}</v-alert>
            </div>

            <v-card-actions class="px-3 py-1">
              <v-btn
                @click="dialogReset"
                class="font-weight-bold px-4"
                color="yellow darken-1"
                dark
                depressed
              >リセット</v-btn>

              <v-spacer></v-spacer>

              <v-btn
                @click="commit"
                class="font-weight-bold px-6"
                color="yellow darken-1"
                dark
                depressed
              >実行</v-btn>
            </v-card-actions>
          </v-card>

          <v-alert
            v-if="alert.commit"
            class="mb-2 px-6"
            dense
            height="38"
            text
            type="error"
          >{{ alert.msg }}</v-alert>

          <!-- <terminal
            class="mb-4"
            :output="terminal.output"
            :loadingState="terminal.loading"
          ></terminal> -->

          <terminal
            @catchVal="replaceAndCompile"
            :inputActive="terminal.input.active"
            :terminalTexts="terminal.texts"
          ></terminal>

          <v-card-actions class="py-5 px-4">
            <v-btn
              v-if="done"
              @click="dialogAnswer"
              class="font-weight-bold"
              color="yellow darken-1"
              dark
              depressed
            >答えを見る</v-btn>

            <v-spacer></v-spacer>

            <page-btn
              v-if="done"
              class="mr-3"
              :color="'#4badbd'"
              :path="'/'+user.user+page.nextPath"
              :text="page.btnText"
            ></page-btn>

            <v-btn
              @click="check"
              class="font-weight-bold ml-3"
              color="yellow darken-1"
              dark
              depressed
            >解答</v-btn>

            <!-- <v-btn
              @click="submit"
              class="font-weight-bold ml-3"
              color="yellow darken-1"
              dark
              depressed
              large
            >送信</v-btn> -->
          </v-card-actions>
        </v-col>
      </v-row>

      <q-dialog
        ref="dialog"
        @answer="showAnswer"
        @reset="resetCode"
        :user="user.user"
        :loading="dialog.loading"
        :page="page"
        :msg="dialog.msg"
      ></q-dialog>
    </template>
  </v-card>
</template>

<script>
import firestore from '@/firebase/firestore'
import fireauth from '@/firebase/fireauth'
// import { compile } from '@/plugins/compile'
import { compileCode } from '@/plugins/compile/compile.js'
import { replaceInputCode } from '@/plugins/compile/replace-input.js'
import { unlockLesson } from '@/plugins/unlock-lesson'
import Markdown from '@/components/functions/Markdown.vue'
import Editor from '@/components/functions/editor/Editor.vue'
import ReadEditor from '@/components/functions/editor/ReadOnlyEditor.vue'
// import Terminal from '@/components/functions/Terminal.vue'
import Terminal from '@/components/functions/terminal/InputTerminal.vue'
import QuestionDialog from '@/components/layouts/dialogs/QuestionDialog.vue'
import PageBtn from '@/components/buttons/pages/TransButton.vue'

export default {
  props: {
    l: String,
    exe: String,
    q: String
  },
  data () {
    return {
      loading: true,
      qID: '',
      path: '',
      user: {},
      done: false,
      type: '',
      expText: '',
      question: {},
      code: {
        current: '',
        committed: ''
      },
      terminal: {
        loading: false,
        texts: [],
        input: {
          active: false,
          text: '',
          dividedCodes: []
        }
      },
      page: {},
      alert: {
        open: false,
        commit: false,
        msg: ''
      },
      dialog: {
        loading: false,
        msg: ''
      }
    }
  },
  components: {
    Markdown,
    Editor,
    'read-editor': ReadEditor,
    Terminal,
    'q-dialog': QuestionDialog,
    'page-btn': PageBtn
  },
  created () {
    this.getData(this.l, this.exe, this.q)
  },
  watch: {
    $route (to) {
      const path = to.path.split('/')
      const l = path[3]
      const exe = path[5]
      const q = path[6]
      this.getData(l, exe, q)
    }
  },
  beforeDestroy () {
    const code = this.$refs.editor.getCode()
    if (this.user.user === 'student' && !this.done) {
      this.postStudentData(code)
    }
    sessionStorage.setItem(this.qID + ':' + this.user.name, code)
  },
  methods: {
    getData (l, exe, q) {
      this.initialize(l, exe, q)
      this.getSessionData()

      if (this.user.user === 'student') {
        this.getStudentData(l, exe, q)
      } else {
        this.getExerciseData(l, exe, q)
      }
    },

    initialize (l, exe, q) {
      this.qID = 'l' + l + 'e' + exe + 'q' + q
      this.user = this.$store.getters.user
      this.done = false

      if (this.user.user !== 'student') this.done = true

      this.code.current = ''
      this.terminal.output = ''
    },

    getSessionData () {
      const code = sessionStorage.getItem(this.qID + ':' + this.user.name)
      if (code) {
        this.code.current = code
      }
    },

    getStudentData (l, exe, q) {
      fireauth.onAuthStateChanged(user => {
        if (user) {
          const uid = fireauth.currentUser.uid

          firestore.collection('students').doc(uid)
            .collection('exercises').doc(this.qID)
            .get().then(doc => {
              if (doc.exists) {
                if (!this.code.current) this.code.current = doc.data().code
                this.done = doc.data().done
              }
              if (!this.done) {
                this.user.work = true
                this.user.workPath = this.$route.path
                this.$store.commit('setUser', this.user)
              }
              this.getExerciseData(l, exe, q)
            })
        }
      })
    },

    getExerciseData (l, exe, q) {
      const ref = firestore.collection('lessons').doc('lesson' + l)
        .collection('exercises').doc('exercise' + exe)
        .collection('questions').doc('question' + q)

      ref.get().then((doc) => {
        if (doc.exists) {
          this.type = doc.data().type
          this.expText = doc.data().expText
          this.question = doc.data().question
          this.page = doc.data().page

          if (!this.code.current) {
            this.code.current = this.question.initCode
          }
        } else {
          console.log('No docuemnts')
        }
        this.loading = false
      })
    },

    postStudentData (code) {
      const l = this.qID[1]
      if (l === String(this.user.lesson + 1) && !this.user.questions.includes(this.qID) && this.done) {
        this.user.work = false
        this.user.workPath = ''
        this.user.questions.push(this.qID)
        if (unlockLesson(this.user.lesson, this.user.questions)) {
          this.user.lesson += 1
          this.user.questions = []
        }
      }

      this.$store.commit('setUser', this.user)
      this.$store.dispatch('postStudentExerciseData', {
        qID: this.qID,
        done: this.done,
        code: code,
        items: null
      })
    },

    dialogAnswer () {
      this.$refs.dialog.openAnswerDialog()
      this.dialog.msg = '解答を表示させてもいいですか？'
    },

    showAnswer () {
      this.code.current = this.question.sampleCodes[0]
      this.$refs.editor.setCode()
    },

    dialogReset () {
      this.$refs.dialog.openResetDialog()
      this.dialog.msg = 'リセットしてもいいですか？'
    },

    resetCode () {
      this.code.current = this.question.initCode
      this.$refs.editor.setCode()

      this.alert.open = true
      this.alert.msg = 'リセットされました'

      setTimeout(() => {
        this.alert.open = false
        this.alert.msg = ''
      }, 2600)
    },

    // async commit () {
    //   this.terminal.loading = true
    //   this.terminal.output = ''

    //   this.code.committed = this.$refs.editor.getCode()

    //   await compile(this.code.committed).then(res => {
    //     this.terminal.output = res
    //   }).catch(err => {
    //     this.dialog.open = true
    //     this.dialog.msg = err
    //   })

    //   this.terminal.loading = false
    // },

    initializeTerminal () {
      this.terminal.input.active = false
      this.terminal.input.text = ''
      this.terminal.input.dividedCodes = []
    },

    commit () {
      // this.terminal.loading = true

      this.code.committed = this.$refs.editor.getCode()
      this.compile(this.code.committed)
    },

    compile (code) {
      this.initializeTerminal()

      compileCode(code).then(res => {
        this.terminal.texts = res.terminalTexts
        if (res.dividedCodes && res.input) {
          this.terminal.input.active = true
          this.terminal.input.text = res.terminalTexts.slice(-1)[0]
          this.terminal.input.dividedCodes = res.dividedCodes
        }
      }).catch(err => {
        this.alert.open = true
        this.alert.msg = err

        setTimeout(() => {
          this.alert.open = false
          this.alert.msg = ''
        }, 2600)
      })
    },

    replaceAndCompile (val) {
      const replacedCode = replaceInputCode(
        this.terminal.input.dividedCodes,
        this.terminal.input.text,
        val
      )
      this.compile(replacedCode)
    },

    judge (myAnswer) {
      var isRight = false
      this.dialog.msg = '正解です！'

      if (this.question.answer.length === 0) {
        isRight = true
        this.dialog.msg = '次へ進んでください'
      } else {
        for (var answer of this.question.answer) {
          if (myAnswer === answer) {
            isRight = true
            break
          }
        }
      }

      if (isRight) {
        this.$refs.dialog.showPageBtn()

        if (this.user.user === 'student') {
          this.done = true
          this.postStudentData(false, '', this.code.committed)
        }
        sessionStorage.setItem(this.qID + ':' + this.user.name, this.code.committed)
      } else {
        this.dialog.msg = 'もう一度、トライしよう！'
      }
    },

    check () {
      if (this.terminal.output) {
        this.dialog.loading = true
        this.$refs.dialog.openCheckDialog()

        this.judge(this.terminal.output)

        setTimeout(() => {
          this.dialog.loading = false
        }, 1000)
      } else {
        this.alert.commit = true
        this.alert.msg = '実行ボタンを押して、コードを実行してください'

        setTimeout(() => {
          this.alert.commit = false
          this.alert.msg = ''
        }, 2600)
      }
    }

    // submit () {
    //   const code = this.$refs.editor.getCode()

    //   axios.post(
    //     'https://flask-fire-23xkq6zmga-an.a.run.app',
    //     // 'http://0.0.0.0:8000/',
    //     { 'code': code },
    //     { headers: { 'Content-type': 'application/json' }}
    //   ).then(res => {
    //     console.log(res.data)
    //   })
    // }
  }
}
</script>

<style scoped>
.markdown {
  font-size: 0.91em;
  color: #083947;
  letter-spacing: 0.05em;
  letter-spacing: 0.003em;
  overflow-y: scroll;
  max-height: 774px;
}
.markdown::-webkit-scrollbar {
  width: 0.5em;
}
.markdown::-webkit-scrollbar-thumb {
  border-radius: 0.2em;
  background: #EEEEEE;
}

.alert-container {
  background-color: #F5F5F5;
}
.v-alert {
  font-size: 0.89em;
}
.v-alert__icon.v-icon {
  font-size: 1.1em;
}
</style>
