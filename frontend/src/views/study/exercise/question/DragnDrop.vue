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
          class="px-2"
          cols="12"
          md="4"
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
              :color="'yellow darken-1'"
              :path="'/'+user.user+page.backPath"
              :text="'スライドに戻る'"
            ></page-btn>
          </v-card-actions>
        </v-col>

        <v-col
          class="pt-14 pb-2 px-4"
          cols="12"
          md="8"
        >
          <div
            @dragover="overDragItemsArea"
            @dragleave="leaveDragItemsArea"
            @dragover.prevent
            @drop="backItem($event)"
            class="drag-items px-5 py-3 mb-4"
            ref="dragItems"
          >
            <h4 class="mb-2 grey--text text--darken-2">選択肢</h4>

            <v-row>
              <v-col
                v-for="(item,index) in DragItems"
                class="px-2 py-1"
                :cols="item.cols"
                :key="index"
                style="height: 2.4em;"
              >
                <div
                  v-html="item.text"
                  class="drag-item text-center"
                  draggable
                  @dragstart="dragStart($event, item.id, null, null)"
                ></div>
              </v-col>
            </v-row>
          </div>

          <v-row
            justify="center"
            class="mb-4"
          >
            <v-icon
              color="yellow darken-1"
              x-large
            >mdi-arrow-down-bold</v-icon>
          </v-row>

          <div class="drop-area px-6 py-4 mb-3">
            <template v-for="(items, i) in dropItems">
              <div
                class="code-line d-flex justify-start"
                :key="i"
              >
                <div
                  class="line-number mr-3"
                >{{ i + 1 }}.</div>

                <template v-for="(item, index) in items">
                  <template v-if="item.className!=='bank-line'">
                    <template v-if="item.text">
                      <div
                        @dragover="overDropItemsArea($event, i, index)"
                        @dragover.prevent
                        @dragleave="leaveDropItemsArea($event, i, index)"
                        @drop="dropItem($event, i, index)"
                        :class="item.className"
                        :key="index"
                        ref="dropItemArea"
                        :style="'width: '+item.width+';'"
                      >
                        <div
                          v-html="item.text"
                          class="drop-item text-center ma-0 pa-0"
                          draggable
                          @dragstart="dragStart($event, item.id, i, index)"
                          @dragend="dragEnd($event, i, index)"
                        ></div>
                      </div>
                    </template>

                    <template v-else>
                      <div
                        @dragover="overDropItemsArea($event, i, index)"
                        @dragover.prevent
                        @dragleave="leaveDropItemsArea($event, i, index)"
                        @drop="dropItem($event, i, index)"
                        :class="'drop-item-area '+item.className"
                        :key="index"
                        ref="dropItemArea"
                        :style="'width: '+item.oWidth+';'"
                      >
                        <div
                          v-html="item.text"
                          class="drop-item text-center ma-0 pa-0"
                          draggable
                          @dragstart="dragStart($event, item.id, i, index)"
                          @dragend="dragEnd($event, i, index)"
                        ></div>
                      </div>
                    </template>
                  </template>
                </template>
              </div>
            </template>
          </div>

          <v-card-actions>
            <v-btn
              @click="dialogReset"
              class="font-weight-bold mr-3"
              color="yellow darken-1"
              dark
              depressed
            >リセット</v-btn>

            <v-btn
              v-if="done"
              @click="dialogAnswer"
              class="font-weight-bold ml-3"
              color="yellow darken-1"
              dark
              depressed
            >答え</v-btn>

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
              class="ml-3 font-weight-bold"
              color="yellow darken-1"
              dark
              depressed
            >解答する</v-btn>
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
import fireauth from '@/firebase/fireauth'
import firestore from '@/firebase/firestore'
import Markdown from '@/components/functions/Markdown.vue'
import QuestionDialog from '@/components/layouts/dialogs/QuestionDialog.vue'
import PageBtn from '@/components/buttons/pages/TransButton.vue'
import 'prismjs/themes/prism.css'

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
      dragItems: [],
      dropItems: [],
      isBack: false,
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
    'q-dialog': QuestionDialog,
    'page-btn': PageBtn
  },
  created () {
    this.getData(this.l, this.exe, this.q)
  },
  watch: {
    $route (to) {
      const path = to.path.split('/')
      this.getData(path[3], path[5], path[6])
    }
  },
  beforeDestroy () {
    if (this.user.user === 'student' && !this.done) {
      const resetDropItems = this.resetDropItems(this.dropItems)
      const items = { dragItems: this.dragItems, dropItems: resetDropItems }
      this.postStudentData(items)
    }

    const json = JSON.stringify({ dragItems: this.dragItems, dropItems: this.dropItems })
    sessionStorage.setItem(this.qID + ':' + this.user.name, json)
  },
  computed: {
    DragItems () {
      return this.dragItems.filter(item => item.drag)
    }
  },
  methods: {
    getData (l, exe, q) {
      this.initialize(l, exe, q)
      this.getSessionData()

      if (this.user.user === 'student') {
        this.getStudentData(l, exe, q)
      } else {
        this.getLessonData(l, exe, q)
      }
    },

    initialize (l, exe, q) {
      this.qID = 'l' + l + 'e' + exe + 'q' + q
      this.done = false
      this.user = this.$store.getters.user

      if (this.user.user !== 'student') this.done = true

      this.isBack = false
      this.dragItems = []
      this.dropItems = []
    },

    getSessionData () {
      const json = sessionStorage.getItem(this.qID + ':' + this.user.name)
      if (json) {
        const data = JSON.parse(json)
        this.dragItems = data.dragItems
        this.dropItems = data.dropItems
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
                this.done = doc.data().done

                if (this.dragItems.length === 0) {
                  this.dragItems = doc.data().dragItems
                }
                if (this.dropItems.length === 0) {
                  const dropItems = doc.data().dropItems
                  this.setDropItems(dropItems)
                }
              }

              if (!this.done) {
                this.user.work = true
                this.user.workPath = this.$route.path
                this.$store.commit('setUser', this.user)
              }

              this.getLessonData(l, exe, q)
            })
        }
      })
    },

    getLessonData (l, exe, q) {
      const ref = firestore.collection('lessons').doc('lesson' + l)
        .collection('exercises').doc('exercise' + exe)
        .collection('questions').doc('question' + q)

      ref.get().then((doc) => {
        if (doc.exists) {
          this.expText = doc.data().expText
          this.question = doc.data().question
          this.page = doc.data().page

          if (this.dragItems.length === 0) {
            this.dragItems = this.question.dragItems
          }
          if (this.dropItems.length === 0) {
            const dropItems = this.question.dropItems
            this.setDropItems(dropItems)
          }
        } else {
          console.log('No docuemnts')
        }
        this.loading = false
      })
    },

    postStudentData (items) {
      const l = this.qID[1]
      if (l === String(this.user.lesson + 1) &&
        !this.user.questions.includes(this.qID) &&
        this.done
      ) {
        this.user.work = false
        this.user.workPath = ''
        this.user.questions.push(this.qID)
      }

      this.$store.commit('setUser', this.user)
      this.$store.dispatch('postStudentExerciseData', {
        qID: this.qID,
        done: this.done,
        code: null,
        items: items
      })
    },

    setDropItems (dropItems) {
      var items = []

      for (var item of dropItems) {
        var dropItem = {
          id: null,
          text: '',
          className: item.className,
          oWidth: item.width,
          width: ''
        }

        if (Object.keys(item).length === 6) {
          dropItem = {
            id: item.id,
            text: item.text,
            className: item.className,
            oWidth: item.oWidth,
            width: item.width
          }
        }

        items.push(dropItem)

        if (item.newLine) {
          this.dropItems.push(items)
          items = []
        }
      }
    },

    resetDropItems (dropItems) {
      var resetItems = []

      dropItems.forEach(lineItems => {
        var resetLineItems = []

        lineItems.forEach(item => {
          item.newLine = false
          resetLineItems.push(item)
        })

        resetLineItems[lineItems.length - 1].newLine = true
        resetItems = resetItems.concat(resetLineItems)
      })

      return resetItems
    },

    dragStart (e, dragID, i, index) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'

      const item = JSON.stringify({ id: dragID, i: i, index: index })
      e.dataTransfer.setData('item', item)

      if (i !== null || index !== null) {
        this.isBack = true
      }
    },

    dragEnd (e, i, index) {
      if (!this.dropItems[i][index].text) {
        const parent = e.target.parentNode
        parent.className = 'drop-item-area ' + this.dropItems[i][index].className
        parent.style.width = this.dropItems[i][index].oWidth
      }
    },

    backItem (e) {
      const info = JSON.parse(e.dataTransfer.getData('item'))

      if (info.i !== null || info.index !== null) {
        const dragItem = this.dragItems.find(item => item.id === info.id)
        dragItem.drag = true

        this.dropItems[info.i][info.index].id = null
        this.dropItems[info.i][info.index].text = ''

        this.isBack = false
      }

      this.$refs.dragItems.className = 'drag-items px-5 py-3 mb-4'
    },

    dropItem (e, i, index) {
      if (!this.dropItems[i][index].id) {
        const info = JSON.parse(e.dataTransfer.getData('item'))
        const dragItem = this.dragItems.find(item => item.id === info.id)

        if (info.index === null) {
          this.dropItems[i][index].id = dragItem.id
          this.dropItems[i][index].text = dragItem.text
          this.dropItems[i][index].width = dragItem.width

          dragItem.drag = false
        } else if (info.i !== i || info.index !== index) {
          this.dropItems[i][index].id = dragItem.id
          this.dropItems[i][index].text = dragItem.text
          this.dropItems[i][index].width = dragItem.width

          this.dropItems[info.i][info.index].id = null
          this.dropItems[info.i][info.index].text = ''
        }
      }
      this.isBack = false
    },

    overDragItemsArea () {
      if (this.isBack) {
        this.$refs.dragItems.className = 'over-drag-items px-5 py-3 mb-4'
      }
    },

    leaveDragItemsArea () {
      if (this.isBack) {
        this.$refs.dragItems.className = 'drag-items px-5 py-3 mb-4'
      }
    },

    overDropItemsArea (e, i, index) {
      if (!this.dropItems[i][index].text) {
        e.target.className = 'over-drop-item-area ' + this.dropItems[i][index].className
      }
    },

    leaveDropItemsArea (e, i, index) {
      if (!this.dropItems[i][index].text) {
        e.target.className = 'drop-item-area ' + this.dropItems[i][index].className
      }
    },

    dialogAnswer () {
      this.$refs.dialog.openAnswerDialog()
      this.dialog.msg = '解答を表示させてもいいですか？'
    },

    showAnswer () {
      this.dragItems.forEach(item => {
        item.drag = false
      })

      const dropItems = this.resetDropItems(this.dropItems)

      var index = 1
      var answer = []
      dropItems.forEach(item => {
        var dropItem = item
        if (item.className !== 'blank-line') {
          const dragItem = this.dragItems.find(item => item.id === index)
          dropItem.id = dragItem.id
          dropItem.text = dragItem.text
          dropItem.width = dragItem.width
          index++
        }
      })

      this.setDropItems(answer)
    },

    dialogReset () {
      this.$refs.dialog.openResetDialog()
      this.dialog.msg = 'リセットしてもいいですか？'
    },

    resetCode () {
      this.dropItems.forEach(items => {
        items.forEach(item => {
          item.id = null
          item.text = ''
        })
      })

      this.dragItems.forEach(item => {
        item.drag = true
      })
    },

    check () {
      this.dialog.loading = true
      this.$refs.dialog.openCheckDialog()

      var answer = 1
      var isRight = true

      const resetDropItems = this.resetDropItems(this.dropItems)
      for (var item of resetDropItems) {
        if (item.className !== 'blank-line') {
          if (item.id === answer) {
            answer++
          } else {
            isRight = false
            this.dialog.msg = '間違っています'
            break
          }
        }
      }

      if (isRight) {
        this.$refs.dialog.showPageBtn()
        this.dialog.msg = '正解です！'

        if (this.user.user === 'student') {
          this.done = true

          const resetDropItems = this.resetDropItems(this.dropItems)
          const items = { dragItems: this.dragItems, dropItems: resetDropItems }
          this.postStudentData(items)
        }
      }

      setTimeout(() => {
        this.dialog.loading = false
      }, 1000)
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
.token {
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
}
.token.extra {
  color: #000;
}

.drag-items {
  position: relative;
  width: 100%;
  min-height: 360px;
  border: 0.194em dashed #87c3cc;
  border-radius: 0.8em;
}
.over-drag-items {
  width: 100%;
  min-height: 360px;
  background-color: #f4f7df;
  border: 0.185em dashed #d1d892;
  border-radius: 0.8em;
}
  .drag-item {
    position: relative;
    display: inline;
    cursor: pointer;
    font-size: 1.05em;
  }
  .drag-item:hover {
    font-size: 1.24em;
    opacity: 0.65;
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
      height: 1.24em;
      border: 0.125em dashed #b1dee5;
    }
    .over-drop-item-area {
      background-color: #E0E0E0;
      border: 0em dashed #E0E0E0;
    }
    .no-space {
      margin-left: 0.001em;
    }
    .one-letter-space {
      margin-left: 0.61em;
    }
    .indent {
      margin-left: 3.17em;
    }
    .indent-double {
      margin-left: 5.04em;
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
