<template>
  <v-row>
    <v-col
      v-for="(item, index) in items"
      :key="index"
      cols="6"
      sm="4"
      md="4"
      lg="3"
    >
      <menu-card
        :open="item.open"
        :height="'320px'"
        :width="''"
        :link="'/'+user.user+'/study/'+String(index+1)+'/exp/1'"
        :title="'Lesson '+String(index+1)"
        :subtitle="item.subtitle"
        :lists="item.lists"
        :text="''"
        :margin="'mb-5'"
      ></menu-card>
    </v-col>
  </v-row>
</template>

<script>
import { LessonInfo } from '@/info/info-lesson'
import MenuCard from '@/components/layouts/home/MenuCard.vue'

export default {
  data () {
    return {
      user: null,
      items: []
    }
  },
  components: {
    'menu-card': MenuCard
  },
  created () {
    this.items = LessonInfo
    this.user = this.$store.getters.user
    if (this.user.user === 'student') {
      this.unlockLesson(this.user.lesson)
    }
  },
  methods: {
    unlockLesson (lesson) {
      var index = 0
      this.items.forEach(item => {
        if (index > lesson) {
          item.open = false
        }
        index++
      })
    }
  }
}
</script>
