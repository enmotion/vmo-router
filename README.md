# vmo-router

`vmo-router` is a routing management tool that encapsulates `vue-router` to address complex and inconsistent **dynamic route configuration** issues and the lack of **best practices** in actual `vue` `SPA` development. Its design philosophy is low-invasive, with the core idea being to intercept the route creation process of `vue-router`, proxy some commonly used methods, thereby simplifying the complexity of route management.

An important feature of `vmo-router` is to **pool** regular page templates, transforming them from a static mode to a dynamic dispatch mode. This means that the loading and switching of pages no longer rely on predefined static configurations but are achieved through dynamic dispatching. Combined with an efficient caching mechanism, `vmo-router` ensures that users are almost unaware of the entire operation process, which is fully dynamic, enhancing both development efficiency and user experience.

Through this design, `vmo-router` not only simplifies dynamic route configuration but also provides more consistent and systematic route management practices, helping developers better handle complex front-end routing needs under the `vue` framework.

### Features

1. **Pooled Route Templates**: Using the loadPageTemplateByImport method provided by vue-router, vmo-router can automatically load page templates and supports lazy loading mode. This ensures that pages are only loaded when needed, improving the initial loading speed and performance of the application.
2. **Pre-instantiated Static Routes**: vmo-router supports the preloading of basic pages (such as login pages, home pages, error pages). These pages serve as the foundation of the routing system, achieving separation between static and dynamic routes, thus meeting the needs of different scenarios.
3. **Batch Dynamic Loading**: After user login, vmo-router can dynamically load all page templates through JSON data returned by the backend, building a complete route table. Each template instance can be individually configured with name, path, params, meta, and parent-child route relationships, ensuring the flexibility and consistency of route configuration.
4. **Single-point Dynamic Loading**: The router.push and router.replace methods are extended to support dynamic addition of the route table. These methods also support dynamic configuration and cache handling of route template instance parameters, making route management more flexible and efficient.
5. **Page Return Prevention**: vmo-router provides interception and control over browser and vue-router route transitions, refresh, and close events, ensuring safer user operations. For example, it can prevent users from returning to certain pages via the browser’s back button, enhancing user experience and security.
6. **Route State Management**: vmo-router comes with a built-in state manager based on Pinia, which allows convenient and unified operations on the global state of routes (such as keepAlive). This makes route state management simpler and more efficient.

### Installation:

```typescript
npm i vmo-router
```

### Quick Start::

Prepare a `vite` project. The required file structure for `vmo-router` is as follows, and the rest can be configured according to your project needs:

```
root
└── src
    ├── main.ts
    ├── App.vue
    ├── router
    │   └── index.ts
    └── pages
        ├── sample-a
        │   └── index.pg.ts
        │   └── page.vue
        ├── sample-b
        │   └── index.pg.ts
        │  └── page.vue
        └── index.ts
    ....
....
```

src/main.ts

```typescript
import './assets/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { generateRouter } from './router'

try {
  const app = createApp(App).use(createPinia())
  const router = generateRouter()
  app.use(router).mount('#app')
} catch (err) {
  console.log(err)
}
```

src/App.vue

```typescript
<script setup lang="ts">
import { usePreventBrowserBeforeunloadBehavior } from '@lib/lib'
usePreventBrowserBeforeunloadBehavior(true)
</script>

<template>
  <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
  </router-view>
</template>

<style>
html,
body {
  height: 100%;
  display: flex;
  flex-grow: 1;
}
</style>

```

### Route Templates:

Route templates can be created in a conventional way or through the `loadPageTemplateByImport` method provided by `vmo-router`.

1. In the `src/pages/sample-a` folder, edit the following two files:

index.pg.ts

```typescript
import type { VmoRouteRecordRaw } from 'vmo-router'
const page: VmoRouteRecordRaw<{ avoidTag: boolean; keepAlive: boolean }> = {
  name: 'sample-a',
  path: 'sample-a',
  props: true,
  meta: {
    keepAlive: true,
    avoidTag: true
  },
  component: () => import('./page.vue')
}
export default page
```

page.vue

```typescript
<template>
  <div class="flex-col flex text-white p-[20px] text-xs flex-grow">
    <span class="text-base mb-[10px]">sample-a:{{ name }}</span>
    <input v-model="text" class="bg-[#00000055] p-[10px] w-full rounded border border-gray-800 outline-none" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { useRoute } from '@lib'

export default defineComponent({
  name: 'sample-a',
  props: {
    name: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props, context) {
    const text = ref('')
    const route = useRoute()

    return {
      text,
      route
    }
  }
})
</script>
```

