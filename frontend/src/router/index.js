import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import AdminRoutes from './routes/admin-routes'
import TeacherRoutes from './routes/teacher-routes'
import StudentRoutes from './routes/student-routes'

const Login = () => import('@/views/auth/Login.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login,
    beforeEnter (to, from, next) {
      if (store.getters.user) {
        if (store.getters.user.user === 'admin' ){
          next('/admin/home')
        } else if (store.getters.user.user === 'teacher') {
          next('/teacher/home')
        } else {
          next('student/home')
        }
      } else {
        next()
      }
    }
  },
  ...AdminRoutes,
  ...TeacherRoutes,
  ...StudentRoutes
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if ( to.path !== '/' && !store.getters.user.login ) {
    next('/')
  } else {
    next()
  }
})

export default router
