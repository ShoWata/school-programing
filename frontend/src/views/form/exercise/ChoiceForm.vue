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

    <p
      v-if="addData"
      class="ml-12 mb-9"
    >追加するものを編集してください！</p>

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
      id="textEditor"
      class="px-12 py-6"
    >
      <h3 class="mb-8">問題文の編集</h3>
      <v-row>
        <v-col cols="6">
          <div
            id="editor"
            class="mb-6"
          >
            <v-textarea
              v-model="qText"
              filled
              height="400px"
            ></v-textarea>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      id="choiceEditor"
      class="mb-8 px-12"
    >
      <h2 class="mb-4">選択肢の編集</h2>
      <v-row>
        <v-col cols="6">
          <div
            id="editor"
            class="mb-6"
          >
            <v-textarea
              v-model="choice.text"
              filled
              height="400px"
            ></v-textarea>
          </div>
        </v-col>
        <v-col cols="6">
          <div id="choicePreview">
            <markdown :markdownText="choice.text"></markdown>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          sm="12"
          md="6"
        >
          <v-text-field
            v-model="choice.index"
            label="indexを入力"
            clearable
          >
          </v-text-field>
          <v-btn
            @click="readChoice"
            class="mr-2"
            color="#4badbd"
            dark
          >読み込む</v-btn>
          <v-btn
            @click="updateChoice"
            class="mx-2"
            color="#4badbd"
            dark
          >更新する</v-btn>
          <v-btn
            @click="addChoice"
            class="mx-2"
            color="#4badbd"
            dark
          >追加する</v-btn>
          <v-btn
            @click="removeChoice"
            class="ml-2"
            color="#4badbd"
            dark
          >削除する</v-btn>
        </v-col>
        <v-col
          sm="12"
          md="6"
        >
          <template v-if="choice.choices!==0">
            <template v-for="(choice, index) in choice.choices">
              <div
                class="mb-4"
                :key="index"
              >
                <p>{{ index }}</p>
                <markdown :markdownText="choice"></markdown>
              </div>
            </template>
          </template>
        </v-col>
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
          >
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="page.btnText"
            label="次のページに進むボタン名の入力"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="page.backPath"
            label="スライドに戻るPathを入力"
            clearable
          >
          </v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="btn text-center">
      <v-btn
        v-if="!addData"
        @click="update"
        color="#4badbd"
        dark
        large
      >更新する</v-btn>
      <v-btn
        v-if="addData"
        @click="update"
        color="#4badbd"
        dark
        large
      >追加する</v-btn>
    </div>

  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import Markdown from '@/components/functions/Markdown.vue'

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
      qText: '',
      choice: {
        index: 0,
        text: '',
        choices: []
      },
      page: {
        backPath: '',
        nextPath: '',
        btnText: '',
      }
    }
  },
  components: {
    'markdown': Markdown
  },
  created () {
    for (var i = 0; i < 9; i++) {
      this.selects.lesson.items.push('lesson'+String(i+1))
    }
  },
  methods: {
    selectLesson () {
      this.selects.exercise.select = null
      this.selects.question.select = null
      this.selects.exercise.items = []
      this.selects.question.items = []

      firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').get().then(snapshot => {
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
          this.qText = doc.data().question.text
          this.choice.choices = doc.data().question.choices
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
      this.choice.choices = ''
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
      this.choice.choices = ''
      this.page.backPath = ''
      this.page.nextPath = ''
      this.page.btnText = ''
    },

    readChoice () {
      this.choice.text = this.choice.choices[Number(this.choice.index)]
    },

    updateChoice () {
      this.choice.choices[Number(this.choice.index)] = this.choice.text
    },

    addChoice () {
      this.choice.choices.push(this.choice.text)
    },

    removeChoice () {
      this.choice.choices.splice(this.choice.index ,1)
    },

    update () {
      const ref = firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').doc(this.selects.exercise.select)

      ref.set({ subText: this.subText },{ merge: true })
        .then(() => {
          console.log('Docuemnts successfully written')
        }).catch(error => {
          console.error('Error wrtiting documents: ', error)
        })
      
      ref.collection('questions').doc(this.selects.question.select).set({
        expText: this.expText,
        question: {
          text: this.qText,
          choices: this.choice.choices
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
