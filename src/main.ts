import './assets/style.css'
import { mergeAll } from 'ramda'
import { createWebHashHistory } from 'vue-router'
import { createRouter } from '../index'
import type { VmoRouteMenuItemRaw, VmoRouteToRaw } from '../types'
import { createApp } from 'vue'
import PGS from './pages/index'
import App from './App.vue'
console.log(PGS)

const menuItem: VmoRouteToRaw<{ keepAlive: false }> = {
  name: ''
}

try {
  const router = createRouter(
    {
      history: createWebHashHistory(),
      routes: [mergeAll([PGS.MainPg, { children: [PGS.SampleA, PGS.SampleB] }]), PGS.Error404]
    },
    PGS
  )
  router.beforeEach((to, from, next) => {
    if (to.matched.length == 0) {
      next({ name: 'error-404' })
      return
    }
    next()
  })
  console.log(router)
  createApp(App).use(router).mount('#app')
  // router.$instance.replace({ name: 'sample-01' })
  router
    .push({ name: 'sample-b' })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
} catch (err) {
  console.log(err)
}
