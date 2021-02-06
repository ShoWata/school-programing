<template>
  <v-btn
    @click="transPage"
    class="font-weight-bold"
    :color="color"
    depressed
    outlined
  >{{ text }}</v-btn>
</template>

<script>
export default {
  props: {
    color: String,
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
