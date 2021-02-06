<template>
  <div :id="idName"></div>
</template>

<script>
import ace from 'brace'
import 'brace/mode/python'
import 'brace/theme/clouds'

export default {
  name: 'Editor',
  props: {
    code: String,
    idName: String
  },
  data () {
    return { editor: null }
  },
  mounted () {
    this.editor = ace.edit(this.idName)
    this.editor.$blockScrolling = Infinity
    this.editor.getSession().setMode('ace/mode/python')
    this.editor.setTheme('ace/theme/clouds')
    this.editor.getSession().setUseWrapMode(true)
    this.editor.setFontSize(16)
    if (this.code) {
      this.editor.setValue(this.code, -1)
    }
  },
  watch: {
    code (code) {
      this.editor.setValue(code, -1)
    }
  },
  methods: {
    getCode () {
      return this.editor.getValue()
    },
    setCode () {
      this.editor.setValue(this.code, -1)
    }
  }
}
</script>
