import './assets/style.css'
import { mergeAll, findIndex } from 'ramda'
import { createWebHashHistory } from 'vue-router'
import { createRouter, type VmoRouteToRaw } from '../index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PGS from './pages/index'
import App from './App.vue'
import { VmoStore } from 'vmo-store'

const data = new VmoStore<{ routers: VmoRouteToRaw<{ keepAlive: boolean; name: string }>[] }>({
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
  const router = createRouter(
    {
      history: createWebHashHistory(),
      routes: [mergeAll([PGS.MainPg, { children: [PGS.SampleA, PGS.SampleB] }]), PGS.Error404]
    },
    PGS,
    {
      pushRouterRaw: to => {
        const routers = data.$store.routers
        to.template?.route.meta?.name
        routers.push(to)
        data.$store.routers = routers
      },
      getRouterRaws: () => data.$store.routers,
      removeRouterRaw: (name: string) => {
        const routers = data.$store.routers
        routers.splice(
          findIndex(to => to.name == name, data.$store.routers),
          1
        )
        data.$store.routers = routers
      }
    }
  )

  router.beforeEach((to, from, next) => {
    if (to.matched.length == 0) {
      next({ name: 'error-404' })
      return
    }
    next()
  })
  router.reloadRoutes(data.$store.routers)
  // useRouterStore({
  //   cacherMethods: {
  //     getCacheRouters: () => [],
  //     setCacheRouters: routers => {
  //       console.log(routers)
  //     }
  //   },
  //   keepAliveName:[]
  // })
  app.use(router).mount('#app')
  // router.$instance.replace({ name: 'sample-01' })
} catch (err) {
  console.log(err)
}
