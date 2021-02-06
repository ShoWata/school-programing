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
      id="sortItemEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">並び替えるコードの編集</h3>

      <v-row>
        <v-col cols="6">
          <div
            id="editor"
            class="mb-6"
          >
            <v-textarea
              v-model="sort.item"
              filled
              height="400px"
            ></v-textarea>
          </div>
        </v-col>

        <v-col cols="6">
          <div id="itemPreview">
            <highlight :recievedCode="sort.item"></highlight>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          sm="12"
          md="6"
        >
          <v-text-field
            v-model="sort.id"
            label="idを入力"
            clearable
          ></v-text-field>

          <v-btn
            @click="readItem"
            class="mr-2"
            color="#4badbd"
            dark
          >読み込む</v-btn>

          <v-btn
            @click="updateItem"
            class="mx-2"
            color="#4badbd"
            dark
          >更新する</v-btn>

          <v-btn
            @click="addItem"
            class="mx-2"
            color="#4badbd"
            dark
          >追加する</v-btn>

          <v-btn
            @click="removeItem"
            class="ml-2"
            color="#4badbd"
            dark
          >削除する</v-btn>
        </v-col>

        <v-col
          sm="12"
          md="6"
        >
          <template v-for="item in sort.items">
            <div
              class="mb-4"
              :key="item.id"
            >
              <p>{{ item.id }}</p>

              <highlight :recievedCode="item.text"></highlight>
            </div>
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
import NonNumHighlight from '@/components/functions/syntax-highlight/NonNumHighlight.vue'
// import draggable from 'vuedraggable'

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
      sort: {
        id: 1,
        index: 0,
        item: '',
        items: [],
        sortedItems: []
      },
      page: {
        backPath: '',
        nextPath: '',
        btnText: '',
      }
    }
  },
  components: {
    'markdown': Markdown,
    'highlight': NonNumHighlight,
    // 'draggable': draggable
  },
  created () {
    for (var i = 0; i < 8; i++) {
      this.selects.lesson.items.push('lesson' + String(i+1))
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

    initialize () {
      this.expText = ''
      this.sort.id = 1
      this.sort.item = ''
      this.sort.items = []
      this.page.backPath = ''
      this.page.nextPath= ''
      this.page.btnText = ''
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
          this.page.backPath = doc.data().page.backPath
          this.page.nextPath = doc.data().page.nextPath
          this.page.btnText = doc.data().page.btnText
          this.sort.items = doc.data().items
        })
    },

    startAddExercise () {
      this.addData = true

      const len = this.selects.exercise.items.length
      this.selects.exercise.select = 'exercise' + String(len + 1)
      this.selects.question.select = 'question1'

      this.subText = ''
      this.initialize()
    },

    startAddQuestion () {
      this.addData = true

      const len = this.selects.question.items.length
      this.selects.question.select = 'question' + String(len + 1)
      console.log(this.selects.exercise.select)
      console.log(this.selects.qiestion.select)

      firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').doc(this.selects.exercise.select)
        .get().then(doc => {
          this.subText = doc.data().subText
        })
      
      this.initialize()
    },

    readItem () {
      this.sort.index = this.sort.items.findIndex(({id}) => id === Number(this.sort.id))
      this.sort.item = this.sort.items[this.sort.index].text
    },

    updateItem () {
      this.sort.items[this.sort.index].text = this.sort.item
    },

    addItem () {
      const code = {
        id: Number(this.sort.id),
        text: this.sort.item
      }
      this.sort.items.push(code)
      this.sort.id = 1
      this.sort.item = ''
    },

    removeItem () {
      this.sort.items.splice(this.sort.index ,1)
      this.sort.id = 1
      this.sort.item = ''
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
        page: this.page,
        question: {
          items: this.sort.items
        }
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
.drag-box {
  background-color: #92cfd8;
  min-height: 120px;
  border-radius: 10px;
}
.drop-box {
  background-color: #d1d892;
  min-height: 120px;
  border-radius: 10px;
}
</style>
