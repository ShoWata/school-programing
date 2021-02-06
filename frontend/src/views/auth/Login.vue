<template>
  <v-app id="inspire">

    <v-app-bar
      app
      clipped-left
      color="#4badbd"
      dark
      elevation="1"
      height="47px"
      rounded
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main class="px-0 py-10">
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          class="pa-10"
          sm="8"
          md="6"
          lg="5"
        >
          <v-dialog
            v-model = "dialog"
            height="600px"
            persistent
            width="500px"
          >
            <v-card
              class="elevation-2 py-4 px-6"
              rounded="lg"
            >
              <v-toolbar
                color="white"
                dark
                flat
              >
                <v-toolbar-title class="blue--text text-h5">Login</v-toolbar-title>
              </v-toolbar>

              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="account.email"
                    color="cyan"
                    label="ID"
                    name="id"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="account.password"
                    color="cyan"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>

              <v-alert
                v-if="error.isErr"
                dense
                text
                type="error"
              >{{ error.msg }}</v-alert>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="login"
                  class="font-weight-bold"
                  color="yellow darken-3"
                  outlined
                >Start！</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>

            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-main>

    <Footer></Footer>

  </v-app>
</template>

<script>
import Footer from '@/components/layouts/Footer.vue'

export default {
  components: {
    Footer
  },
  data () {
    return {
      account: {
        email: '',
        password: ''
      },
      error: {
        isErr: false,
        msg: '',
      },
      dialog: true
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', this.account)
        .catch(err => {
          this.error.isErr = true

          if (err.code == 'auth/user-not-found') {
            this.error.msg = 'IDが間違っています！'
            this.account.email = ''
          } else if (err.code == 'auth/wrong-password') {
            this.error.msg = 'パスワードが間違っています！'
            this.account.password = ''
          } else {
            this.error.msg = 'ログインできませんでした！もう一度やり直してください！'
            this.account.email = ''
            this.account.password = ''
          }

          setTimeout(() => {
            this.error.isErr = false
          }, 7000)
        })
    }
  }
}
</script>

<style scoped>
.list-name {
  font-family: 'SF Pro Display',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
}
</style>
