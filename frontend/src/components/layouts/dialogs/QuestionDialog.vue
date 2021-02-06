<template>
  <v-dialog
    v-model="open"
    persistent
    width="270"
  >
    <v-card
      class="pt-2 px-3"
      min-height="260"
      rounded="lg"
    >
      <v-card-actions class="pa-0 mb-9">
        <v-spacer></v-spacer>

        <v-btn
          @click="closeDialog"
          color="cyan darken-4"
          icon
          text
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>

      <template v-if="loading">
        <p
          class="text-center teal--text font-weight-black pt-3 py-5 mb-2"
          style="font-size: 1.14em; letter-spacing: 0.5em;"
        >判定中</p>

        <v-container>
          <v-progress-linear
            color="cyan"
            height="5"
            indeterminate
          ></v-progress-linear>
        </v-container>
      </template>

      <template v-else>
        <p class="dialog-text text-center font-weight-bold mb-14">{{ msg }}</p>
        
        <v-card-actions
          v-if="isRight"
          class="mt-5"
        >
          <v-spacer></v-spacer>

          <page-btn
            :color="'#4badbd'"
            :path="'/'+user+page.nextPath"
            :text="page.btnText"
          ></page-btn>

          <v-spacer></v-spacer>
        </v-card-actions>

        <v-card-actions
          v-if="answer"
          class="mt-5"
        >
          <v-spacer></v-spacer>

          <v-btn
            @click="dialogShowAnswer"
            class="font-weight-bold py-4"
            color="#4badbd"
            dark
            depressed
            small
          >解答を見る</v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>

        <v-card-actions
          v-if="reset"
          class="mt-5"
        >
          <v-spacer></v-spacer>

          <v-btn
            @click="dialogReset"
            class="font-weight-bold py-4"
            color="#4badbd"
            dark
            depressed
            small
          >リセット</v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import PageBtn from '@/components/buttons/pages/TransButton.vue'

export default {
  props: {
    loading: Boolean,
    user: String,
    page: Object,
    msg: String,
  },
  data () {
    return {
      open: false,
      isRight: false,
      answer: false,
      reset: false
    }
  },
  components: {
    'page-btn': PageBtn
  },
  watch: {
    $route () {
      this.closeDialog()
    }
  },
  methods: {
    openAnswerDialog () {
      this.open = true
      this.answer = true
    },

    dialogShowAnswer () {
      this.$emit('answer')
      this.closeDialog()
    },

    openResetDialog () {
      this.open = true
      this.reset = true
    },

    dialogReset () {
      this.$emit('reset')
      this.closeDialog()
    },

    openCheckDialog () {
      this.open = true
    },

    showPageBtn () {
      this.isRight = true
    },

    transPage () {
      this.closeDialog()
    },

    closeDialog () {
      this.open = false
      this.isRight = false
      this.answer = false
      this.reset = false
    }
  }
}
</script>

<style scoped>
.dialog-text {
  font-family: YuGothic,'游ゴシック', sans-serif;
  font-size: 0.93em;
  color: #083947;
}
</style>
