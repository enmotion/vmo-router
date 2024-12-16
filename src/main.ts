import './assets/style.css'
import { mergeAll } from 'ramda'
import { createWebHashHistory } from 'vue-router'
import { createRouter } from '../index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { generateUseRouterStore } from '@lib/store'
import PGS from './pages/index'
import App from './App.vue'
console.log(PGS)

try {
  const app = createApp(App).use(createPinia())
  const router = createRouter(
    {
      history: createWebHashHistory(),
      routes: [mergeAll([PGS.MainPg, { children: [PGS.SampleA, PGS.SampleB] }]), PGS.Error404]
    },
    PGS,
    []
  )

  router.beforeEach((to, from, next) => {
    if (to.matched.length == 0) {
      next({ name: 'error-404' })
      return
    }
    next()
  })
  router.reloadRoutes(
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
    ].map((item: any) => item.to)
  )
  generateUseRouterStore({
    cacherMethods: {
      getCacheRouters: () => [],
      setCacheRouters: routers => {
        console.log(routers)
      }
    },
    preventDialogContent: {},
    mutipleCatch: true
  })
  app.use(router).mount('#app')
  // router.$instance.replace({ name: 'sample-01' })
} catch (err) {
  console.log(err)
}
