<template>
  <div class="sample"></div>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('isAuthenticated')
  }
}
</script>
