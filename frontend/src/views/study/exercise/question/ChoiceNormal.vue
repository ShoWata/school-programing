<template>
  <v-card
    flat
    tile
    style="max-width: 700px;"
  >
    <template v-if="loading">
      <div class="text-center">
        <v-progress-circular
          size="50"
          color="cyan"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>

    <template v-if="!loading">
      <h3
        class="blue-grey--text text--darken-2 mt-6 mb-3"
        style="font-size: 1.14em; letter-spacing: 0.07em;"
      >Question {{ q }}</h3>

      <markdown
        class="mb-16"
        :markdownText="expText"
      ></markdown>

      <template v-if="type==='choice'">
        <v-radio-group
          v-model="answer"
          class="mb-8 mt-0 pa-0"
        >
          <p
            class="font-weight-bold mb-5"
            style="color: #083947;"
          >{{ question.text }}</p>

          <v-radio
            v-for="(choice, index) in question.choices"
            :key="index"
            :value="index+1"
            color="cyan darken-2"
            class="px-10 py-2 mb-2"
          >
            <template v-slot:label>
              <template v-if="question.code">
                <no-num-highlight
                  class="ml-6 my-0 pl-5 py-1"
                  :recievedCode="choice"
                  style="min-width: 350px;"
                ></no-num-highlight>
              </template>

              <template v-else>
                <div class="choice">{{ choice }}</div>
              </template>
            </template>
          </v-radio>
        </v-radio-group>
      </template>

      <template v-if="type==='normal'">
        <v-card-text class="mb-4">
          <v-row class="px-2">
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="answer"
                autocomplete="off"
                color="cyan"
                :label="question.label"
                style="max-width: 300px;"
                type="text"
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-card-actions class="px-6">
                <v-btn
                  v-if="type==='normal' && answer"
                  @click="check"
                  class="font-weight-bold"
                  color="yellow darken-1"
                  dark
                  depressed
                >解答する</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </template>

      <v-card-actions>
        <page-btn
          class="mr-10"
          :color="'yellow darken-1'"
          :path="'/'+user.user+page.backPath"
          :text="'スライドに戻る'"
        ></page-btn>

        <page-btn
          v-if="done"
          class="ml-10 mr-4"
          :color="'#4badbd'"
          :path="'/'+user.user+page.nextPath"
          :text="page.btnText"
        ></page-btn>

        <v-spacer></v-spacer>

        <v-btn
          v-if="type==='choice' && answer"
          @click="check"
          class="font-weight-bold ml-4"
          color="yellow darken-1"
          dark
          depressed
        >解答</v-btn>
      </v-card-actions>
    </template>

    <q-dialog
      ref="dialog"
      :user="user.user"
      :loading="dialog.loading"
      :page="page"
      :msg="dialog.msg"
    ></q-dialog>
  </v-card>
</template>

<script>
import firestore from '@/firebase/firestore'
import { unlockLesson } from '@/plugins/unlock-lesson'
import NonNumHighlight from '@/components/functions/syntax-highlight/NonNumHighlight.vue'
import Markdown from '@/components/functions/Markdown.vue'
import QuestionDialog from '@/components/layouts/dialogs/QuestionDialog.vue'
import PageTransBtn from '@/components/buttons/pages/TransButton.vue'

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
      type: '',
      done: false,
      user: {},
      expText: '',
      question: {},
      answer: null,
      page: {},
      dialog: {
        loading: false,
        msg: ''
      }
    }
  },
  components: {
    Markdown,
    'no-num-highlight': NonNumHighlight,
    'q-dialog': QuestionDialog,
    'page-btn': PageTransBtn
  },
  created () {
    this.getData(this.l, this.exe, this.q)
  },
  watch: {
    $route (to) {
      const path = to.path.split('/')
      const l = path[3]
      const exe = path[5]
      const q = path[6]
      this.getData(l, exe, q)
    }
  },
  beforeDestroy () {
    if (this.answer) {
      sessionStorage.setItem(this.qID + ':' + this.user.name, this.answer)
    }
  },
  methods: {
    getData (l, exe, q) {
      this.initialize(l, exe, q)
      this.getSessnioData()

      if (this.user.user === 'student') {
        this.getStudentData(l, exe, q)
      } else {
        this.getExerciseData(l, exe, q)
      }
    },

    initialize (l, exe, q) {
      this.qID = 'l' + l + 'e' + exe + 'q' + q
      this.user = this.$store.getters.user
      this.done = false

      if (this.user.user !== 'student') this.done = true

      this.answer = null
    },

    getSessnioData () {
      const answer = sessionStorage.getItem(this.qID + ':' + this.user.name)
      if (answer) {
        this.answer = answer
      }
    },

    getExerciseData (l, exe, q) {
      const ref = firestore.collection('lessons').doc('lesson' + l)
        .collection('exercises').doc('exercise' + exe)
        .collection('questions').doc('question' + q)

      ref.get().then(doc => {
        if (doc.exists) {
          this.type = doc.data().type
          this.expText = doc.data().expText
          this.question = doc.data().question
          this.page = doc.data().page

          if (this.user.user === 'student' && this.done) {
            this.answer = this.question.answer
          }
        } else {
          console.log('No docuemnts')
        }
        this.loading = false
      })
    },

    getStudentData (l, exe, q) {
      if (this.user.questions.includes(this.qID) ||
        parseInt(this.qID[1]) <= this.user.lesson
      ) {
        this.done = true
      } else {
        this.user.work = true
        this.user.workPath = this.$route.path
        this.$store.commit('setUser', this.user)
      }
      this.getExerciseData(l, exe, q)
    },

    postStudentData () {
      const l = this.qID[1]
      if (String(this.user.lesson + 1) === l &&
        !this.user.questions.includes(this.qID) &&
        this.done
      ) {
        this.user.work = false
        this.user.workPath = ''
        this.user.questions.push(this.qID)

        if (unlockLesson(this.user.lesson, this.user.questions)) {
          this.user.lesson += 1
          this.user.questions = []
        }
      }

      this.$store.commit('setUser', this.user)
      this.$store.dispatch('postStudentExerciseData', {
        qID: this.qID,
        done: this.done,
        code: null,
        items: null
      })
    },

    check () {
      this.dialog.loading = true
      this.$refs.dialog.openCheckDialog()

      if (this.answer === this.question.answer) {
        this.$refs.dialog.showPageBtn()
        this.dialog.msg = '正解です！'

        if (this.user.user === 'student') {
          this.done = true
          this.postStudentData(false, '')
        }
      } else {
        this.dialog.msg = '残念！もう一度トライしてみよう！'
      }

      setTimeout(() => {
        this.dialog.loading = false
      }, 700)
    }
  }
}
</script>

<style scoped>
.markdown {
  font-size: 0.96em;
  color: #083947;
  letter-spacing: 0.05em;
}

.choice {
  font-size: 0.96em;
  color: #083947;
}
</style>
