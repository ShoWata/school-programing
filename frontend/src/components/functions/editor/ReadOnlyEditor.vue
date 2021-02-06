<template>
  <div id="read-only-python-editor"></div>
</template>

<script>
import ace from 'brace'
import 'brace/mode/python'
import 'brace/theme/clouds_onlyread'

export default {
  name: 'ReadOnlyEditor',
  props: { code: String },
  data () {
    return { editor: null }
  },
  mounted () {
    this.editor = ace.edit('read-only-python-editor')
    this.editor.$blockScrolling = Infinity
    this.editor.getSession().setMode('ace/mode/python')
    this.editor.setTheme('ace/theme/clouds_onlyread')
    this.editor.getSession().setUseWrapMode(true)
    this.editor.setFontSize(14)
    if (this.code) {
      this.editor.setValue(this.code, -1)
      this.editor.setReadOnly(true)
    }
  },
  watch: {
    code (code) {
      this.editor.setValue(code, -1)
      this.editor.setReadOnly(true)
    }
  },
  methods: {
    getCode() {
      return this.editor.getValue()
    }
  }
}
</script>