2. Create a similar structure for `src/pages/sample-b`.
3. Create a `index.ts` file in the pages directory:
   src/pages/index.ts

```typescript
import { loadPageTemplateByImport } from 'vmo-router'
// The glob method covers all folders and potential subfolders from the current file location
export default loadPageTemplateByImport(import.meta.glob('./**/*.pg.ts', { eager: true, import: 'default' }))
// `loadPageTemplateByImport` will traverse all `.pg.ts` files under `pages` and automatically load them into the `export default` object
// The name of each page is converted from the folder name to camelCase, e.g., `sample-a` folder becomes `SampleA` (with a capital `S`)
```

At this point, the automatic loading is complete, and you can easily access the templates within `src/pages/index.ts` from any location.

### Route Creation:

The route creation process in `vmo-router` is similar to `vue-router`, but with some specific methods. Here’s how you can create routes:

Create a `src/router/index.ts` file:

```typescript
import { mergeAll } from 'ramda'
import { createRouter, createWebHashHistory, useRouterStore } from 'vmo-router'
import type { VmoRouteToRaw } from 'vmo-router'
import PGS from '../pages/index'
import { ElMessageBox } from 'element-plus'

type RouteMeta = {
  title?: string
  keepAlive: boolean
  name: string
}
// 一定要将内容通过函数包裹起来，避免 useRouterStore 在 pinia 未能注入前调用
export function generateRouter() {
  // 初始化 vmo-router 内置的 pinia 全局状态管理器
  const store = useRouterStore<VmoRouteToRaw<RouteMeta>>()
  /**
   * 给全局状态管理器添加缓存处理方法
   * 1.缓存处理本质就是将路由表 持久化
   * 2.考虑到不同的运行环境与开发习惯支持开发者用自己的方式进行缓存
   * 3.本范例做了一个简单的示范，具体开发可以根据自己的需要进行缓存处理
   */
  store.setCacheMethods({
    setter: routes => sessionStorage.setItem('routes', JSON.stringify(routes)),
    getter: () => JSON.parse(sessionStorage.getItem('routes') ?? '[]') as VmoRouteToRaw<RouteMeta>[]
  })
  /**
   * 配置路由跳转时，如果遇到需要阻断的情况，阻断行为的具体逻辑
   * 1. setConfirmToLeaveMethod 添入的方法，将会在路由守 beforeEach 方法前置执行
   * 2. 它的执行结果如果 返回 false ,则跳转直接终止
   * 3. 设置它的主要目的，是为了实现路由在部分页面上，可以根据 全局状态内的情况进行阻拦
   */
  store.setConfirmToLeaveMethod(meta => {
    return new Promise((resolve, reject) => {
      ElMessageBox({
        title: '操作提示',
        message: '当前页面未能保存'
      })
        .then(() => resolve(true))
        .catch(() => reject(false))
    })
  })
  // 创建路由
  const router = createRouter<RouteMeta>(
    {
      history: createWebHashHistory(), // 同 vue-router
      routes: [
        mergeAll([PGS.MainPg, { children: [PGS.SampleA, PGS.SampleB] }]), // 此处装载的是静态路由，不受动态路由管控
        PGS.Error404
      ]
    },
    PGS, // 模板池 基于 loadPageTemplateByImport 方法创建
    store // 路由全局状态管理器 pinia 实现
  )
  router.beforeEach((to, from) => {
    console.log(to)
    if (to.meta.keepAlive) {
      store.insertKeepAliveNames(to.name as string) // 将路由名 塞入 keepAlive 名单
    }
    if (to.matched.length == 0) {
      return { name: 'error-404' }
    }
    return true
  })
  return router
}
```

> Note: The beforeEach hook of the router object created by vmo-router is processed according to the recommended method by the vue-router official documentation, completely abandoning the use of next. Therefore, using next is not supported at all!

#### Preventing Browser Default Behavior

To handle unconfirmed scenarios, such as unsaved changes, accidental closure, refresh, or navigation away from the page, you can trigger custom interaction actions like popup prompts. Here’s how:

1. Import the `usePreventBrowserBeforeunloadBehavior` method in the root `.vue` file to set up event listeners on the `window` object.

For example, in `/src/App.vue`:

