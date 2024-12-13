import type { VmoRouteRecordRaw } from '../../../types/index'

const page: VmoRouteRecordRaw<Record<string, any>> = {
  name: 'main',
  path: '/',
  redirect: { path: 'sample-a' },
  meta: ['fdasf', 'fdsafsadf'],
  component: () => import('./page.vue')
}
export default page
