<template>
  <div>
    <v-btn
      @click="startDialog"
      class="font-weight-bold"
      icon
    >
      <v-icon>mdi-logout</v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog"
      width="240px"
    >
      <v-card
        class="elevation-2 py-12"
        height="240"
        rounded="lg"
      >
        <v-card-text class="mb-2">
          <p class="log-text text-center font-weight-bold">ログアウトしてもよろしいですか？</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="logout"
            class="font-weight-bold"
            color="yellow darken-1"
            dark
            depressed
          >Logout</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'LogoutBtn',
  props: { user: null },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout', this.user)
    },
    startDialog () {
      this.dialog = true
    }
  }
}
</script>

<style scoped>
.log-text {
  font-family: YuGothic,'游ゴシック', sans-serif;
  color: #083947;
}
</style>
