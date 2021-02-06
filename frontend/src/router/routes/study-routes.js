const Explanations = () => import('@/views/study/explanation/Explanations.vue')
const Exercises = () => import('@/views/study/exercise/Exercises.vue')
const ChoiceNormal = () => import('@/views/study/exercise/question/ChoiceNormal.vue')
const Code = () => import('@/views/study/exercise/question/Code.vue')
const DragnDrop = () => import('@/views/study/exercise/question/DragnDrop.vue')
const Sort = () => import('@/views/study/exercise/question/Sort.vue')
const Practice = () => import('@/views/study/practice/Practice.vue')

const studyRoutes = [
  {
    path: 'study/:l/exp/:exp',
    component: Explanations,
    props: true
  },
  {
    path: 'study/:l/exe/:exe/:q/',
    component: Exercises,
    props: true,
    children: [
      {
        path: 'choice',
        component: ChoiceNormal,
        props: true
      },
      {
        path: 'code',
        component: Code,
        props: true
      },
      {
        path: 'correct',
        component: Code,
        props: true
      },
      {
        path: 'dragndrop',
        component: DragnDrop,
        props: true
      },
      {
        path: 'normal',
        component: ChoiceNormal,
        props: true
      },
      {
        path: 'sort',
        component: Sort,
        props: true
      }
    ]
  },
  {
    path: 'practice/:p',
    component: Practice,
    props: true
  }
]

export default studyRoutes
