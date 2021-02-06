const ExpForm = () => import('@/views/form/explanation/ExpForm.vue')
const ChoiceForm = () => import('@/views/form/exercise/ChoiceForm.vue')
const CodeForm = () => import('@/views/form/exercise/CodeForm.vue')
const DragnDropForm = () => import('@/views/form/exercise/DragnDropForm.vue')
const NormalForm = () => import('@/views/form/exercise/NormalForm.vue')
const SortForm = () => import('@/views/form/exercise/SortForm.vue')
const PracForm = () => import('@/views/form/practice/PracForm.vue')

const formRoutes = [
  {
    path: 'form/exp',
    component: ExpForm
  },
  {
    path: 'form/choice',
    component: ChoiceForm
  },
  {
    path: 'form/code',
    component: CodeForm
  },
  {
    path: 'form/dragndrop',
    component: DragnDropForm
  },
  {
    path: 'form/normal',
    component: NormalForm
  },
  {
    path: 'form/sort',
    component: SortForm
  },
  {
    path: 'form/prac',
    component: PracForm
  }
]

export default formRoutes
