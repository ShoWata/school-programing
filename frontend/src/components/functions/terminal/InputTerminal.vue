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
        @click="focusInput"
        class="terminal px-3"
        ref="terminal"
        style="min-height: 130px;"
      >
        <div
          v-for="(terminalText, index) in terminalTexts"
          class="terminal-text-line"
          :key="index"
          ref="terminalTextLine"
        >
          <span
            class="terminal-text"
            ref="terminalText"
            style="display:inline-block;"
          >{{ terminalText }}</span>
        </div>

        <div
          v-if="input.active"
          class="terminal-input"
          :style="input.style"
        >
          <div class="terminal-input-text"><span>{{ text }}</span></div>

          <div
            class="terminal-cursor-blink"
            ref="terminalCursor"
            :style="cursor.style"
          ></div>

          <v-text-field
            @keydown.enter="sendValue($event.keyCode)"
            v-model="text"
            autocomplete="off"
            autofocus
            class="terminal-input-field ma-0"
            dense
            ref="terminalInputField"
            type="text"
          ></v-text-field>
        </div>
      </div>
    </template>
  </v-card>
</template>

<script>
export default {
  name: 'Terminal',
  props: {
    inputActive: Boolean,
    terminalTexts: Array
  },
  data () {
    return {
      loading: false,
      texts: [],
      text: '',
      input: {
        active: false,
        style: ''
      },
      cursor: {
        blink: false,
        style: ''
      },
      style: {
        input: '',
        cursor: ''
      }
    }
  },
  mounted () {
    window.addEventListener('click', this.onBlurHandler = e => {
      if (this.$refs.terminal.contains(e.target)) return
      this.stopCursorBlink()
      this.cursor.blink = true
    })
  },
  watch: {
    async terminalTexts (texts) {
      this.texts = texts
      await this.$nextTick()
      this.initialize()
      this.relocateInputField()
    },

    inputActive (bool) {
      this.input.active = bool
    }
  },
  beforeDestroy () {
    window.removeEventListener('click', this.onBlurHandler)
  },
  methods: {
    initialize () {
      this.text = ''
      this.cursor.blink = false
    },

    relocateInputField () {
      const lastTextElm = this.$refs.terminalTextLine.slice(-1)[0]
      const lastTextElmChild = this.$refs.terminalText.slice(-1)[0]
      const top = lastTextElm.offsetTop
      const left = lastTextElm.offsetLeft
      const height = lastTextElm.offsetHeight
      const width = lastTextElmChild.offsetWidth

      this.input.style = 'top: ' + String(top) + 'px;' + 'left: ' + String(left + width + 1) + 'px;'
      this.cursor.style = 'height: ' + String(height) + 'px;'
    },

    focusInput () {
      if (this.input.active) {
        this.$refs.terminalInputField.focus()
        this.cursorBlink()
      }
    },

    cursorBlink () {
      if (this.$refs.terminalCursor) {
        this.$refs.terminalCursor.className = 'terminal-cursor-blink'
      }
    },

    stopCursorBlink () {
      if (this.$refs.terminalCursor && this.cursor.blink) {
        this.$refs.terminalCursor.className = 'terminal-cursor'
      }
    },

    sendValue (keyCode) {
      if (keyCode !== 13) return
      this.$emit('catchVal', this.text)

      this.texts[this.texts.length - 1] += this.text
      this.input.active = false
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

.terminal-text-line {
  color: #FFF;
  font-size: 0.95em;
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
}

.terminal-input {
  position: absolute;
  display: flex;
}
.terminal-input-text {
  color: #FFF;
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
  font-size: 0.95em;
}
.terminal-cursor {
  border-right: 0.4em solid #FFFFFF;
  opacity: 0.7;
  width: 0;
}
.terminal-cursor-blink {
  border-right: 0.4em solid #FFFFFF;
  width: 0;
  animation: blinking 1s;
  animation-iteration-count: infinite;
}
@keyframes blinking {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
.terminal-input-field {
  opacity: 0;
  width: 9.60156px;
}
</style>
