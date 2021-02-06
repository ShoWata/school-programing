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

    <h2
      v-if="addData"
      class="ml-12 mb-9"
    >追加するものを編集してください！</h2>

    <div id="subTextEditor" class="px-12 py-6">
      <h2 class="mb-8">タイトル下補足文の編集</h2>
      <v-row>
        <v-col cols="6">
          <div id="editor" class="mb-6">
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
      <h2 class="mb-8">説明文の編集</h2>
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
      id="labelEditor"
      class="mb-8 px-12"
    >
      <h2 class="mb-4">入力部分のラベル編集</h2>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="question.label"
            label="ラベルを入力"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div
      id="answerEditor"
      class="mb-8 px-12"
    >
      <h2 class="mb-4">解答の正解編集</h2>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="question.answer"
            label="答えを入力"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div
      id="pathEditor"
      class="px-12 py-6"
    >
      <h2 class="mb-8">Pathとボタン名の編集</h2>
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

    <div id="preview" class="px-3 py-3 mb-10">
      <h2 class="ml-10 mb-10">プレビュー</h2>

      <v-card
        class="pt-3 pb-5"
        elevation="12"
        rounded="x-lg"
      >
        <v-card-title class="headline font-weight-black px-14 mb-4">{{ selects.exercise.select }}</v-card-title>

        <markdown
          class="mb-14 px-16"
          :markdownText="subText"
        ></markdown>

        <v-card
          class="px-16"
          flat
          tile
        >
          <h3 class="mb-8">{{ selects.question.select }}</h3>

          <markdown class="mb-8" :markdownText="expText"></markdown>

          <v-card-text>
            <v-row>
              <v-col
                sm="12"
                md="4"
              >
                <v-form>
                  <v-text-field
                    v-model="answer"
                    autocomplete="off"
                    :label="question.label"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-col>
              <v-col
                sm="12"
                md="4"
              >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="check"
                    class="font-weight-bold"
                    color="yellow darken-1"
                    dark
                    depressed
                    large
                  >解答する</v-btn>
                </v-card-actions>
              </v-col>
              <v-col
                sm="12"
                md="4"
              ></v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn
              class="font-weight-bold"
              color="yellow darken-1"
              dark
              depressed
              large
            >スライドに戻る</v-btn>
          </v-card-actions>

          <v-dialog
            v-model="dialog.open"
            height="300px"
            width="300px"
          >
            <v-card
              class="elevation-2 py-4 px-6"
              rounded="lg"
            >
              <p class="text-center my-6 font-weight-bold">{{ dialog.msg }}</p>
              <v-card-actions
                v-if="dialog.btn"
                class="mt-5"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="#4badbd"
                  dark
                  depressed
                >{{ page.btnText }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-card>
      </v-card>
    </div>

    <div class="btn text-center">
      <v-btn
        v-if="!addData"
        @click="update"
        color="#4badbd"
        dark
        large
      >
        更新する
      </v-btn>
      <v-btn
        v-if="addData"
        @click="update"
        color="#4badbd"
        dark
        large
      >
        追加する
      </v-btn>
    </div>

  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import Markdown from '@/components/functions/Markdown.vue'

export default {
  components: {
    Markdown
  },
  data () {
    return {
      selects: {
        lesson: {
          items: [
            'lesson1',
            'lesson2',
            'lesson3',
            'lesson4',
            'lesson5',
            'lesson6',
            'lesson7'
          ],
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
      answer: '',
      question: {
        label: '',
        answer: ''
      },
      page: {
        backPath: '',
        nextPath: '',
        btnText: ''
      },
      dialog: {
        open: false,
        msg: '',
        btn: false
      }
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

    read () {
      const ref = firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').doc(this.selects.exercise.select)

      ref.get().then(doc => {
        this.subText = doc.data().subText
      })

      ref.collection('questions').doc(this.selects.question.select)
        .get().then(doc => {
          this.expText = doc.data().expText
          this.question.label = doc.data().question.label
          this.question.answer = doc.data().questio.answer
          this.page.backPath = doc.data().page.backPath
          this.page.nextPath = doc.data().page.nextPath
          this.page.btnText = doc.data().page.btnText
        })
    },

    startAddExercise () {
      this.addData = true

      const len = this.selects.exercise.items.length
      this.selects.exercise.select = 'exercise' + String(len + 1)
      this.selects.question.select = 'question1'

      this.subText = ''
      this.expText = ''
      this.question.label = ''
      this.question.answer = ''
      this.page.backPath = ''
      this.page.nextPath = ''
      this.page.btnText = ''
    },

    startAddQuestion () {
      this.addData = true

      const len = this.selects.question.items.length
      this.selects.question.select = 'question' + String(len + 1)

      firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').doc(this.selects.exercise.select)
        .get().then(doc => {
          this.subText = doc.data().subText
        })

      this.expText = ''
      this.question.label = ''
      this.question.answer = ''
      this.page.backPath = ''
      this.page.nextPath = ''
      this.page.btnText = ''
    },

    check () {
      this.dialog.open = true
      if (this.answer === this.question.answer) {
        this.dialog.msg = '正解です！'
        this.dialog.btn = true
      } else {
        this.dialog.msg = '残念！もう一度トライしてみよう！'
        this.dialog.btn = false
      }
      this.answer = ''
    },

    update () {
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
        question: this.question,
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
.btn-text {
  font-size: 1.0rem;
  font-weight: bold;
}
</style>
