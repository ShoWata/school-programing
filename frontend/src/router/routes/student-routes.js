import StudyRoutes from './study-routes'

const Layout = () => import('@/views/layouts/Layout.vue')
const HomeLayout = () => import('@/views/layouts/HomeLayout.vue')
const Home = () => import('@/views/home/student/Home.vue')
const Lesson = () => import('@/views/home/Lesson.vue')
const Product = () => import('@/views/home/Product.vue')
const Sample = () => import('@/views/product/Sample.vue')

const studentRoutes = [
  {
    path: '/student/',
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
    ]
  },
  {
    path: '/student/',
    component: Layout,
    props: true,
    children: [
      ...StudyRoutes,
      {
        path: 'sample/:product',
        component: Sample,
        props: true
      }
    ]
  },
  {
    path: '/student/*',
    redirect: '/student/home'
  }
]

export default studentRoutes
