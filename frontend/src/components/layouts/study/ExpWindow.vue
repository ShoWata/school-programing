<template>
  <v-row
    class="px-lg-12 px-md-6 px-sm-5"
    no-gutters
  >
    <v-col
      cols="12"
      md="5"
    >
      <v-card-text class="pa-0">
        <markdown :markdownText="markdownText"></markdown>
      </v-card-text>          
    </v-col>

    <v-col
      cols="12"
      md="7"
      class="pl-4 pr-3"
    >
      <template v-if="imageURL">
        <v-img
          class="img mx-auto"
          contain
          :src="imageURL"
          style="max-height: 505px; max-width: 730px;"
        ></v-img>
      </template>

      <template v-if="codes.length!==0">
        <template v-if="codes.length==1">
          <v-card-actions class="mb-1 px-2 py-0">
            <p
              class="blue-grey--text text--darken-3 mb-0"
              style="font-size: 0.85em"
            >サンプルコード</p>

            <v-spacer></v-spacer>

            <v-btn
              @click="sendCode(0)"
              color="#4badbd"
              text
              max-height="20"
              small
            >コードを実行する</v-btn>
          </v-card-actions>

          <highlight
            :recievedCode="codes[0]"
            style="max-height: 469px"
          ></highlight>
        </template>

        <template v-else>
          <div
            v-for="(code, index) in codes"
            class="mb-2"
            :key="index"
          >
            <v-card-actions class="mb-1 px-2 py-0">
              <p
                class="blue-grey--text text--darken-3 mb-0"
                style="font-size: 0.85em"
              >サンプルコード{{ index + 1}}</p>

              <v-spacer></v-spacer>

              <v-btn
                @click="sendCode(index)"
                color="#4badbd"
                text
                max-height="20"
                small
              >コードを実行する</v-btn>
            </v-card-actions>

            <highlight
              :recievedCode="code"
              style="max-height: 216px"
            ></highlight>
          </div>
        </template>
      </template>

      <template v-if="table">
        <markdown :markdownText="table"></markdown>
      </template>
    </v-col>
  </v-row>
</template>

<script>
import Markdown from '@/components/functions/Markdown.vue'
import Highlight from '@/components/functions/syntax-highlight/Highlight.vue'

export default {
  name: 'ExpWindow',
  props: {
    markdownText: String,
    imageURL: String,
    codes: Array,
    table: String,
  },
  components: {
    'markdown': Markdown,
    'highlight': Highlight
  },
  methods: {
    sendCode (index) {
      this.$emit('catchCode', this.codes[index])
    }
  }
}
</script>

<style scoped>
.show-enter-active, .show-leave-active {
  transition: opacity 2s;
}
.show-enter, .show-leave-to {
  opacity: 0;
}

.markdown {
  font-size: 0.94em;
  letter-spacing: 0.003em;
  overflow-y: scroll;
  height: 505px;
}
.markdown::-webkit-scrollbar {
  width: 0.5em;
}
.markdown::-webkit-scrollbar-thumb {
  border-radius: 0.2em;
  background: #FFFFFF;
}

pre.line-numbers.language-python {
  margin: 0;
  font-size: 0.92em;
}
</style>
