# vmo-router

[English documentation](https://enmotion.github.io/vmo-router/en/) · [中文文档](https://enmotion.github.io/vmo-router/)

A dynamic routing extension for Vue Router. Organize local components as templates, generate business pages from serializable definitions, and coordinate on-demand registration, refresh recovery and logout cleanup.

Vue Router owns matching, navigation and guards. This library adds template mapping, independent registration tracking, persistence callbacks and KeepAlive name management. Vue still caches component instances; applications own menu UI, business data and backend authorization.

## Minimal example

Install dependencies:

```sh
npm install vmo-router vue@^3.3.4 vue-router@^4.5.0 pinia@^2.3.0 ramda@^0.30.0
```

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory, useRouterStore } from 'vmo-router'
import type { VmoRouteToRaw } from 'vmo-router'
import App from './App.vue'
import Login from './pages/login.vue'

type Meta = { title?: string }
const app = createApp(App)
app.use(createPinia())
const store = useRouterStore<VmoRouteToRaw<Meta>>()
const router = createRouter<Meta>({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login }
  ]
}, {
  Report: { path: '/template', component: () => import('./pages/report.vue') }
}, store)
app.use(router)
router.isReady().then(() => app.mount('#app'))

async function openReport() {
  await router.push({
    name: 'report-monthly', params: { id: '2026-10' },
    template: { pageKey: 'Report', route: { path: '/reports/monthly/:id' } }
  })
}
```

App.vue must render `<router-view />`. This example assumes the local components exist; invoke openReport from a login-page user action. Configuration caching is memory-only by default. Supply persistence callbacks before creating the router for refresh recovery, and explicitly integrate KeepAlive.

## Documentation path

- [Value and Vue Router comparison](docs/en/guide/why-vmo-router.md)
- [Templates and dynamic routes](docs/en/guide/dynamic-routes.md), [configuration caching](docs/en/guide/caching.md), [KeepAlive](docs/en/guide/keep-alive.md)
- [Complete scenarios](docs/en/guide/scenarios.md), [getting started](docs/en/guide/getting-started.md)
- [Router API](docs/en/api/router.md), [Store API](docs/en/api/store.md), [helpers](docs/en/api/helpers.md), [types](docs/en/api/types.md), [native APIs](docs/en/api/native.md)
- [Migration and FAQ](docs/en/guide/migration.md), [documentation development and deployment](docs/en/guide/deployment.md)

Documentation follows the current repository implementation; verify your npm release version. Read locally with `npm ci` and `npm run docs:dev`; build with `npm run docs:build`.
