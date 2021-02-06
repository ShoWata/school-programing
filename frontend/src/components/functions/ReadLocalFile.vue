<template>
  <v-file-input
    @change="getFileContent"
    class="mb-3"
    label="ファイルを選択してください"
  ></v-file-input>
</template>

<script>
export default {
  name: 'ReadLocalCode',
  methods: {
    async getFileContent (file) {
      try {
        const content = await this.readFileAsync(file)
        this.$emit('catchContent', content)
      } catch (err) {
        console.log(err)
      }
    },

    readFileAsync (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsText(file)
      })
    }
  }
}
</script>
