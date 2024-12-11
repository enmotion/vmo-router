import type { VmoRouteRecordRaw } from '../../../types/index'

const page: VmoRouteRecordRaw<{ avoidTag: boolean }> = {
  name: 'sample-01',
  path: '/sample-01',
  props: true,
  meta: {
    keepAlive: false,
    avoidTag: true
  },
  component: () => import('./page.vue')
}
export default page
