import './assets/style.css'
import { mergeAll } from 'ramda'
import { createWebHashHistory } from 'vue-router'
import { createRouter } from '../use.lib/index'
import { createApp } from 'vue'
import PGS from './pages/index'
import App from './App.vue'

try {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [mergeAll([PGS.MainPg, { children: [PGS.Sample01, PGS.Sample02] }])]
  })
  createApp(App).use(router).mount('#app')
  router.$instance.replace({ name: 'sample-01' })
  console.log(router.hasRoute('sss'), router.hasRoute('sss'))
} catch (err) {
  console.log(err)
}
