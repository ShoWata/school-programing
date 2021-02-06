<template>
  <v-btn
    @click="transPage"
    class="font-weight-bold"
    :color="color"
    dark
    depressed
  >{{ text }}</v-btn>
</template>

<script>
export default {
  props: {
    color: String,
    ID: Number,
    path: String,
    text: String
  },
  methods: {
    transPage () {
      this.$router.push(this.path)
    }
  }
}
</script>
