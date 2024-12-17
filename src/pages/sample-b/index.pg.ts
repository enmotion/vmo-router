import type { VmoRouteRecordRaw } from '../../../types/index'

const page: VmoRouteRecordRaw<{ avoidTag: boolean; keepAlive: boolean; boy: string }> = {
  name: 'sample-b',
  path: '/sample-b',
  props: true,
  meta: {
    keepAlive: true,
    avoidTag: true,
    boy: 'boy'
  },
  component: () => import('./page.vue')
}
export default page
