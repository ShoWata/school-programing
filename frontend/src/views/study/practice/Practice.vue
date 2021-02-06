<template>
  <v-container class="px-3 py-7">
    <h2 class="pranc-title mb-10 px-6">Practice {{ p }}</h2>

    <template v-if="loading">
      <div class="text-center">
        <v-progress-circular
          size="50"
          color="cyan"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>

    <template v-else>
      <div class="mb-16 px-8">
        <markdown
          :markdownText="expText"
          style="max-width: 750px;"
        ></markdown>
      </div>
    </template>

    <v-divider class="mb-8"></v-divider>

    <div
      class="mb-6 px-6"
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

    <template v-if="code.loading">
      <div class="text-center mb-10">
        <v-progress-circular
          size="50"
          color="cyan"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>

    <template v-else>
      <div
        v-if="code.code"
        class="mb-10 px-6"
        id="preview"
      >
        <v-card
          class="pa-1 mb-4"
          color="#92cfd8"
          elevation="2"
          rounded="lg"
        >
          <p class="text-center white--text font-weight-bold px-8 mb-1">エディター（ちょっとした修正に使用してください）</p>

          <editor
            :code="code.code"
            :idName="'python-editor'"
            ref="editor"
            class="mb-2"
            style="width: 100%; min-height: 600px;"
          ></editor>

          <v-card-actions class="px-3 py-1">
            <v-btn
              @click="reset"
              class="font-weight-bold px-4"
              color="yellow darken-1"
              dark
              depressed
              large
            >リセット</v-btn>

            <v-spacer></v-spacer>
            <!-- <v-btn
              @click="commit"
              class="font-weight-bold px-6"
              color="yellow darken-1"
              dark
              depressed
              large
            >実行</v-btn> -->
          </v-card-actions>
        </v-card>
      </div>
    </template>

    <div id="submit">
      <v-btn
        @click="submit"
        class="font-weight-bold mx-8"
        color="yellow darken-1"
        dark
        depressed
        large
      >提出する</v-btn>
    </div>
  </v-container>
</template>

<script>
import fireauth from '@/firebase/fireauth'
import firestore from '@/firebase/firestore'
import Markdown from '@/components/functions/Markdown.vue'
import ReadLocalFile from '@/components/functions/ReadLocalFile.vue'
import Editor from '@/components/functions/editor/Editor.vue'

export default {
  props: {
    p: String
  },
  data () {
    return {
      loading: true,
      pID: '',
      user: {},
      code: {
        loading: false,
        code: ''
      },
      expText: '',
      lesson: 0
    }
  },
  components: {
    Markdown,
    Editor,
    'read-file': ReadLocalFile
  },
  created () {
    this.getData(this.p)
  },
  methods: {
    getData (p) {
      this.initialize(p)
      this.getPracticeData(p)

      if (this.user.user === 'student') {
        this.getStudentData(p)
      }
    },

    initialize (p) {
      this.pID = 'p' + p
      this.user = this.$store.getters.user
      this.code.code = ''
    },

    rediret () {
      if (this.user.lesson < this.lesson) {
        this.$router.push('/' + this.user.user + '/home')
      }
    },

    getPracticeData (p) {
      firestore.collection('practices').doc('practice' + p)
        .get().then(doc => {
          if (doc.exists) {
            this.expText = doc.data().expText
            this.lesson = doc.data().lesson
          } else {
            console.log('No Documents')
          }
          this.loading = false
        })
    },

    getStudentData () {
      fireauth.onAuthStateChanged(user => {
        const uid = fireauth.currentUser.uid
        firestore.collection('students').doc(uid)
          .collection('practices').doc(this.pID)
          .get().then(doc => {
            if (doc.exists) {
              this.code.code = doc.data().code
            }
            this.code.loading = false
          })
      })
    },

    readFileContent (content) {
      this.code = content
    },

    reset () {
      this.$refs.editor.setCode()
    },

    submit () {
      if (this.user.user === 'student') {
        fireauth.onAuthStateChanged(user => {
          const uid = fireauth.currentUser.uid
          firestore.collection('students').doc(uid)
            .collection('practices').doc(this.pID)
            .set({ code: this.code.code }, { merge: true })
        })
      } else {
        sessionStorage.setItem(this.pID + ':' + this.user.name, this.code.code)
      }
    }
  }
}
</script>

<style scoped>
.pranc-title {
  font-family: YuGothic,'游ゴシック', sans-serif;
  font-size: 1.5em;
  color: #37474F;
  letter-spacing: 0.1em;
}

.markdown {
  font-size: 0.98em;
  color: #083947;
  letter-spacing: 0.05em;
  letter-spacing: 0.003em;
}
</style>
