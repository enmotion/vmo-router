import './assets/style.css'
import { createWebHashHistory } from 'vue-router'
import { createRouter } from '../use.lib/index'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
try {
  const sss = createRouter({
    history: createWebHashHistory(),
    routes: []
  })
  console.log(sss.hasRoute('sss'), sss.hasRoute('sss'))
} catch (err) {
  console.log(err)
}
