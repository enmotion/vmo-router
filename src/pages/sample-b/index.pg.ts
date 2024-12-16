import type { VmoRouteRecordRaw } from '../../../types/index'

const page: VmoRouteRecordRaw<{ avoidTag: boolean; keepAlive: boolean }> = {
  name: 'sample-b',
  path: '/sample-b',
  props: true,
  meta: {
    keepAlive: true,
    avoidTag: true
  },
  component: () => import('./page.vue')
}
export default page
