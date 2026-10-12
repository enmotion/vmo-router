# vmo-router

[中文文档](https://enmotion.github.io/vmo-router/) · [English](https://enmotion.github.io/vmo-router/en/)

Vue Router 的动态路由扩展：将本地页面组件组织成模板，用可序列化配置生成不同业务页面，并统一处理按需注册、刷新恢复和退出清理。

Vue Router 负责匹配、导航和守卫；本库补充模板映射、独立动态注册清单、持久化配置回调和 KeepAlive 名称管理。组件实例仍由 Vue 的 KeepAlive 保存，菜单 UI、业务数据和后端授权由应用负责。

## 最小示例

安装依赖：

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

App.vue 需要包含 `<router-view />`，示例假定这些本地组件存在，openReport 在登录页的用户操作中调用。默认配置缓存只在内存中；刷新恢复需要在创建 router 之前注入持久化回调，KeepAlive 也需要显式接入。

## 文档路线

- [价值与 Vue Router 对比](docs/guide/why-vmo-router.md)
- [模板与动态路由](docs/guide/dynamic-routes.md)、[配置缓存](docs/guide/caching.md)、[KeepAlive](docs/guide/keep-alive.md)
- [完整应用场景](docs/guide/scenarios.md)、[快速开始](docs/guide/getting-started.md)
- [Router API](docs/api/router.md)、[Store API](docs/api/store.md)、[辅助函数](docs/api/helpers.md)、[类型](docs/api/types.md)、[原生 API](docs/api/native.md)
- [迁移与常见问题](docs/guide/migration.md)、[文档开发与部署](docs/guide/deployment.md)

文档以当前仓库实现为准，使用 npm 包时请核对发布版本。本地阅读执行 `npm ci` 和 `npm run docs:dev`；构建执行 `npm run docs:build`。
