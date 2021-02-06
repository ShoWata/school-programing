<template>
  <v-card
    flat
    tile
  >
    <template v-if="loading">
      <div class="text-center">
        <v-progress-circular
          size="50"
          color="cyan darken-1"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>

    <template v-if="!loading">
      <v-row>
        <v-col
          sm="12"
          md="5"
          class="px-4"
        >
          <h3
            class="blue-grey--text text--darken-2 mb-5"
            style="font-size: 1.14em; letter-spacing: 0.07em;"
          >Question {{ q }}</h3>

          <markdown
            class="mb-5"
            :markdownText="expText"
            style="max-width: 700px"
          ></markdown>

          <v-card-actions>
            <v-spacer></v-spacer>

            <page-btn
              class="mr-4"
              :color="'yellow darken-1'"
              :path="'/'+user.user+page.backPath"
              :text="'スライドに戻る'"
            ></page-btn>
          </v-card-actions>
        </v-col>

        <v-col
          sm="12"
          md="7"
          class="pt-14 pb-6 px-4"
        >
          <div class="drag-box py-2 px-3">
            <p
              class="text-center font-weight-bold white--text mb-1"
              style="font-size: 0.9em"
            >この下のコードの順番では間違っているので並び替えてください</p>

            <div class="mb-2">
              <draggable
                v-model="items"
                animation="900"
                group="ITEMS"
                style="min-height: 400px;"
              >
                <no-num-highlight
                  v-for="item in items"
                  class="py-2"
                  :key="item.id"
                  :recievedCode="item.text"
                  style="cursor: pointer;"
                ></no-num-highlight>
              </draggable>
            </div>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                @click="dialogReset"
                class="font-weight-bold"
                color="yellow darken-1"
                dark
                depressed
              >リセット</v-btn>
            </v-card-actions>
          </div>

          <v-card-actions class="px-0 pt-6">
            <v-btn
              v-if="done"
              @click="dialogAnswer"
              class="font-weight-bold"
              color="yellow darken-1"
              dark
              depressed
            >答え</v-btn>

            <v-spacer></v-spacer>

            <page-btn
              v-if="done"
              class="mr-4"
              :color="'#4badbd'"
              :path="'/'+user.user+page.nextPath"
              :text="page.btnText"
            ></page-btn>

            <v-btn
              @click="check"
              class="ml-4 font-weight-bold"
              color="yellow darken-1"
              dark
              depressed
            >解答</v-btn>
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
import Markdown from '@/components/functions/Markdown.vue'
import draggable from 'vuedraggable'
import NonNumHighlight from '@/components/functions/syntax-highlight/NonNumHighlight.vue'
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
      done: false,
      user: {},
      expText: '',
      items: [],
      question: {},
      page: {},
      dialog: {
        loading: false,
        msg: ''
      }
    }
  },
  components: {
    Markdown,
    draggable,
    'no-num-highlight': NonNumHighlight,
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
  methods: {
    getData (l, exe, q) {
      this.initialize(l, exe, q)

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
      this.items = []

      if (this.user.user !== 'student') this.done = true
    },

    getExerciseData (l, exe, q) {
      const ref = firestore.collection('lessons').doc('lesson' + l)
        .collection('exercises').doc('exercise' + exe)
        .collection('questions').doc('question' + q)

      ref.get().then((doc) => {
        if (doc.exists) {
          this.expText = doc.data().expText
          this.question = doc.data().question
          this.page = doc.data().page
          this.items = doc.data().question.items

          if (this.user.user === 'student' && this.done) {
            this.items.sort((f, s) => {
              if (f.id > s.id) {
                return 1
              } else {
                return -1
              }
            })
          }
        } else {
          console.log('No docuemnts')
        }
        this.loading = false
      })
    },

    getStudentData (l, exe, q) {
      if (this.user.questions.includes(this.qID) ||
        parseInt(this.qID[1]) <= this.user.lesson
      ) {
        this.done = true
      } else {
        this.user.work = true
        this.user.workPath = this.$route.path
        this.$store.commit('setUser', this.user)
      }
      this.getExerciseData(l, exe, q)
    },

    postStudentData () {
      const l = this.qID[1]
      if (String(this.user.lesson + 1) === l &&
        !this.user.questions.includes(this.qID) &&
        this.done
      ) {
        this.user.work = true
        this.user.workPath = ''
        this.user.questions.push(this.qID)
      }

      this.$store.commit('setUser', this.user)
      this.$store.dispatch('postStudentExerciseData', {
        qID: this.qID,
        done: this.done,
        code: null,
        items: null
      })
    },

    dialogAnswer () {
      this.$refs.dialog.openAnswerDialog()
      this.dialog.msg = '解答を表示させてもいいですか？'
    },

    showAnswer () {
      this.items.sort((f, s) => {
        if (f.id > s.id) {
          return 1
        } else {
          return -1
        }
      })
    },

    dialogReset () {
      this.$refs.dialog.openResetDialog()
      this.dialog.msg = 'リセットしてもいいですか？'
    },

    resetCode () {
      this.items = this.question.items
    },

    check () {
      this.dialog.loading = true
      this.$refs.dialog.openCheckDialog()

      var num = 0
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id !== i + 1) {
          if (i === 0) {
            this.dialog.msg = '残念！最初から並べ直してください！'
          } else if (i === 1) {
            this.dialog.msg = '最初だけ合っています！もう一度、並べ直してください！'
          } else {
            this.dialog.msg = String(i) + '番目まで合っています！もう一度、並べ直してください！'
          }
          num = i + 1
          break
        }
      }

      if (num === 0) {
        this.$refs.dialog.showPageBtn()
        this.dialog.msg = '正解です！'

        if (this.user.user === 'student') {
          this.done = true
          this.postStudentData()
        }
      }

      setTimeout(() => {
        this.dialog.loading = false
      }, 700)
    }

  }
}
</script>

<style scoped>
.markdown {
  font-size: 0.91em;
  color: #083947;
  letter-spacing: 0.05em;
}
.drag-box {
  background-color: #a4d0d8;
  min-height: 430px;
  border-radius: 10px;
}
</style>