```typescript
<script setup lang="ts">
import { usePreventBrowserBeforeunloadBehavior, useRouterStore } from 'vmo-router'
usePreventBrowserBeforeunloadBehavior(true)
/**
 * `usePreventBrowserBeforeunloadBehavior` automatically binds and unbinds event listeners on the `window` object within the lifecycle of the root `.vue` component, and enables the interception behavior. Setting it to `false` will only bind the event listeners but will not trigger the interception behavior.
 * It can be used in any `.vue` file, but it is strongly recommended to place it in the root directory for the best usage effect.
 */
// const store = useRouterStore(); // Get the pinia object for route state management
// store.setBrowserBeforeunloadDisabled(true/false) can be called to dynamically reset whether to prevent the browser's default operation behavior
// store.setConfirmToLeaveMethod((RouteMeta) => {}) can be used to configure prompts or other interaction operations when leaving a route
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component"></component>
  </router-view>
</template>

<style>
html,
body {
  height: 100%;
  display: flex;
  flex-grow: 1;
}
</style>

```

### Built-in Route State Management

`vmo-router` is built on the template idea, and its most significant feature is dynamic route configuration when needed. However, it requires reasonable global state management, so it comes with a state manager based on `Pinia`. Before creating a `vmo-router` instance, you must instantiate the `pinia` instance (`single instance mode`).

```typescript
import { useRouterStore } from 'vmo-router'
const store = useRouterStore() // Built-in route state management
```

The `store` `getters` are as follows:

```typescript
// Get the current persistent route table, not the `keepAlive` table, responsible for routes that need to be added upon page refresh
store.getCachedRoutes
// Get the currently cached `keepAlive` routes, which need to be used in conjunction with the `keepAlive` component, and their maintenance depends on the `insertKeepAliveNames` method in actions
store.getKeepAliveRouteNames
// Get whether multiple persistences are enabled, if the persistent route table needs to cache multiple route tables, set this value to true
store.getMutipleCatch
// Get whether the router refresh, close, and other operations are currently blocked
store.getBrowserBeforeunloadDisabled
// Get whether the normal route transition is currently blocked, including `push`, `replace`, `back`, etc.
store.getRouteToLeaveDisabled
// Get the allowed `keepAlive` upper limit
store.getKeepAliveMax
// Get the current caching methods, `getter` and `setter`
store.getCacheMethod
// Get the method that will be executed before the route guards if `getRouteToLeaveDisabled` is true
store.getConfirmToLeaveMethod
```

The `store` `actions` are as follows:

```typescript
// Add new persistent route table
store.insertCachedRoute(to: RouteToRaw)
// Remove cached route table
store.removeCachedRoute(name: string)
// Add `keepAlive`
store.insertKeepAliveNames(name: string)
// Remove `keepAlive`
store.removeKeepAliveNames(name: string)
// Set the current caching mode, multi-cache or single cache, true for multi-cache
store.setMutipleCatch(mutipleCatch: boolean)
// Set whether to prompt when leaving a page and whether to prevent the browser's default refresh, return, and navigation away from the page behavior. This can be used within individual pages.
store.setBrowserBeforeunloadDisabled(browserBeforeunloadDisabled: boolean)
// Set whether to trigger a prompt when leaving a route
store.setRouteToLeaveDisabled(routeToLeaveDisabled: boolean)
// Set the maximum number of cached routes
store.setKeepAliveMax(max: number = 0)
// Clear all dynamically cached routes
store.clearDynamicRouters()
// Set the caching methods
store.setCacheMethods(methods: RouterStore.CacherMethods<RouteToRaw>)
// Set the transition interceptor, supporting asynchronous return results, which can be used for various interaction confirmation methods such as popups
store.setConfirmToLeaveMethod(method: (meta: RouterStore.ExtractRouteInfoType<RouteToRaw>) => Promise<boolean> | boolean)
```

### TypeScript Types and Explanation

```typescript
import type { RouterStore, Lazy, VmoRouteRecordRaw, VmoRouteToRaw, VmoRouteMenuItemRaw } from 'vmo-router'

// RouterStore: The type of the global route state manager (Pinia instance)
// Lazy<T>: Asynchronous component loading method
// VmoRouteRecordRaw<META>: Route object type constraint, extending from `RouteRecordRaw`, `META extends Record<string, any>`, allowing users to define custom `meta`
// VmoRouteToRaw<META>: The actual data structure required for `vmo-router` transitions
// VmoRouteMenuItemRaw<MENU, META>: Route menu structure, this type helps developers extend menus based on `vmo-router`
```
