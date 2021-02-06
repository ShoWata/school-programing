<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="#fdfdfd"
      width="220px"
    >
      <v-container>
        <v-divider></v-divider>

        <v-list
          dense
          nav
        >
          <v-list-item :to="'/'+user.user+'/home'">
            <v-list-item-icon class="mr-4">
              <v-icon color="yellow darken-1">mdi-home-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            v-for="(item, index) in items"
            :append-icon="item.children ? undefined : ''"
            class="mb-1"
            color="cyan ligthen-1"
            :key="index"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-icon class="mr-4">
                <v-icon color="yellow darken-1">{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                >{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <template v-for="(child, index) in item.children">
              <v-list-item
                v-if="child.open"
                class="pl-11 mb-0"
                :key="index"
                :to="'/'+user.user+child.link"
              >
                <v-list-item-content>
                  <v-list-item-title class="v-list-child-item__title"
                  >{{ child.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-else
                class="pl-11 mb-0"
                :key="index"
                link
              >
                <v-list-item-content>
                  <v-list-item-title class="v-list-child-item__title"
                  >{{ child.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-group>

          <template v-if="user.user=='admin'">
            <v-list-item :to="'/admin/register'">
              <v-list-item-icon class="mr-4">
                <v-icon color="yellow darken-1">mdi-home</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                >Register</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-group
              v-for="(item, index) in adminItems"
              :append-icon="item.children ? undefined : ''"
              class="mb-1"
              color="cyan ligthen-1"
              :key="index+10"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-icon class="mr-4">
                  <v-icon color="yellow darken-1">{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                  >{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="(child, index) in item.children"
                class="pl-11"
                :key="index"
                :to="'/'+user.user+child.link"
              >
                <v-list-item-content>
                  <v-list-item-title class="v-list-child-item__title"
                  >{{ child.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list>
      </v-container>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="#4badbd"
      clipped-left
      elevation="1"
      dark
      height="42px"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <v-menu
        v-if="lesson"
        max-height="450"
        min-width="225"
        offset-y
        open-delay="100"
        rounded="large"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{on, attrs}">
          <v-btn
            v-bind="attrs"
            v-on="on"
            class="text-capitalize mx-1"
            text
          >
            <span class="btn-text font-weight-bold mr-1">Lesson {{ lesson }}</span>
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list
          dense
          nav
        >
          <v-subheader class="drop-list-title">{{ lessonItems[lesson-1].exp.name }}</v-subheader>

          <v-divider></v-divider>

          <v-list-item-group
            class="mb-2"
            color="cyan ligthen-1"
          >
            <template v-for="(item, index) in lessonItems[lesson-1].exp.children">
              <v-list-item
                class="mb-0"
                :key="index"
                :to="'/'+user.user+item.link"
              >
                <v-list-item-title class="drop-list-name font-weight-bold"
                >{{ item.name }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list-item-group>

          <template v-for="(item, index) in lessonItems[lesson-1].exe">
            <div :key="index">
              <v-subheader
                class="drop-list-title"
              >{{ item.name }}</v-subheader>

              <v-divider></v-divider>

              <v-list-item-group
                class="mb-2"
                color="cyan ligthen-1"
              >
                <v-list-item
                  v-for="(item, index) in item.children"
                  class="mb-0"
                  :key="index"
                  :to="'/'+user.user+item.link"
                >
                  <v-list-item-title class="drop-list-name font-weight-bold"
                  >{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </div>
          </template>
        </v-list>
      </v-menu>

      <logout-btn :user="user.user"></logout-btn>
    </v-app-bar>
    
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { LessonDetailInfo } from '@/info/info-detail-lesson'
import LogoutBtn from '@/components/buttons/LogoutButton.vue'

export default {
  data () {
    return {
      drawer: false,
      user: {},
      lesson: 0,
      items: [
        {
          name: 'Lesson',
          icon: 'mdi-file-outline',
          children: [
            { name: 'Lesson', link: '/lesson', open: true },
            { name: 'Lesson 1', link: '/study/1/exp/1', open: true },
            { name: 'Lesson 2', link: '/study/2/exp/1', open: true },
            { name: 'Lesson 3', link: '/study/3/exp/1', open: true },
            { name: 'Lesson 4', link: '/study/4/exp/1', open: true },
            { name: 'Lesson 5', link: '/study/5/exp/1', open: true },
            { name: 'Lesson 6', link: '/study/6/exp/1', open: true },
            { name: 'Lesson 7', link: '/study/7/exp/1', open: true },
            { name: 'Lesson 8', link: '/study/8/exp/1', open: true }
          ]
        },
        {
          name: 'Product',
          icon: 'mdi-laptop-mac',
          children: [
            { name: 'Product', link: '/product', open: true },
            { name: 'Product 1', link: '/sample/1', open: false },
            { name: 'Product 2', link: '/sample/2', open: false },
            { name: 'Product 3', link: '/sample/3', open: false },
            { name: 'Product 4', link: '/sample/4', open: false },
            { name: 'Product 5', link: '/sample/5', open: false },
            { name: 'Product 6', link: '/sample/6', open: false },
            { name: 'Product 7', link: '/sample/7', open: false }
          ]
        }
      ],
      lessonItems: [],
      adminItems: [
        {
          name: 'Form',
          icon: 'mdi-form-select',
          children: [
            { name: 'Explanation', link: '/form/exp' },
            { name: 'Code', link: '/form/code' },
            { name: 'DragnDrop', link: '/form/dragndrop' },
            { name: 'Normal', link: '/form/normal' },
            { name: 'Sort', link: '/form/sort' },
            { name: 'Practice', link: '/form/practice' }
          ]
        },
        {
          name: 'Trans',
          icon: 'mdi-file-swap-outline',
          children: [
            { name: 'Explanation', link: '/trans/exp' },
            { name: 'Code', link: '/trans/code' },
            { name: 'DragnDrop', link: '/trans/dragndrop' },
            { name: 'Normal', link: '/trans/normal' },
            { name: 'Sort', link: '/trans/sort' }
          ]
        }
      ]
    }
  },
  components: {
    'logout-btn': LogoutBtn
  },
  created () {
    this.lessonItems = LessonDetailInfo

    if (window.innerWidth > 1264) {
      this.drawer = true
    }

    const path = this.$route.path.split('/')
    if (path[2] == 'study') {
      this.lesson = parseInt(path[3])
    } else {
      this.lesson = null
    }
    
    this.user = this.$store.getters.user
    if (this.user.user === 'student') {
      this.unlockLesson(this.user.lesson)
    }
  },
  watch: {
    $route (to) {
      const path = to.path.split('/')
      if (path[2] == 'study') {
        this.lesson = parseInt(path[3])
      } else {
        this.lesson = null
      }

      if (this.user.user === 'student') {
        this.unlockLesson(this.user.lesson)
      }
    }
  },
  methods: {
    unlockLesson (lesson) {
      var index = 0
      this.items[0].children.forEach(item => {
        if (index > lesson+1) {
          item.open = false
        }
        index++
      })
    }
  }
}
</script>

<style scoped>
.v-list-item__title {
  font-family: YuGothic,'游ゴシック', sans-serif;
  font-size: 0.94em !important;
  font-weight: 600 !important;
  color: #37474F;
}
  .v-list-child-item__title {
    font-family: YuGothic,'游ゴシック', sans-serif;
    font-size: 0.87em !important;
    font-weight: 549 !important;
  }

.btn-text {
  font-family: YuGothic,'游ゴシック', sans-serif;
  letter-spacing: 0.001em;
}

.drop-list-title {
  font-family: YuGothic,'游ゴシック', sans-serif;
  font-size: 0.9em;
  color: #37474F;
}
.drop-list-name {
  font-family: YuGothic,'游ゴシック', sans-serif;
  font-size: 0.9em;
  color: #37474F;
}
</style>
