<template>
  <prism
    language="python"
    class="line-numbers"
  >{{ code }}</prism>
</template>

<script>
import 'prismjs'
import Prism from 'vue-prism-component'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-python'
import { addLineNumbers } from '@/plugins/line-numbers/line-numbers'
import '@/plugins/line-numbers/line-numbers.css'

export default {
  name: 'Highlight',
  props: { recievedCode: String },
  data () {
    return { code: '' }
  },
  components: { 'prism': Prism },
  created () {
    this.code = this.recievedCode
  },
  mounted () {
    addLineNumbers()
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
.line-numbers.language-python {
  padding: 0.4rem 2.2rem;
}
</style>
