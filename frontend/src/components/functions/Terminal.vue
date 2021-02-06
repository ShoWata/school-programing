<template>
  <v-card
    class="px-4 py-2"
    color="#0d303b"
    elevation="3"
    rounded="lg"
    style="width: 100%; min-height: 200px;"
  >
    <p class="terminal-title font-weight-bold white--text px-4 py-2 mb-3">出力結果</p>

    <template v-if="loading">
      <div
        class="d-flex justify-center align-center"
        style="height: 130px;"
      >
        <v-progress-circular
          color="white"
          indeterminate
          :size="35"
          :width="3"
        ></v-progress-circular>
      </div>
    </template>

    <template v-else>
      <div
        v-html="compile"
        class="terminal-text px-3"
      ></div>
    </template>
  </v-card>
</template>

<script>
import marked from 'marked'

export default {
  name: 'Terminal',
  props: {
    output: String,
    loadingState: Boolean
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    compile () {
      return marked(this.output)
    }
  },
  watch: {
    loadingState (state) {
      this.loading = state
    }
  }
}
</script>

<style scoped>
.terminal-title {
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
  font-size: 0.93em;
  border-bottom: 1px solid #FFFFFF;
}
.terminal-text {
  color: #FFF;
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
  height: 130px;
  overflow-y: scroll;
  white-space: nowrap;
}
.terminal-text::-webkit-scrollbar {
  width: 0.7em;
}
.terminal-text::-webkit-scrollbar-thumb {
  border-radius: 0.2em;
  background: #BDBDBD;
}
</style>
