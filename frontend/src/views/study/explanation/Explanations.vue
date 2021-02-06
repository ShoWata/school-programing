<template>
  <div
    class="px-2 pt-1"
    style="height: 100%; background-color: #e8ecf0;"
  >
    <v-card
      :loading="loading"
      elevation="3"
      style="border-radius: 1rem;"
    >
      <template slot="progress">
        <v-progress-linear
          color="cyan"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>

      <transition name="show">
        <div
          v-if="title.show"
          class="d-flex px-16 pt-5 pb-2 mb-3"
        >
          <h2 class="exp-title font-weight-black">
            <v-icon
              class="mr-4 mb-1"
              color="yellow darken-1"
            >mdi-thumb-up</v-icon>
            {{ title.text }}
          </h2>

          <back-btn
            v-if="backQue"
            class="ml-auto"
            :color="'#4badbd'"
            :path="user.workPath"
            :text="'問題に戻る'"
          ></back-btn>
        </div>
      </transition>

      <transition name="show">
        <v-window
          v-if="window.show"
          v-model="window.active"
        >
          <v-window-item
            v-for="(content, index) in contents"
            :key="index"
            flat
            tile
          >
            <exp-window
              @catchCode="startCodeDialog"
              :imageURL="content.imageURL"
              :codes="content.codes"
              :markdownText="content.text"
              :table="content.table"
              style="height: 100%;"
            ></exp-window>
          </v-window-item>
        </v-window>
      </transition>

      <transition name="show">
        <v-card-actions
          v-if="window.show"
          class="btn-container px-12 pt-3 pb-4"
        >
          <back-btn
            v-if="page.backPath"
            class=""
            :color="'yellow darken-1'"
            :path="'/'+user.user+page.backPath"
            :text="'戻る'"
          ></back-btn>

          <v-spacer></v-spacer>

          <v-card-actions
            v-if="window.len!==1"
            class="pa-0"
          >
            <v-btn
              @click="prevWindow"
              color="cyan"
              text
            ><v-icon>mdi-chevron-left</v-icon></v-btn>

            <v-item-group
              v-model="window.active"
              class="text-center"
              mandatory
            >
              <v-item
                v-for="index in window.len"
                :key="index"
                v-slot:default="{ active, toggle }"
              >
                <v-btn
                  @click="toggle"
                  :input-value="active"
                  color="cyan darken-2"
                  icon
                ><v-icon>mdi-record</v-icon></v-btn>
              </v-item>
            </v-item-group>

            <v-btn
              @click="nextWindow"
              color="cyan"
              text
            ><v-icon>mdi-chevron-right</v-icon></v-btn>
          </v-card-actions>

          <v-spacer></v-spacer>

          <next-btn
            v-if="window.active===window.len-1||window.len===1"
            class=""
            :color="'yellow darken-1'"
            :path="'/'+user.user+page.nextPath"
            :text="page.btnText"
          ></next-btn>

          <div
            v-else-if="page.nextPath.match(/exe/)"
            style="width: 93.094px;"
          ></div>

          <div
            v-else
            style="width: 64px;"
          ></div>
        </v-card-actions>
      </transition>
    </v-card>

    <exp-dialog
      ref="dialog"
      :code="dialog.code"
    ></exp-dialog>
  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import ExpWindow from '@/components/layouts/study/ExpWindow.vue'
import BackBtn from '@/components/buttons/pages/TransOutlinedButton.vue'
import NextBtn from '@/components/buttons/pages/TransButton.vue'
import ExpDialog from '@/components/layouts/dialogs/ExpDialog.vue'

export default {
  props: {
    l: String,
    exp: String
  },
  data () {
    return {
      loading: true,
      user: {},
      title: {
        text: '',
        show: false
      },
      contents: [],
      window: {
        show: false,
        active: 0,
        len: 0
      },
      page: {},
      dialog: {
        code: ''
      },
      backQue: false
    }
  },
  components: {
    'exp-window': ExpWindow,
    'back-btn': BackBtn,
    'next-btn': NextBtn,
    'exp-dialog': ExpDialog
  },
  created () {
    this.getData(this.l, this.exp)
  },
  watch: {
    $route (to) {
      const path = to.path.split('/')
      const l = path[3]
      const exp = path[5]
      this.getData(l, exp)
    }
  },
  methods: {
    getData (l, exp) {
      this.initialize()

      if (this.user.user === 'student') {
        this.redirect(l)
        this.checkBackQue(l)
      }

      this.getLessonData(l, exp)
    },

    initialize () {
      this.user = this.$store.getters.user
      this.title.show = false
      this.window.show = false
      this.window.active = 0
      this.window.len = 0
      this.contents = []
      this.backQue = false
    },

    getLessonData (l, exp) {
      const ref = firestore.collection('lessons').doc('lesson' + l)
        .collection('explanations').doc('explanation' + exp)

      ref.get().then(doc => {
        if (doc.exists) {
          this.title.text = doc.data().title
          this.page = doc.data().page
          this.contents = doc.data().contents

          this.loading = false
          this.window.len = this.contents.length

          this.title.show = true
          this.window.show = true
        } else {
          console.log('No Documents')
        }
      })
    },

    redirect (l) {
      if (this.user.lesson + 1 < parseInt(l)) {
        this.$router.push('/' + this.user.user + '/lesson')
      }
    },

    checkBackQue (l) {
      const path = this.user.workPath.split('/')
      if (this.user.work && path[3] === l) {
        this.backQue = true
      }
    },

    nextWindow () {
      if (this.window.active + 1 === this.window.len) {
        this.window.active = this.window.len - 1
      } else {
        this.window.active += 1
      }
    },

    prevWindow () {
      if (this.window.active - 1 < 0) {
        this.window.active = 0
      } else {
        this.window.active -= 1
      }
    },

    startCodeDialog (code) {
      this.dialog.code = code
      this.$refs.dialog.openDialog()
    }
  }
}
</script>

<style scoped>
.show-enter-active, .show-leave-active {
  transition: opacity 1.2s;
}
.show-enter, .show-leave-to {
  opacity: 0;
}

.exp-title {
  font-family: YuGothic,'游ゴシック', sans-serif;
  font-size: 1.3em;
  color: #37474F;
  letter-spacing: 0.1em;
}
</style>
