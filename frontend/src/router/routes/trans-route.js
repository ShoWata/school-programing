const TransExp = () => import('@/views/trans/TransExp.vue')
const TransCode = () => import('@/views/trans/exercise/TransCode.vue')
const TransDragnDrop = () => import('@/views/trans/exercise/TransDragnDrop.vue')
const TransNormal = () => import('@/views/trans/exercise/TransNormal.vue')
const TransSort = () => import('@/views/trans/exercise/TransSort.vue')

const transRoutes = [
  {
    path: 'trans/exp',
    component: TransExp
  },
  {
    path: 'trans/code',
    component: TransCode
  },
  {
    path: 'trans/dragndrop',
    component: TransDragnDrop
  },
  {
    path: 'trans/normal',
    component: TransNormal
  },
  {
    path: 'trans/sort',
    component: TransSort
  }
]

export default transRoutes
