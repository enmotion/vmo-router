import type { VmoRouteRecordRaw } from '../../../types/index'

const page: VmoRouteRecordRaw<Record<string, any>> = {
  name: 'main',
  path: '/',
  redirect: { name: 'sample-a' },
  component: () => import('./page.vue')
}
export default page
