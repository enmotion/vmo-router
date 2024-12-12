import type { VmoRouteRecordRaw } from '../../../types/index'

const page: VmoRouteRecordRaw<{ avoidTag: boolean }> = {
  name: 'sample-b',
  path: '/sample-b',
  props: true,
  meta: {
    keepAlive: false,
    avoidTag: true
  },
  component: () => import('./page.vue')
}
export default page
