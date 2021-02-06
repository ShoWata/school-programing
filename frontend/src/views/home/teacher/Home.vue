<template>
  <v-container>
    <div id="home" class="pa-6">
      <h2 class="mb-10">{{ name }}先生、こんにちは！</h2>
      <h4>ログイン状況</h4>
      <h4>生徒の進捗</h4>
    </div>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      name: ''
    }
  },
  created () {
    this.name = this.$store.getters.user.name
  }
}
</script>
