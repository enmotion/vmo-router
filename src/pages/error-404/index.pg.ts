import type { VmoRouteRecordRaw } from '../../../types/index'

const page: VmoRouteRecordRaw<{ avoidTag: boolean }> = {
  name: 'error-404',
  path: '/error-404',
  props: true,
  meta: {
    keepAlive: false,
    avoidTag: true
  },
  component: () => import('./page.vue')
}
export default page
