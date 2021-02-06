<template>
  <prism
    language="python"
    class="nonumber-code"
  >{{ code }}</prism>
</template>

<script>
import 'prismjs'
import Prism from 'vue-prism-component'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-python'

export default {
  name: 'NonNumHighlight',
  props: { recievedCode: String },
  data () {
    return { code: '' }
  },
  components: { 'prism': Prism },
  created () {
    this.code = this.recievedCode
  },
  watch: {
    recievedCode (code) {
      this.code = code
    }
  }
}
</script>

<style scoped>
.v-application code {
  all: unset;
}
pre {
  background-color: #F5F5F5;
}
</style>
