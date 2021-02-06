<template>
  <div
    class="markdown pr-2"
    v-html="compiledMarkdown"
  ></div>
</template>

<script>
import marked from 'marked'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/themes/prism.css'

export default {
  name: 'Markdown',
  props: {
    markdownText: String,
  },
  computed: {
    compiledMarkdown () {
      return marked(this.markdownText)
    }
  },
  created () {
    marked.setOptions({
      breaks: true,
      langPrefix: 'language-',
      highlight (code, lang) {
        if (lang && lang.match(':')) {
          lang = lang.substring(0, lang.indexOf(':'))
        }
        if (lang in Prism.languages) {
          return Prism.highlight(code, Prism.languages[lang])
        } else {
          return code
        }
      }
    })
  }
}
</script>

<style>
.v-application {
  font-family: YuGothic,'游ゴシック', sans-serif;
}
.v-application code {
  all: unset;
}

.markdown table {
  border-collapse: collapse;
  color: #37474F;
  font-size: 0.92em;
}
.markdown th {
  padding: 0.4em 0.6em;
}
.markdown td {
  padding: 0.6em 0.7em;
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
}
.markdown th,td {
  border: solid 0.124em;
}

pre {
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
  background-color: #F5F5F5;
  max-width: 700px;
  white-space: pre-wrap;
  border-radius: 0.8em;
  padding: 0.4rem 1.4em;
  margin: 12px 0;
}

.token {
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
}
.token.extra {
  color: #000;
}
</style>
