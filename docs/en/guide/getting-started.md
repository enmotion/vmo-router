# Getting started

vmo-router extends Vue Router with dynamic route management for Vue 3 applications that load pages from backend configuration.

## Install

```sh
npm install vmo-router vue@^3.3.4 vue-router@^4.5.0 pinia@^2.3.0 ramda@^0.30.0
```

Vue, Vue Router, Pinia and Ramda are peer dependencies. Check the versions already installed in your application.

## Create a page

Create `src/pages/report/page.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ id?: string }>()
const note = ref('')
</script>

<template>
  <section>
    <h1>Report {{ id }}</h1>
    <input v-model="note" placeholder="Notes" />
  </section>
</template>
```

Create `src/pages/report/index.pg.ts`:

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

Create `src/pages/index.ts`:

```ts
import { loadPageTemplateByImport } from 'vmo-router'

export default loadPageTemplateByImport(
  import.meta.glob('./**/*.pg.ts', { eager: true, import: 'default' })
)
```

The `report` folder becomes the template key `Report`. Template definitions load eagerly; page components remain lazy.

Create `src/pages/home.vue`:

```vue
<template><h1>Home</h1></template>
```

## Create the application

`src/main.ts`:

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

`src/App.vue`:

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

## Navigate to a dynamic page

Call this from a component's `setup`:

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
    // Navigation has completed.
  } catch (error) {
    console.error('Failed to open report', error)
  }
}
```

To keep the page accessible after a reload, configure [persistence](./caching.md).
