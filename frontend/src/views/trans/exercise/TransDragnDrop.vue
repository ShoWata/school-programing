<template>
  <div class="form py-8" id="form">
    <div
      id="select"
      class="px-6 py-2"
    >
      <v-form>
        <v-row class="mb-5">
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="before.lesson.select"
              :items="before.lesson.items"
              @change="selectLesson"
              label="Lessonを選択"
              required
            ></v-select>
          </v-col>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="before.exercise.select"
              :items="before.exercise.items"
              @change="selectExercise"
              label="Exerciseを選択"
            ></v-select>
          </v-col>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="before.question.select"
              :items="before.question.items"
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
        </v-row>

        <div class="mb-5">
          <p class="font-weight-bold">から</p>
        </div>

        <v-row>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="after.lesson.select"
              :items="after.lesson.items"
              label="Lessonを選択"
              required
            ></v-select>
          </v-col>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="after.exercise.select"
              :items="after.exercise.items"
              label="Exerciseを選択"
            ></v-select>
          </v-col>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="after.question.select"
              :items="after.question.items"
              label="Questionを選択"
            ></v-select>
          </v-col>
          <v-col
            sm="12"
            md="2"
          >
            <v-btn
              @click="dialogData"
              color="#4badbd"
              dark
            >送信</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>

    <div
      id="titleEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">サブテキストの編集</h3>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="data.subText"
            label="サブテキスト"
            clearable
          ></v-text-field>
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
          <markdown :markdownText="data.expText"></markdown>
        </v-col>
      </v-row>
    </div>

    <div
      id="dragItemEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">Drag Itemの編集</h3>
      <v-row>
        <v-col
          sm="12"
          md="10"
        >
          <h4 class="mb-6">選択肢</h4>
          <div class="drag-items px-5 py-3">
            <v-row>
              <v-col
                sm="12"
                md="6"
                v-for="(item, index) in data.dragItems"
                class="d-flex px-2 py-1"
                :key="index"
                style="height: 2.8em;"
              >
                <div class="mr-7">
                  <p>id: {{ item.id }}</p>
                </div>
                <div
                  v-html="item.text"
                  class="drag-item text-center"
                ></div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      id="dropItemEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">Drop Itemの編集</h3>
      <v-row>
        <v-col
          sm="12"
          md="6"
        >
          <div class="drop-area px-6 py-4">
            <template v-for="(items, i) in data.disDropItems">
              <div
                class="code-line d-flex justify-start"
                :key="i"
              >
                <div
                  class="line-number mr-4"
                >{{ i + 1 }}.</div>
                <template v-for="(item, index) in items">
                  <template v-if="item.className!=='bank-line'">
                    <div
                      :class="'drop-item-area '+item.className"
                      :key="index"
                      :style="'width: '+item.width+';'"
                    >
                    </div>
                  </template>
                </template>
              </div>
            </template>
          </div>
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
            v-model="data.nextPath"
            label="次のPathを入力"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="data.btnText"
            label="次のページに進むボタン名"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="data.backPath"
            label="スライドに戻るPath"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <v-dialog
      v-model="dialog.open"
      height="300px"
      width="300px"
    >
      <v-card
        class="elevation-2 py-4 px-6"
        rounded="lg"
      >
        <template v-if="!dialog.success">
          <v-card-text>
            <p>Lesson : {{ after.lesson.select }}</p>
            <p>exercise : {{ after.exercise.select }}</p>
            <p>question : {{ after.question.select }}</p>
            <p>に変更</p>
          </v-card-text>
          <v-card-actions
            class="mt-5"
          >
            <v-spacer></v-spacer>
            <v-btn
              @click="postData"
              color="#4badbd"
              dark
              depressed
            >送信</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </template>
        <template v-else>
          <p class="text-center my-6 font-weight-bold red--text">{{ dialog.msg }}</p>
        </template>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import Markdown from '@/components/functions/Markdown.vue'

