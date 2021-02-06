<template>
  <div
    class="px-2 pt-1"
    style="height: 100%; background-color: #e8ecf0;"
  >
    <v-card
      :loading="loading"
      class="pb-5 px-lg-9 px-sm-7"
      elevation="8"
      style="border-radius: 1em; min-height: 642.31px;"
    >
      <template slot="progress">
        <v-progress-linear
          color="cyan"

          height="5"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-container>
        <h2
          class="blue-grey--text text--darken-2 pt-5 pb-2 mb-2"
          style="font-size: 1.32em; letter-spacing: 0.07em;"
        >
          <v-icon
            class="mr-4 pb-1"
            color="yellow darken-1"
            style="font-size: 1.3em;"
          >mdi-head-lightbulb</v-icon>
          Exercise {{ exe }}
          <span
            class="ml-10"
            style="font-size: 0.65em; letter-spacing: 0.08em;"
          >{{ subText }}</span>
        </h2>

        <div>
          <router-view></router-view>
        </div>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import firestore from '@/firebase/firestore'

export default {
  props: {
    l: String,
    exe: String
  },
  data () {
    return {
      loading: true,
      user: {},
      subText: ''
    }
  },
  created () {
    this.getData(this.l, this.exe)
  },
  watch: {
    $route (to, from) {
      const toPath = to.path.split('/')
      const fromPath = from.path.split('/')

      if (toPath[3] !== fromPath[3] || toPath[5] !== fromPath[5]) {
        this.getData(toPath[3], toPath[5])
      }
    }
  },
  methods: {
    getData (l, exe) {
      const ref = firestore.collection('lessons').doc('lesson' + l)
        .collection('exercises').doc('exercise' + exe)

      ref.get().then(doc => {
        if (doc.exists) {
          this.subText = doc.data().subText
        } else {
          console.log('No docuemnts')
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
