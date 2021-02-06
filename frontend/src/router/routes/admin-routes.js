import store from '@/store'
import StudyRoutes from './study-routes'
import FormRoutes from './form-routes'
import TransRoutes from './trans-route'

const Layout = () => import('@/views/layouts/Layout.vue')
const HomeLayout = () => import('@/views/layouts/HomeLayout.vue')
const Home = () => import('@/views/home/admin/Home.vue')
const Lesson = () => import('@/views/home/Lesson.vue')
const Product = () => import('@/views/home/Product.vue')
const Register = () => import('@/views/auth/Register.vue')
const Sample = () => import('@/views/product/Sample.vue')

const adminRoutes = [
  {
    path: '/admin/',
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
      },
      {
        path: 'register',
        component: Register
      }
    ],
    beforeEnter (to, from, next) {
      if (store.getters.user.user === 'admin') {
        next()
      } else if (store.getters.user.user === 'teacher') {
        next('/teacher/home')
      } else {
        next('/student/home')
      }
    }
  },
  {
    path: '/admin/',
    component: Layout,
    props: true,
    children: [
      ...StudyRoutes,
      {
        path: 'sample/:product',
        component: Sample,
        props: true
      },
      ...FormRoutes,
      ...TransRoutes
    ],
    beforeEnter (to, from, next) {
      if (store.getters.user.user === 'admin') {
        next()
      } else if (store.getters.user.user === 'teacher') {
        next('/teacher/home')
      } else {
        next('/student/home')
      }
    }
  },
  {
    path: '/admin/*',
    redirect: '/admin/home'
  }
]

export default adminRoutes
