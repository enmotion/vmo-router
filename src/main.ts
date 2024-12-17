import './assets/style.css'
import { mergeAll } from 'ramda'
import { createWebHashHistory } from 'vue-router'
import { createRouter, type VmoRouteToRaw } from '../index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

import PGS from './pages/index'
import App from './App.vue'
import { VmoStore } from 'vmo-store'
import { useRouterStore } from '@lib/store'
import { ElMessageBox } from 'element-plus'

type Meta = {
  keepAlive: boolean
  name: string
}
const data = new VmoStore<{ routers: VmoRouteToRaw<Meta>[] }>({
  namespace: 'vmo-router',
  cryptoKey: 'aaafdasffasd',
  version: 1,
  dataProps: {
    routers: {
      type: Array,
      default: () => [],
      storge: 'localStorage'
    }
  }
})
console.log(PGS)

try {
  const app = createApp(App).use(createPinia())
  const store = useRouterStore<VmoRouteToRaw<Meta>>()
  store.setCacheMethods({
    setter: routes => data.setData('routers', routes),
    getter: () => data.getData('routers')
  })
  store.setConfirmToLeaveMethod(meta => {
    return new Promise((resolve, reject) => {
      console.log(meta)
      ElMessageBox({
        title: '操作提示',
        message: '当前页面未能保存'
      })
        .then(() => resolve(true))
        .catch(() => reject(false))
    })
  })
  const router = createRouter<Meta>(
    {
      history: createWebHashHistory(),
      routes: [mergeAll([PGS.MainPg, { children: [PGS.SampleA, PGS.SampleB] }]), PGS.Error404]
    },
    PGS,
    store
  )
  router.beforeEach((to, from, next) => {
    console.log(to)
    if (to.meta.keepAlive) {
      store.insertKeepAliveNames(to.name as string)
    }
    if (to.matched.length == 0) {
      next({ name: 'error-404' })
      return
    }
    next()
  })
  app.use(router).mount('#app')
  // router.$instance.replace({ name: 'sample-01' })
} catch (err) {
  console.log(err)
}
