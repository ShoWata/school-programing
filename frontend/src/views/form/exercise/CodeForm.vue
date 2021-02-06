<template>
  <div
    class="form py-8"
    id="form"
  >
    <div
      id="select"
      class="pa-6"
    >
      <v-form>
        <v-row>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="selects.lesson.select"
              :items="selects.lesson.items"
              @change="selectLesson"
              label="Lessonを選択"
              required
            ></v-select>
          </v-col>
          <template v-if="selects.exercise.items.length !== 0">
            <v-col
              sm="12"
              md="3"
            >
              <v-select
                v-model="selects.exercise.select"
                :items="selects.exercise.items"
                @change="selectExercise"
                label="Exerciseを選択"
              ></v-select>
            </v-col>
            <v-col
              sm="12"
              md="3"
            >
              <v-select
                v-model="selects.question.select"
                :items="selects.question.items"
                label="Questionを選択"
              ></v-select>
            </v-col>
            <v-col
              sm="12"
              md="2"
            >
              <v-btn
                @click="read"
                color="#4badbd"
                dark
              >読み込む</v-btn>
            </v-col>
          </template>
        </v-row>
      </v-form>
    </div>

    <div
      id="addExercise"
      class="px-6 py-2"
    >
      <v-row>
        <v-col
          sm="12"
          md="3"
        >
          <p
            v-if="selects.lesson.select"
            class="title font-weight-bold text-center text--h2"
          >{{ selects.lesson.select }}の</p>
          <p
            v-else
            class="title font-weight-bold text-center text--h2"
          >Lesson1の</p>
        </v-col>
        <v-col
          sm="12"
          md="3"
        >
          <p
            v-if="selects.exercise.items.length !== 0"
            class="title font-weight-bold text-center text--h2"
          >Exercise {{ String(selects.exercise.items.length + 1) }}の</p>
          <p
            v-else
            class="title font-weight-bold text-center text--h2"
          >Exercise 1</p>
        </v-col>
        <v-col
          sm="12"
          md="3"
        >
          <p class="title font-weight-bold text-center text--h2">Question 1を</p>
        </v-col>
        <v-col
          sm="12"
          md="3"
        >
          <v-btn
            @click="startAddExercise"
            color="#4badbd"
            dark
          >追加する</v-btn>
        </v-col>
      </v-row>
    </div>

    <div
      v-if="selects.exercise.select"
      id="addQuestion"
      class="px-6 py-2 mb-6"
    >
      <v-row>
        <v-col
          sm="12"
          md="3"
        >
          <p
            v-if="selects.lesson.select"
            class="title font-weight-bold text-center text--h2"
          >{{ selects.lesson.select }}の</p>
          <p
            v-else
            class="title font-weight-bold text-center text--h2"
          >Lesson1の</p>
        </v-col>
        <v-col
          sm="12"
          md="3"
        >
          <p
            v-if="selects.exercise.select"
            class="title font-weight-bold text-center text--h2"
          >{{ selects.exercise.select }}の</p>
          <p
            v-else
            class="title font-weight-bold text-center text--h2"
          >Exercise 1</p>
        </v-col>
        <v-col
          sm="12"
          md="3"
        >
          <p class="title font-weight-bold text-center text--h2">Question {{ String(selects.question.items.length + 1) }}を</p>
        </v-col>
        <v-col
          sm="12"
          md="3"
        >
          <v-btn
            @click="startAddQuestion"
            color="#4badbd"
            dark
          >追加する</v-btn>
        </v-col>
      </v-row>
    </div>

    <h3
      v-if="addData"
      class="ml-12 mb-9"
    >追加するものを編集してください！</h3>

    <div
      id="subTextEditor"
      class="px-12 py-6"
    >
      <h3 class="mb-8">タイトル下補足文の編集</h3>

      <v-row>
        <v-col cols="6">
          <div
            id="editor"
            class="mb-6"
          >
            <v-textarea
              v-model="subText"
              filled
              height="100px"
            ></v-textarea>
          </div>
        </v-col>

        <v-col cols="6">
          <div id="textPreview">
            <markdown :markdownText="subText"></markdown>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      id="textEditor"
      class="px-12 py-6"
    >
      <h3 class="mb-8">説明文の編集</h3>

      <v-row>
        <v-col cols="6">
          <div
            id="editor"
            class="mb-6"
          >
            <v-textarea
              v-model="expText"
              filled
              height="400px"
            ></v-textarea>
          </div>
        </v-col>

        <v-col cols="6">
          <div id="textPreview">
            <markdown :markdownText="expText"></markdown>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      id="initCodeEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">初期のコード編集</h3>

      <v-row>
        <v-col cols="6">
          <div
            id="editor"
            class="mb-6"
          >
            <editor
              ref="initCodeEditor"
              :code="code.initCode"
              :idName="'python-editor'"
              style="width: 100%; height: 500px;"
            ></editor>
          </div>
        </v-col>

        <v-col cols="6">
          <div
            id="preview"
            class="mb-6"
          >
            <highlight :recievedCode="code.initCode"></highlight>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-btn
            @click="getInitCode"
            class="font-weight-bold"
            color="#4badbd"
            dark
            depressed
            large
          >読み込む</v-btn>
        </v-col>
      </v-row>
    </div>

    <div
      id="answerEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">正解の編集</h3>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="answer.id"
            label="コードのidを入力"
            clearable
          ></v-text-field>

          <v-btn
            @click="readAnswer"
            class="mr-3"
            color="#4badbd"
            dark
          >読み込む</v-btn>

          <v-btn
            @click="updateAnswer"
            class="mx-3"
            color="#4badbd"
            dark
          >更新する</v-btn>

          <v-btn
            @click="addAnswer"
            class="mx-3"
            color="#4badbd"
            dark
          >追加する</v-btn>

          <v-btn
            @click="removeAnswer"
            class="ml-3"
            color="#4badbd"
            dark
          >削除する</v-btn>

          <terminal
            class="mt-16"
            :output="answer.answer"
            :start="false"
          ></terminal>
        </v-col>

        <v-col cols="6">
          <div
            id="editor"
          >
            <v-textarea
              v-model="answer.answer"
              filled
              height="400px"
            ></v-textarea>
          </div>
        </v-col>
        <template v-if="answer.answers.length > 0">
          <v-col
            v-for="(answer, index) in answer.answers"
            :key="index"
            cols="6"
          >
            <p class="text-center font-weight-bold">解答{{ index + 1 }} id：{{ index }}</p>

            <terminal
              :output="answer"
              :start="false"
            ></terminal>
          </v-col>
        </template>
      </v-row>
    </div>

    <div
      id="sampleCodeEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">サンプルコード例の編集</h3>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="code.id"
            label="コードのidを入力"
            clearable
          ></v-text-field>

          <v-btn
            @click="readSampleCode"
            class="mr-3"
            color="#4badbd"
            dark
          >読み込む</v-btn>

          <v-btn
            @click="updateSampleCode"
            class="mx-3"
            color="#4badbd"
            dark
          >更新する</v-btn>

          <v-btn
            @click="addSampleCode"
            class="mx-3"
            color="#4badbd"
            dark
          >追加する</v-btn>

          <v-btn
            @click="removeSampleCode"
            class="ml-3"
            color="#4badbd"
            dark
          >削除する</v-btn>

          <terminal
            class="mt-16"
            :output="terminal.output"
            :start="terminal.loading"
          ></terminal>
        </v-col>

        <v-col cols="6">
          <div
            id="editor"
            class="mb-6"
          >
            <v-card
              class="pa-1 mb-4"
              color="#92cfd8"
              elevation="2"
              rounded="lg"
            >
              <p class="text-center white--text font-weight-bold px-8 mb-1">エディター（ソースコードを書いてください）</p>

              <editor
                :code="code.sampleCode"
                :idName="'python-editor-sample'"
                ref="sampelCodeEditor"
                class="mb-2"
                style="width: 100%; height: 500px;"
              ></editor>

              <v-card-actions class="px-3 py-1">
                <v-spacer></v-spacer>

                <v-btn
                  @click="commitSampleCode"
                  class="font-weight-bold px-6"
                  color="yellow darken-1"
                  dark
                  depressed
                  large
                >実行する</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>

        <template v-if="code.sampleCodes.length > 0">
          <v-col
            v-for="(code, index) in code.sampleCodes"
            :key="index"
            cols="6"
          >
            <p class="text-center font-weight-bold">サンプルコード{{ index + 1 }} id：{{ index }}</p>

            <highlight :recievedCode="code"></highlight>
          </v-col>
        </template>
      </v-row>
    </div>

    <div
      id="pathEditor"
      class="px-12 py-6"
    >
      <h3 class="mb-8">Pathとボタン名の編集</h3>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="page.nextPath"
            label="次のPathを入力"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="page.btnText"
            label="次のページに進むボタン名の入力"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="page.backPath"
            label="スライドに戻るPathを入力"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="btn text-center">
      <v-btn
        v-if="!addData"
        @click="postData"
        color="#4badbd"
        dark
        large
      >更新する</v-btn>
      <v-btn
        v-if="addData"
        @click="postData"
        color="#4badbd"
        dark
        large
      >追加する</v-btn>
    </div>

  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import { compile } from '@/plugins/compile'
