import type { VmoRouteRecordRaw } from '../../../types/index'
import component from './page.vue'
const page: VmoRouteRecordRaw<{ avoidTag: boolean; keepAlive: boolean }> = {
  name: 'sample-c',
  path: 'sample-c',
  props: true,
  meta: {
    keepAlive: true,
    avoidTag: true
  },
  component: component
}
export default page
