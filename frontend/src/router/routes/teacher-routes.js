import store from '@/store'
import StudyRoutes from './study-routes'

const Layout = () => import('@/views/layouts/Layout.vue')
const HomeLayout = () => import('@/views/layouts/HomeLayout.vue')
const Home = () => import('@/views/home/teacher/Home.vue')
const Lesson = () => import('@/views/home/Lesson.vue')
const Product = () => import('@/views/home/Product.vue')
const Sample = () => import('@/views/product/Sample.vue')

const teacherRoutes = [
  {
    path: '/teacher/',
    component: HomeLayout,
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'lesson',
        component: Lesson
      },
      {
        path: 'product',
        component: Product
      }
    ],
    beforeEnter (to, from, next) {
      if (store.getters.user.user === 'teacher' || store.getters.user.user === 'admin') {
        next()
      } else {
        next('student/home')
      }
    }
  },
  {
    path: '/teacher/',
    component: Layout,
    props: true,
    children: [
      ...StudyRoutes,
      {
        path: 'sample/:product',
        component: Sample,
        props: true
      }
    ],
    beforeEnter (to, from, next) {
      if (store.getters.user.user === 'teacher' || store.getters.user.user === 'admin') {
        next()
      } else {
        next('student/home')
      }
    }
  },
  {
    path: '/teacher/*',
    redirect: '/teacher/home'
  }
]

export default teacherRoutes
