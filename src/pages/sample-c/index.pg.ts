import type { VmoRouteRecordRaw } from '../../../types/index'

const page: VmoRouteRecordRaw<{ avoidTag: boolean; keepAlive: boolean }> = {
  name: 'sample-c',
  path: 'sample-c',
  props: true,
  meta: {
    keepAlive: true,
    avoidTag: true
  },
  component: () => import('./page.vue')
}
export default page
