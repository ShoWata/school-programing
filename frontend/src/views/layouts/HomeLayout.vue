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
          <v-list-item
            v-for="(item, index) in items"
            color="cyan ligthen-1"
            :key="index"
            :to="'/'+user.user+item.link"
          >
            <v-list-item-icon class="mr-4">
              <v-icon color="yellow darken-1">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <template v-if="user.user=='admin'">
            <v-list-item
              color="cyan ligthen-1"
              :to="'/admin/register'"
            >
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
              class="mb-1"
              :append-icon="item.children ? undefined : ''"
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
      clipped-left
      color="#4badbd"
      dark
      elevation="1"
      height="42px"
    >
      <v-app-bar-nav-icon
        @click="drawer=!drawer"
        class="mr-16"
      ></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <logout-btn :user="user.user"></logout-btn>
    </v-app-bar>

    <v-main style="background-color: #f8f8f8;">
      <v-container class="pa-0">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LogoutBtn from '@/components/buttons/LogoutButton.vue'

export default {
  data () {
    return {
      drawer: true,
      user: {},
      items: [
        { name: 'Home', icon: 'mdi-home-outline', link: '/home' },
        { name: 'Lesson', icon: 'mdi-file-outline', link: '/lesson' },
        { name: 'Product', icon: 'mdi-laptop-mac', link: '/product' }
      ],
      adminItems: [
        { name: 'Form',
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
        { name: 'Trans',
          icon: 'mdi-file-swap-outline',
          children: [
            { name: 'Explanation', link: '/trans/exp' },
            { name: 'Code', link: '/trans/code' },
            { name: 'DragnDrop', link: '/trans/dragndrop' },
            { name: 'Normal', link: '/trans/normal' },
            { name: 'Sort', link: '/trans/sort' }
          ]
        },
      ]
    }
  },
  components: {
    'logout-btn': LogoutBtn
  },
  created () {
    this.user = this.$store.getters.user
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
</style>
