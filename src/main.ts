import './assets/style.css'
import { mergeAll } from 'ramda'
import { createWebHashHistory } from 'vue-router'
import { createRouter } from '../index'
import type { VmoRouteMenuItemRaw, VmoRouteToRaw } from '../types'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
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
    PGS,
    [
      {
        label: 'sample-a:sample-a1',
        to: {
          name: 'sample-a1',
          params: {
            name: 'enmotion'
          },
          template: {
            pageKey: 'SampleA',
            parent: 'main',
            route: {
              path: 'sample-a1/test/:name',
              props: true
            }
          }
        }
      },
      {
        label: 'sample-a:sample-a2',
        to: {
          name: 'sample-a2',
          params: {
            name: 'enmotion2'
          },
          template: {
            pageKey: 'SampleA',
            parent: 'main',
            route: {
              path: 'sample-a2/:name/test',
              props: true
            }
          }
        }
      },
      {
        label: 'sample-b:sample-b1',
        to: {
          name: 'sample-b1',
          template: {
            pageKey: 'SampleB',
            parent: 'main',
            route: {
              path: 'sample-b1'
            }
          }
        }
      }
    ].map(item => item.to)
  )
  router.beforeEach((to, from, next) => {
    if (to.matched.length == 0) {
      next({ name: 'error-404' })
      return
    }
    next()
  })
  console.log(router)
  createApp(App).use(createPinia()).use(router).mount('#app')
  // router.$instance.replace({ name: 'sample-01' })
} catch (err) {
  console.log(err)
}
