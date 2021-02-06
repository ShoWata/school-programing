<template>
  <v-dialog
    v-model="open"
    persistent
    width="600"
  >
    <v-card
      class="elevation-2"
      min-height="200"
      rounded="lg"
    >
      <v-card
        class="pa-1 mb-1"
        color="#92cfd8"
        elevation="2"
        rounded="lg"
      >
        <div
          class="d-flex mb-1 pl-7 pr-2 py-0"
        >
          <div class="d-flex align-center">
            <p
              class="white--text font-weight-bold mb-0"
              style="font-size: 0.93em;"
            >エディター（ソースコードを書いてください）</p>
          </div>

          <v-btn
            @click="closeDialog"
            class="ml-auto"
            color="white"
            icon
            text
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </div>

        <editor
          :code="code"
          :idName="'python-editor'"
          ref="editor"
          class="mb-1"
          style="width: 100%; min-height: 380px;"
        ></editor>

        <v-card-actions class="px-3 pb-1">
          <v-spacer></v-spacer>

          <v-btn
            @click="commit"
            class="font-weight-bold px-6"
            color="yellow darken-1"
            dark
            depressed
            small
          >実行</v-btn>
        </v-card-actions>
      </v-card>

      <terminal
        :output="terminal.output"
        :loadingState="terminal.loading"
      ></terminal>
    </v-card>
  </v-dialog>
</template>

<script>
import Editor from '@/components/functions/editor/Editor.vue'
import Terminal from '@/components/functions/Terminal.vue'
import { compile } from '@/plugins/compile'

export default {
  props: {
    code: String
  },
  data () {
    return {
      open: false,
      terminal: {
        loading: false,
        output: ''
      }
    }
  },
  components: {
    'editor': Editor,
    'terminal': Terminal
  },
  methods: {
    openDialog () {
      this.open = true
    },

    async commit () {
      this.terminal.loading = true
      this.terminal.output = ''

      const code = this.$refs.editor.getCode()

      await compile(code).then(res => {
        this.terminal.output = res
      }).catch(err => {
        this.terminal.output = err
      })

      this.terminal.loading = false
    },

    closeDialog () {
      this.open = false
      this.terminal.loading = false
      this.terminal.output = ''
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
