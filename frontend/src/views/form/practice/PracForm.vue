<template>
  <div class="form py-8" id="form">
    <div
      id="select"
      class="px-6 py-2"
    >
      <v-form>
        <v-row>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="selects.practice.select"
              :items="selects.practice.items"
              label="Practiceを選択"
              required
            ></v-select>
          </v-col>

          <v-col
            sm="12"
            md="3"
          >
            <v-btn
              @click="readPractice"
              color="#4badbd"
              dark
            >読み込む</v-btn>
          </v-col>

          <v-col
            sm="12"
            md="3"
          >
            <v-btn
              @click="addPractice"
              color="#4badbd"
              dark
            >追加する</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>

    <v-divider class="mb-8"></v-divider>

    <h3
      v-if="addData"
      class="ml-12 mb-9"
    >追加するものを編集してください！</h3>

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
              v-model="expText.text"
              filled
              height="400px"
            ></v-textarea>
          </div>
        </v-col>

        <v-col cols="6">
          <markdown :markdownText="expText.text"></markdown>
        </v-col>

        <v-col cols="6">
          <v-btn
            @click="resetText"
            color="#4badbd"
            dark
            large
          >戻す</v-btn>
        </v-col>
      </v-row>
    </div>

    <div
      id="pathEditor"
      class="px-12 py-6"
    >
      <h3 class="mb-8">終了Lesson</h3>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="lesson"
            label="次のPathを入力"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div
      id="preview"
      class="mb-8"
    >
      <h3 class="px-4 mb-12 ml-8">プレビュー</h3>

      <v-container class="px-3 py-7">
        <h2 class="grey--text text--darken-3 mb-10">Practice</h2>

        <div class="mb-6">
          <markdown
            :markdownText="expText.text"
            style="max-width: 800px"
          ></markdown>
        </div>

        <div
          class="mb-6"
          id="inputfile"
        >
          <v-row>
            <v-col
              sm="12"
              md="6"
            >
              <read-file @catchContent="readFileContent"></read-file>
            </v-col>
          </v-row>
        </div>

        <div
          v-if="code.code"
          class="mb-10"
          id="preview"
        >
          <syntaxHighlight :recievedCode="code.code"></syntaxHighlight>
        </div>

        <div id="submit">
          <v-btn
            class="font-weight-bold mx-8"
            color="yellow darken-2"
            dark
            depressed
            large
          >提出する</v-btn>
        </div>
      </v-container>
    </div>

    <v-divider class="mb-8"></v-divider>

    <div class="btn text-center">
      <v-btn
        @click="postData"
        color="#4badbd"
        class="mx-7"
        dark
        large
      >{{ textBtn }}</v-btn>
    </div>

  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import Markdown from '@/components/functions/Markdown.vue'
import ReadFile from '@/components/functions/ReadLocalFile.vue'

export default {
  data () {
    return {
      selects: {
        practice: {
          items: [],
          select: null
        }
      },
      addData: false,
      expText: {
        text: '',
        reset: ''
      },
      lesson: 0,
      code: {
        code: ''
      },
      textBtn: '更新'
    }
  },
  components: {
    Markdown,
    'read-file': ReadFile
  },
  created () {
    for (var i = 0; i < 6; i++) {
      this.selects.practice.items.push('practice' + String(i + 1))
    }
  },
  methods: {
    initialize () {
      this.expText.reset = ''
      this.expText.text = ''
      this.lesson = ''
    },

    readPractice () {
      this.addData = false
      this.initialize()

      const ref = firestore.collection('practices').doc(this.selects.practice.select)

      ref.get().then(doc => {
        this.expText.text = doc.data().expText
        this.expText.reset = doc.data().expText
        this.lesson = doc.data().lesson
      })
    },

    addPractice () {
      this.addData = true
      this.textBtn = '追加'
      this.initialize()
    },

    resetText () {
      this.expText.text = this.expText.reset
    },

    readFileContent (content) {
      this.code.code = content
    },

    postData () {
      const ref = firestore.collection('practices').doc(this.selects.practice.select)

      ref.set({
        expText: this.expText.text,
        lesson: this.lesson
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
pre {
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
  background-color: #f5f2f0;
  border-radius: 10px;
  padding: 20px 30px;
}
</style>
