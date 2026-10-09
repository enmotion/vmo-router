# 快速开始

vmo-router 是 Vue Router 的动态路由扩展，适合需要根据后端配置装载页面的 Vue 3 应用。

## 安装

```sh
npm install vmo-router vue@^3.3.4 vue-router@^4.5.0 pinia@^2.3.0 ramda@^0.30.0
```

Vue、Vue Router、Pinia 和 Ramda 是 peer dependencies。已有项目请先核对依赖版本。

## 准备页面

创建 `src/pages/report/page.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ id?: string }>()
const note = ref('')
</script>

<template>
  <section>
    <h1>报表 {{ id }}</h1>
    <input v-model="note" placeholder="备注" />
  </section>
</template>
```

创建 `src/pages/report/index.pg.ts`：

```ts
import type { VmoRouteRecordRaw } from 'vmo-router'

const page: VmoRouteRecordRaw<{ keepAlive?: boolean }> = {
  path: '/report/:id',
  props: true,
  meta: { keepAlive: true },
  component: () => import('./page.vue')
}
export default page
```

创建 `src/pages/index.ts`：

```ts
import { loadPageTemplateByImport } from 'vmo-router'

export default loadPageTemplateByImport(
  import.meta.glob('./**/*.pg.ts', { eager: true, import: 'default' })
)
```

文件夹 `report` 对应模板键 `Report`。模板声明即时加载，页面组件依然懒加载。

创建 `src/pages/home.vue`：

```vue
<template><h1>首页</h1></template>
```

## 创建应用

`src/main.ts`：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory, useRouterStore } from 'vmo-router'
import type { VmoRouteToRaw } from 'vmo-router'
import App from './App.vue'
import templates from './pages'
import Home from './pages/home.vue'

type Meta = { keepAlive?: boolean }
const app = createApp(App)
app.use(createPinia())
const store = useRouterStore<VmoRouteToRaw<Meta>>()

const router = createRouter<Meta>(
  {
    history: createWebHashHistory(),
    routes: [{ path: '/', name: 'home', component: Home }]
  },
  templates,
  store
)

router.afterEach((to, _from, failure) => {
  if (!failure && to.meta.keepAlive && typeof to.name === 'string') {
    store.insertKeepAliveName(to.name)
  }
})

app.use(router)
router.isReady().then(() => app.mount('#app'))
```

`src/App.vue`：

```vue
<script setup lang="ts">
import { useRouterStore } from 'vmo-router'
const store = useRouterStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="store.getKeepAliveRouteNames">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
```

## 首次动态跳转

在组件的 `setup` 中调用：

```ts
import { useRouter, isNavigationFailure } from 'vmo-router'
const router = useRouter<{ keepAlive?: boolean }>()

async function openReport() {
  try {
    const failure = await router.push({
      name: 'report-monthly',
      params: { id: '2026-10' },
      template: { pageKey: 'Report', route: { path: '/reports/:id' } }
    })
    if (isNavigationFailure(failure)) return
    // 此时导航已经完成。
  } catch (error) {
    console.error('打开报表失败', error)
  }
}
```

希望刷新后仍能访问该页面，请继续配置[持久化](./caching.md)。
