<template>
  <v-row
      align="center"
      justify="center"
      class="py-6"
    >
    <v-col
      cols="12"
      sm="8"
      md="5"
    >
      <v-card
        class="elevation-2 py-4 px-8"
        rounded="lg"
      >
        <v-toolbar
          color="white"
          dark
          flat
        >
          <v-toolbar-title class="title blue--text text-h5">Register</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="school"
              @change="inputSchool"
              label="学校名を入力"
              type="text"
              required
            ></v-text-field>

            <v-select
              v-model="selects.select"
              :items="selects.items"
              @change="selectUser"
              label="USERを選択"
              required
            ></v-select>

            <v-text-field
              v-if="selects.select == 'student'"
              v-model="className"
              label="クラス名を入力"
              type="text"
              required
            ></v-text-field>

            <v-text-field
              v-model="account.id"
              label="ID"
              name="id"
              prepend-icon="mdi-account"
              type="text"
            ></v-text-field>

            <v-text-field
              v-model="account.password"
              id="password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="text"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="register"
            color="yellow darken-3"
            outlined
          >登録</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="reset"
            color="yellow darken-3"
            outlined
          >リセット</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      school: null,
      selects: {
        items: ['teacher', 'student'],
        select: null
      },
      className: null,
      account: {
        id: '',
        password: '',
      }
    }
  },
  methods: {
    inputSchool () {
      this.account.id += this.school 
    },

    selectUser () {
      if (this.selects.select == 'teacher') {
        this.account.id += '@teacher'
      } else {
        this.account.id += '@student'
      }
    },

    register () {
      this.$store.dispatch('login', {
        id: this.id + '.com',
        password: this.password
      })
      this.id = ''
      this.password = ''
    },

    reset () {
      this.school = null
      this.selects.select = null
      this.className = null
      this.account.id = ''
      this.account.password = ''
    }
  }
}
</script>
