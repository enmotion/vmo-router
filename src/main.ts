import './assets/style.css'
import { type VmoRouteToRaw } from '../index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { VmoStore } from 'vmo-store'
import { generateRouter } from './router'

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

try {
  const app = createApp(App).use(createPinia())
  const router = generateRouter()
  app.use(router).mount('#app')
} catch (err) {
  console.log(err)
}
