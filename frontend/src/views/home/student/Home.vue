<template>
  <v-container>
    <div id="home" class="pa-6">
      <h2 class="home-title mb-4">{{ user.name }}さん、こんにちは！</h2>

      <h3 class="lesson-title">取り組み中のLesson</h3>

      <v-row>
        <v-col
          cols="6"
          sm="4"
          md="4"
          lg="3"
        >
          <menu-card
            :open="currentLesson.open"
            :height="'320px'"
            :width="''"
            :link="'/'+user.user+'/study/'+String(user.lesson+1)+'/exp/1'"
            :title="'Lesson '+String(user.lesson+1)"
            :subtitle="currentLesson.subtitle"
            :lists="currentLesson.lists"
            :text="''"
            :margin="'mb-5'"
          ></menu-card>
        </v-col>
      </v-row>

      <h3 class="lesson-title">終了したLesson</h3>

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

    </div>
  </v-container>
</template>

<script>
import { LessonInfo } from '@/info/info-lesson'
import MenuCard from '@/components/layouts/home/MenuCard.vue'

export default {
  data () {
    return {
      user: {},
      currentLesson: {},
      items: []
    }
  },
  components: {
    'menu-card': MenuCard
  },
  created () {
    this.user = this.$store.getters.user
    this.openLesson(this.user.lesson, LessonInfo)
  },
  methods: {
    openLesson (lesson, lessonItems) {
      this.currentLesson = lessonItems[lesson]

      for (var i = 0; i < lesson; i++) {
        this.items.push(lessonItems[i])
      }
    }
  }
}
</script>

<style scoped>
.home-title {
  font-family: YuGothic,'游ゴシック', sans-serif;
  font-size: 1.5em;
  color: #37474F;
}
.lesson-title {
  font-family: YuGothic,'游ゴシック', sans-serif;
  font-size: 1.1em;
  color: #37474F;
}
</style>