export default {
  data () {
    return {
      before: {
        lesson: {
          items: [
            'lesson1',
            'lesson2',
            'lesson3',
            'lesson4',
            'lesson5',
            'lesson6',
            'lesson7',
            'lesson8',
            'lesson9'
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
      after: {
        lesson: {
          items: [
            'lesson1',
            'lesson2',
            'lesson3',
            'lesson4',
            'lesson5',
            'lesson6',
            'lesson7',
            'lesson8',
            'lesson9'
          ],
          select: null
        },
        exercise: {
          items: [
            'exercise1',
            'exercise2',
            'exercise3',
            'exercise4',
            'exercise5',
            'exercise6',
            'exercise7'
          ],
          select: null
        },
        question: {
          items: [
            'question1',
            'question2',
            'question3',
            'question4',
            'question5'
          ],
          select: null
        }
      },
      data: {
        subText: '',
        backPath: '',
        nextPath: '',
        btnText: '',
        expText: '',
        dragItems: [],
        dropItems: [],
        disDropItems: []
      },
      dialog: {
        open: false,
        success: false,
        msg: '',
      }
    }
  },
  components: {
    'markdown': Markdown
  },
  methods: {
    selectLesson () {
      this.before.exercise.select = null
      this.before.question.select = null
      this.before.exercise.items = []
      this.before.question.items = []
      firestore.collection('lessons').doc(this.before.lesson.select).collection('exercises').get().then(snapshot => {
        snapshot.forEach(doc => {
          this.before.exercise.items.push(doc.id)
        })
      })
    },

    selectExercise () {
      this.before.question.items = []
      firestore.collection('lessons').doc(this.before.lesson.select)
        .collection('exercises').doc(this.before.exercise.select)
        .collection('questions').get().then(snapshot => {
        snapshot.forEach(doc => {
          this.before.question.items.push(doc.id)
        })
      })
    },

    read () {
      const ref = firestore.collection('lessons').doc(this.before.lesson.select)
        .collection('exercises').doc(this.before.exercise.select)
      
      ref.get().then(doc => {
        this.data.subText = doc.data().subText
      })

      ref.collection('questions').doc(this.before.question.select)
        .get().then(doc => {
          this.data.backPath = doc.data().backPath
          this.data.nextPath = doc.data().nextPath
          this.data.btnText = doc.data().btnText
          this.data.expText = doc.data().expText
          this.data.dragItems = doc.data().dragItems
          this.data.dropItems = doc.data().dropItems
          this.setDropItems(doc.data().dropItems)
        })
    },

    setDropItems (dropItems) {
      var items = []

      for (var item of dropItems) {
        var dropItem = {
          id: null,
          text: '',
          className: item.className,
          width: item.width
        }

        items.push(dropItem)

        if (item.newLine) {
          this.data.disDropItems.push(items)
          items = []
        }
      }
    },

    dialogData () {
      this.dialog.open = true
    },

    postData () {
      const ref = firestore.collection('lessons').doc(this.after.lesson.select)
        .collection('exercises').doc(this.after.exercise.select)

      ref.set({
        subText: this.data.subText
      },{ merge: true })
      .then(() => {
        console.log('Docuemnts successfully written')
      }).catch(error => {
        console.error('Error wrtiting documents: ', error)
      })

      ref.collection('questions').doc(this.after.question.select)
        .set({
          backPath: this.data.backPath,
          nextPath: this.data.nextPath,
          btnText: this.data.btnText,
          expText: this.data.expText,
          dragItems: this.data.dragItems,
          dropItems: this.data.dropItems
        })
        .then(() => {
          console.log('Docuemnts successfully written')
          this.dialog.success = true
          this.dialog.msg = '送信しました'
          setTimeout(() => {
            this.dialog.open = false
            this.dialog.success = false
            this.dialog.msg = ''
          }, 2000)
        }).catch(error => {
          console.error('Error wrtiting documents: ', error)
          this.dialog.success = true
          this.dialog.msg = 'エラー'
          setTimeout(() => {
            this.dialog.open = false
            this.dialog.success = false
            this.dialog.msg = ''
          }, 2000)
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

.drop-area {
  background-color: #F5F5F5;
  border-radius: 0.8em;
}
  .code-line {
    margin-bottom: 0.08em;
    height: 1.24em;
  }
    .drop-item-area {
      border: 0.143em dashed #b1dee5;
    }
    .one-letter-space {
      margin-left: 0.755em;
    }
    .indent {
      margin-left: 3.07em;
    }
    .indent-double {
      margin-left: 6.22em;
    }
    .blank-line {
      border: 0 solid #F5F5F5;
    }
      .line-number {
        font-size: 1.05em;
        font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
        color: #123a52;
      }
</style>