import Markdown from '@/components/functions/Markdown.vue'
import Editor from '@/components/functions/editor/Editor.vue'
import Highlight from '@/components/functions/syntax-highlight/Highlight.vue'
import Terminal from '@/components/functions/Terminal.vue'

export default {
  data () {
    return {
      selects: {
        lesson: {
          items: [],
          select: null
        },
        exercise: {
          items: [],
          select: null
        },
        question: {
          items: [],
          select: null
        }
      },
      addData: false,
      subText: '',
      expText: '',
      code: {
        id: 0,
        initCode: '',
        sampleCode: '',
        sampleCodes: []
      },
      answer: {
        id: 0,
        answer: '',
        answers: []
      },
      page: {
        backPath: '',
        nextPath: '',
        btnText: ''
      },
      terminal: {
        loading: false,
        output: ''
      }
    }
  },
  components: {
    Markdown,
    Terminal,
    Editor,
    Highlight
  },
  created () {
    for (var i = 0; i < 8; i++) {
      this.selects.lesson.items.push('lesson' + String(i + 1))
    }
  },
  methods: {
    selectLesson () {
      this.selects.exercise.select = null
      this.selects.question.select = null
      this.selects.exercise.items = []
      this.selects.question.items = []
      firestore.collection('lessons').doc(this.selects.lesson.select).collection('exercises')
        .get().then(snapshot => {
          snapshot.forEach(doc => {
            this.selects.exercise.items.push(doc.id)
          })
        })
    },

    selectExercise () {
      this.selects.question.items = []
      firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').doc(this.selects.exercise.select)
        .collection('questions').get().then(snapshot => {
          snapshot.forEach(doc => {
            this.selects.question.items.push(doc.id)
          })
        })
    },

    initialize () {
      this.subText = ''
      this.expText = ''
      this.code.id = 0
      this.code.output = ''
      this.code.initCode = ''
      this.code.sampleCode = ''
      this.code.sampleCodes = []
      this.answer.id = 0
      this.answer.answer = ''
      this.answer.answers = ''
      this.page.backPath = ''
      this.page.nextPath = ''
      this.page.btnText = ''
    },

    read () {
      this.initialize()

      const ref = firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').doc(this.selects.exercise.select)

      ref.get().then(doc => {
        this.subText = doc.data().subText
      })

      ref.collection('questions').doc(this.selects.question.select)
        .get().then(doc => {
          this.expText = doc.data().expText
          // this.code.initCode = doc.data().question.initCode
          // this.code.sampleCodes = doc.data().question.sampleCodes
          // this.answer.answers = doc.data().question.answer
          this.code.initCode = doc.data().originCode
          this.code.sampleCodes = doc.data().rightCodes
          this.answer.answers = doc.data().rightAnswers
          // this.page.backPath = doc.data().page.backPath
          // this.page.nextPath = doc.data().page.nextPath
          // this.page.btnText = doc.data().page.btnText
          this.page.backPath = doc.data().backPath
          this.page.nextPath = doc.data().nextPath
          this.page.btnText = doc.data().btnText
        })
    },

    startAddExercise () {
      this.addData = true
      this.initialize()

      const len = this.selects.exercise.items.length
      this.selects.exercise.select = 'exercise' + String(len + 1)
      this.selects.question.select = 'question1'
    },

    startAddQuestion () {
      this.addData = true
      this.initialize()

      const len = this.selects.question.items.length
      this.selects.question.select = 'question' + String(len + 1)

      firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').doc(this.selects.exercise.select)
        .get().then(doc => {
          this.subText = doc.data().subText
        })
    },

    getInitCode () {
      this.code.initCode = this.$refs.initCodeEditor.getCode()
    },

    readAnswer () {
      this.answer.answer = this.answer.answers[Number(this.answer.id)]
    },

    updateAnswer () {
      this.answer.answers[Number(this.answer.id)] = this.answer.answer
    },

    addAnswer () {
      this.answer.answers.push(this.answer.answer)
    },

    removeAnswer () {
      this.answer.answers.splice(this.answer.id, 1)
    },

    readSampleCode () {
      this.code.sampleCode = this.code.sampleCodes[Number(this.code.id)]
    },

    updateSampleCode () {
      this.code.sampleCode = this.$refs.sampleCodeEditor.getCode()
      this.code.sampleCodes[Number(this.code.id)] = this.code.sampleCode
    },

    addSampleCode () {
      this.code.sampleCode = this.$refs.sampleCodeEditor.getCode()
      this.code.sampleCodes.push(this.code.sampleCode)
    },

    removeSampleCode () {
      this.code.sampleCodes.splice(this.code.id, 1)
    },

    async commitSampleCode () {
      this.terminal.loading = true
      this.terminal.output = ''

      const code = this.$refs.sampleCodeEditor.getCode()

      await compile(code).then(res => {
        this.terminal.output = res
      }).catch(err => {
        this.dialog.open = true
        this.dialog.msg = err
      })

      this.terminal.loading = false
    },

    postData () {
      const ref = firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').doc(this.selects.exercise.select)

      ref.set({ subText: this.subText }, { merge: true })
        .then(() => {
          console.log('Docuemnts successfully written')
        }).catch(error => {
          console.error('Error wrtiting documents: ', error)
        })

      ref.collection('questions').doc(this.selects.question.select).set({
        expText: this.expText,
        question: {
          answer: this.answer.answers,
          initCode: this.code.initCode,
          sampleCodes: this.code.sampleCodes
        },
        page: this.page
      }, { merge: true }).then(() => {
        console.log('Docuemnts successfully written')
      }).catch(error => {
        console.error('Error wrtiting documents: ', error)
      })
    }
  }
}
</script>

<style scoped>
.v-application code {
  all: unset;
}
.token {
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
}
</style>
