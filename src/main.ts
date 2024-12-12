import './assets/style.css'
import { mergeAll } from 'ramda'
import { createWebHashHistory } from 'vue-router'
import { createRouter } from '../use.lib/index'
import { createApp } from 'vue'
import PGS from './pages/index'
import App from './App.vue'
console.log(PGS)
try {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [mergeAll([PGS.MainPg, { children: [PGS.SampleA, PGS.SampleB] }]), PGS.Error404]
  })
  router.beforeEach((to, from, next) => {
    if (to.matched.length == 0) {
      next({ name: 'error-404' })
      return
    }
    next()
  })
  createApp(App).use(router).mount('#app')
  // router.$instance.replace({ name: 'sample-01' })
  console.log(router.hasRoute('sss'), router.hasRoute('sss'))
} catch (err) {
  console.log(err)
}
