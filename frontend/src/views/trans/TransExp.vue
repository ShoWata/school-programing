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
              v-model="before.explanation.select"
              :items="before.explanation.items"
              @change="selectExplanation"
              label="Explanationを選択"
            ></v-select>
          </v-col>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="before.content.select"
              :items="before.content.items"
              label="Contentを選択"
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
              v-model="after.explanation.select"
              :items="after.explanation.items"
              label="Explanationを選択"
            ></v-select>
          </v-col>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="after.content.select"
              :items="after.content.items"
              label="Contentを選択"
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
      <h3 class="mb-4">タイトルの編集</h3>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="data.title"
            label="タイトル"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <!-- <div
      id="image"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">画像URL</h3>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="data.imageURL"
            label="画像URL"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div
      id="codeEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">コードの編集</h3>
      <v-row>
        <template v-if="data.codes.length > 0">
          <v-col
            v-for="(code, index) in data.codes"
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
      id="tableEditor"
      class="px-12 py-6"
    >
      <h3 class="mb-8">表の編集</h3>
      <v-row>
        <v-col cols="6">
          <markdown :markdownText="data.table"></markdown>
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
          <markdown :markdownText="data.text"></markdown>
        </v-col>
      </v-row>
    </div> -->

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
            <p>explanation : {{ after.explanation.select }}</p>
            <p>content : {{ after.content.select }}</p>
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
// import Markdown from '@/components/functions/Markdown.vue'
// import Highlight from '@/components/functions/syntax-highlight/Highlight.vue'

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
        explanation: {
          items: [],
          select: null
        },
        content: {
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
        explanation: {
          items: [
            'explanation1',
            'explanation2',
            'explanation3',
            'explanation4',
            'explanation5',
            'explanation6',
            'explanation7',
            'explanation8',
            'explanation9',
            'explanation10',
            'explanation11'
          ],
          select: null
        },
        content: {
          items: [
            'content1',
            'content2',
            'content3',
            'content4',
            'content5',
            'content6',
            'content7',
          ],
          select: null
        }
      },
      data: {
        title: '',
        backPath: '',
        nextPath: '',
        btnText: '',
        imageURL: '',
        codes: [],
        table: '',
        contents: [],
        text: ''
      },
      dialog: {
        open: false,
        success: false,
        msg: '',
      }
    }
  },
  components: {
    // 'markdown': Markdown,
    // 'highlight': Highlight
  },
  methods: {
    selectLesson () {
      this.before.explanation.select = null
      this.before.content.select = null
      this.before.explanation.items = []
      this.before.content.items = []
      firestore.collection('lessons').doc(this.before.lesson.select).collection('explanations').get().then(snapshot => {
        snapshot.forEach(doc => {
          this.before.explanation.items.push(doc.id)
        })
      })
    },

    selectExplanation () {
      this.before.content.items = []
      firestore.collection('lessons').doc(this.before.lesson.select)
        .collection('explanations').doc(this.before.explanation.select)
        .collection('contents').get().then(snapshot => {
        snapshot.forEach(doc => {
          this.before.content.items.push(doc.id)
        })
      })
    },

    read () {
      const ref = firestore.collection('lessons').doc(this.before.lesson.select)
        .collection('explanations').doc(this.before.explanation.select)
      
      ref.get().then(doc => {
        this.data.title = doc.data().title
        this.data.backPath = doc.data().backPath
        this.data.nextPath = doc.data().nextPath
        this.data.btnText = doc.data().btnText
      })

      ref.collection('contents').get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.data.contents.push(doc.data())
          })
        })

      // ref.collection('contents').doc(this.before.content.select)
      //   .get().then(doc => {
      //     this.data.imageURL = doc.data().imageURL
      //     this.data.codes = doc.data().codes
      //     this.data.table = doc.data().table
      //     this.data.text = doc.data().text
      //   })
    },

    dialogData () {
      this.dialog.open = true
    },

    postData () {
      const ref = firestore.collection('lessons').doc(this.before.lesson.select)
        .collection('explanations').doc(this.before.explanation.select)

      ref.get().then(doc => {
        this.data.backPath = doc.data().backPath
        this.data.nextPath = doc.data().nextPath
        this.data.btnText = doc.data().btnText

        ref.collection('contents').get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              this.data.contents.push(doc.data())
            })

            ref.set({
              page: {
                backPath: this.data.backPath,
                nextPath: this.data.nextPath,
                btnText: this.data.btnText
              },
              code: true,
              contents: this.data.contents
            }, { merge: true })
            .then(() => {
              console.log('Docuemnts successfully written')
              this.data.contents = []
              this.data.backPath = ''
              this.data.nextPath = ''
              this.data.btnText = ''
            }).catch(error => {
              console.error('Error wrtiting documents: ', error)
            })
        })
      })

      // ref.collection('contents').doc(this.after.content.select)
      //   .set({
      //     imageURL: this.data.imageURL,
      //     codes: this.data.codes,
      //     table: this.data.table,
      //     text: this.data.text
      //   }, { merge: true })
      //   .then(() => {
      //     console.log('Docuemnts successfully written')
      //     this.dialog.success = true
      //     this.dialog.msg = '送信しました'
      //     this.resetAll
      //     setTimeout(() => {
      //       this.dialog.open = false
      //       this.dialog.success = false
      //       this.dialog.msg = ''
      //     }, 2000)
      //   }).catch(error => {
      //     console.error('Error wrtiting documents: ', error)
      //     this.dialog.success = true
      //     this.dialog.msg = 'エラー'
      //     setTimeout(() => {
      //       this.dialog.open = false
      //       this.dialog.success = false
      //       this.dialog.msg = ''
      //     }, 2000)
      //   })
    },

    resetAll () {
      this.before.explanation.select = null
      this.before.content.select = null
      this.before.explanation.items = []
      this.before.content.items = []
      this.after.explanation.select = null
      this.after.content.select = null

      this.data.title = ''
      this.data.backPath = ''
      this.data.nextPath = ''
      this.data.btnText = ''
      this.data.imageURL = ''
      this.data.codes = ''
      this.data.table = ''
      this.data.text = ''
    }
  }
}
</script>