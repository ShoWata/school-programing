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
      id="CodeEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">全体のコード編集</h3>

      <v-row>
        <v-col cols="6">
          <div
            id="editor"
            class="mb-6"
          >
            <editor
              ref="editor"
              :code="''"
              :idName="'python-editor'"
              style="width: 100%; height: 500px;"
            ></editor>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      id="dragItemEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">Drag Itemの編集</h3>

      <v-row>
        <v-col cols="6">
          <div
            id="editor"
            class="mb-6"
          >
            <v-textarea
              v-model="drag.text"
              filled
              height="400px"
            ></v-textarea>
          </div>
        </v-col>

        <v-col cols="6">
          <div id="itemPreview">
            <markdown
              class="mb-4"
              :markdownText="drag.text"
            ></markdown>

            <v-text-field
              v-model="drag.id"
              class="mb-2"
              label="idを入力"
              clearable
            ></v-text-field>

            <v-text-field
              v-model="drag.width"
              class="mb-2"
              label="widthを入力"
              clearable
            ></v-text-field>

            <v-text-field
              v-model="drag.cols"
              class="mb-2"
              label="colsを入力"
              clearable
            ></v-text-field>

            <div
              id="sizing"
              class="mb-4"
              style="background-color: #F5F5F5;"
            >
              <div
                v-html="drag.text"
                class="drop-item text-center ma-0 pa-0"
                :style="'width: '+drag.width+';'"
              ></div>
            </div>

            <div id="buttons">
              <v-btn
                @click="readDragItem"
                class="mr-2"
                color="#4badbd"
                dark
              >読み込む</v-btn>

              <v-btn
                @click="updateDragItem"
                class="mx-2"
                color="#4badbd"
                dark
              >更新する</v-btn>

              <v-btn
                @click="addDragItem"
                class="mx-2"
                color="#4badbd"
                dark
              >追加する</v-btn>

              <v-btn
                @click="removeDragItem"
                class="ml-2"
                color="#4badbd"
                dark
              >削除する</v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

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
                v-for="(item, index) in drag.items"
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
        <v-col cols="6">
          <div id="dropItemEditor">
            <v-text-field
              v-model="drop.index"
              class="mb-2"
              label="indexを入力"
              clearable
            ></v-text-field>

            <v-text-field
              v-model="drop.className"
              class="mb-2"
              label="classNameを入力"
              clearable
            ></v-text-field>

            <v-select
              v-model="drop.newLine.select"
              :items="drop.newLine.selects"
              label="改行しますか？"
              required
            ></v-select>

            <v-text-field
              v-model="drop.width"
              class="mb-2"
              label="widthを入力"
              clearable
            ></v-text-field>

            <v-btn
              @click="readDropItem"
              class="mr-2"
              color="#4badbd"
              dark
            >読み込む</v-btn>

            <v-btn
              @click="updateDropItem"
              class="mx-2"
              color="#4badbd"
              dark
            >更新する</v-btn>

            <v-btn
              @click="addDropItem"
              class="mx-2"
              color="#4badbd"
              dark
            >追加する</v-btn>

            <v-btn
              @click="removeDropItem"
              class="ml-2"
              color="#4badbd"
              dark
            >削除する</v-btn>
          </div>
        </v-col>

        <v-col
          sm="12"
          md="6"
        >
          <div class="drop-area px-6 py-4">
            <template v-for="(items, i) in drop.disItems">
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
import Editor from '@/components/functions/editor/Editor.vue'

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
      drag: {
        id: 1,
        index: 0,
        text: '<span class="token"></span>',
        width: 'em',
        cols: '8',
        items: [],
      },
      drop: {
        className: '',
        index: 0,
        newLine: {
          selects: ['Yes', 'No'],
          select: ''
        },
        width:'3em',
        items: [],
        disItems: []
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
    'editor': Editor
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
          this.page.backPath = doc.data().page.backPath
          this.page.nextPath = doc.data().page.nextPath
          this.page.btnText = doc.data().page.btnText
          this.drag.items = doc.data().question.dragItems
          this.drop.items = doc.data().question.dropItems

          this.setDropItems(this.drop.items)
        })
    },

    initialize () {
      this.expText = ''
      this.drag.id = 1
      this.drag.index = 0
      this.drag.text = '<span class="token"></span>'
      this.drag.width = 'em'
      this.drag.cols = '8'
      this.drag.items = []
      this.page.backPath = ''
      this.page.nextPath= ''
      this.page.btnText = ''
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

      firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('exercises').doc(this.selects.exercise.select)
        .get().then(doc => {
          this.subText = doc.data().subText
        })
      
      this.initialize()
    },

    readDragItem () {
      this.drag.index = this.drag.items.findIndex(({id}) => id === Number(this.drag.id))
      this.drag.text = this.drag.items[Number(this.drag.index)].text
      this.drag.width = this.drag.items[Number(this.drag.index)].width
    },

    updateDragItem () {
      this.drop.items[this.drop.index].text = this.drop.text
    },

    addDragItem () {
      const item = {
        drag: true,
        id: Number(this.drag.id),
        text: this.drag.text,
        width: this.drag.width,
        cols: this.drag.cols
      }
      this.drag.items.push(item)

      this.drag.id = 1
      this.drag.text = '<span class="token"></span>'
      this.drag.width = 'em'
      this.drag.cols = '8'
    },

    removeDragItem () {
      this.drag.items.splice(this.drag.index ,1)

      this.drag.id = 1
      this.drag.text = '<span class="token"></span>'
      this.drag.width = 'em'
      this.drag.cols = '8'
    },

    readDropItem () {
      if (this.drop.items.length !== 0) {
        this.drop.className = this.drop.items[Number(this.drop.index)].className
        if (this.drop.items[Number(this.drop.index)].newLine) {
          this.drop.newLine.select = this.drop.newLine.selects[0]
        } else {
          this.drop.newLine.select = this.drop.newLine.selects[1]
        }
        this.drop.width = this.drop.items[Number(this.drop.index)].width

        this.setDropItems(this.drop.items)
      }
    },

    updateDropItem () {
      if (this.drop.items.length !== 0) {
        this.drop.items[this.drop.index].className = this.drop.className
        if (this.drop.newLine.select === 'Yes') {
          this.drop.items[this.drop.index].newLine = true
        } else {
          this.drop.items[this.drop.index].newLine = false
        }
        this.drop.items[this.drop.index].width = this.drop.width

        this.setDropItems(this.drop.items)
      }
    },

    addDropItem () {
      var item = {
        className: this.drop.className,
        newLine: true,
        width: this.drop.width
      }

      if (this.drop.newLine.select === 'No') {
        item.newLine = false
        console.log(item)
      }

      this.drop.items.push(item)

      this.setDropItems(this.drop.items)

      this.drop.index = 0
      this.drop.className = ''
      this.drop.width = '3em'
    },

    removeDropItem () {
      this.drop.items.splice(this.drop.index, 1)
      
      this.drop.index = 0
      this.drop.className = ''
      this.drop.width = '3em'
    },

    setDropItems (dropItems) {
      this.drop.disItems = []
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
          this.drop.disItems.push(items)
          items = []
        }
      }
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
          dragItems: this.drag.items,
          dropItems: this.drop.items
        },
        page: this.page,
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
    .over-drop-item-area {
      background-color: #E0E0E0;
      border: 0em dashed #E0E0E0;
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
      .drop-item {
        cursor: pointer;
        font-size: 1.05em;
      }
      .drop-item:hover {
        opacity: 0.4;
      }
</style>
