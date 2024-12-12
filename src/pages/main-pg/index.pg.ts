import type { VmoRouteRecordRaw } from '../../../types/index'

const page: VmoRouteRecordRaw<{ avoidTag: boolean }> = {
  name: 'main',
  path: '/',
  props: true,
  meta: {
    keepAlive: false,
    avoidTag: true
  },
  component: () => import('./page.vue')
}
export default page
