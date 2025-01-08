# vmo-router

`vmo-router` 是对 `vue-router` 进行二次封装的路由管理工具，旨在解决 `vue` `spa` 实际开发中 **动态路由配置** 复杂、功能一致性差, 缺少**最佳实践**的问题。它的设计理念是低侵入式的，核心思想是通过劫持 `vue-router` 的路由创建过程，代理部分常用方法，从而简化路由管理的复杂性。
`vmo-router` 的一个重要特性是将常规页面模板“**池化**”，即从静态模式转变为动态调度模式。这意味着页面的加载和切换不再依赖于预先定义的静态配置，而是通过动态调度来实现。结合高效的缓存机制，vmo-router 确保用户在使用过程中几乎无感知，但整个操作流程却完全动态化，提升了开发效率和用户体验。
通过这种设计，`vmo-router` 不仅简化了动态路由的配置，还提供了更加一致和系统化的路由管理实践，帮助开发者更好地应对复杂的`vue`框架下的前端路由需求。

### 功能特点：

1. **池化路由模版**：通过 `vue-router` 提供的 `loadPageTemplateByImport` 方法，`vmo-router` 能够自动加载页面模板，并支持懒加载模式。这确保了页面在需要时才进行加载，提升了应用的初始加载速度和性能。
2. **静路由预实例**：`vmo-router` 支持基础页面（如登录页、首页、异常报错页面）的预先加载。这些页面作为系统的基础路由，实现了路由的动静分离，满足不同场景的需求。
3. **批量动态装载**，用户登录后，`vmo-router` 可以通过后端返回的 `JSON` 数据动态装载所有页面模板，构建完整的路由表。每个模板实例可以单独设置 `name`、`path`、`params`、`meta` 和 `父子路由关系`，确保路由配置的灵活性和一致性。
4. **单点动态装载**，`router.push` 和 `router.replace` 方法被扩展，支持动态添加路由表。这些方法同样支持路由模板实例参数的动态配置和缓存处理，使路由管理更加灵活和高效。
5. **页面返回禁止**，`vmo-router` 提供对浏览器和 `vue-router` 路由跳转、刷新、关闭的劫持控制，确保用户的操作更为安全。例如，可以禁止用户在某些页面通过浏览器后退按钮返回，提升用户体验和安全性。
6. **路由状态管理**，`vmo-router` 内置了一个基于 `Pinia` 的状态管理器，可以方便地对路由的全局状态（如 `keepAlive`）进行操作。这使得路由状态的管理更加简便和统一，提升了开发效率。

### 如何安装:

```typescript
npm i vmo-router
```

### 快速上手:

1.准备好一个 `vite` 工程，`vmo-router` 部分所需文档结构如下，其余部分可依照工程所需配置

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
import { usePreventBrowserBeforeunloadBehavior } from 'vmo-router'
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

### 路由模板:

路由模板可以通过常规的方式创建，也可以通过 `vmo-router` 内部提供的 ` loadPageTemplateByImport` 方法进行自动装载

1. 在 src/pages/sample-a 文件夹下，分别编辑如下两个文件:

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
import { useRoute } from 'vmo-router'

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

2. src/pages/sample-b 文件目录下的文件 参照 sample-a
3. 在 `pages` 下再创建一个 `index.ts` 文件
   src/pages/index.ts

```typescript
import { loadPageTemplateByImport } from 'vmo-router'
// 范例基于 vite 工程 import.meta.glob('./**/*.pg.ts') 已经涵盖了当前文件位置，所有文件夹与可能存在的子文件夹
export default loadPageTemplateByImport(import.meta.glob('./**/*.pg.ts', { eager: true, import: 'default' }))
// loadPageTemplateByImport 将遍历 pages 下所有的 .pg.ts 结尾的文件，并自动将其装载在 export default 对象下
// 每个页面的名称都是由 .pg.ts 文件所在直接文件夹名称转换为驼峰命名而来，如 sample-a 文件夹 则页面名称为 SampleA [S是大写的]
```

到此，自动装载完成，我们就可以在任意位置引用这个 src/pages/index.ts 文件了，非常方便的获取它内部所携带的模板

### 路由创建

路由的创建，与`vue-router`基本类似，具体方法如下：
创建文件夹 src/router/index.ts

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

> PS: 特别 vmo-router 实例后的 router 对象其 beforeEach 的处理钩子，已经依照 vue-router 官方推荐方式，进行相关处理，完全弃用了 next，因此使用 next 完全不被支持！！！

#### 阻止浏览器默认行为

应对某些未确认的场景，如未保存，用户误操作关闭，刷新，离开页面，将会触发弹窗提示等自定义的交互动作，具体做法如下：

1. 在根 .vue 文件内引入 `usePreventBrowserBeforeunloadBehavior` 方法，实现对 `window` 对象的事件侦听

如：/src/App.vue

```typescript
<script setup lang="ts">
import { usePreventBrowserBeforeunloadBehavior, useRouterStore } from 'vmo-router'
// 此处设置的 true , 将整个SPA应用的刷新，关闭，离开等行为全部设置为需触发弹窗提示
usePreventBrowserBeforeunloadBehavior(true)
/**
 * usePreventBrowserBeforeunloadBehavior 自动的完成了对 window 对象 在 根.vue 对象的生命周期中，侦听行为的自动化绑定与解绑,并且启用阻拦行为，设置为false 则会只做绑定，但是不会触发行为。
 * 它可以执行在任意的 .vue 文件内，但是考虑到是全局性设置，因此强烈推荐在 根目录下，以获得最佳的使用效果
 */
// const store= useRouterStore(); // 获取路由状态管理器 pinia 对象
// store.setBrowserBeforeunloadDisabled(true/false) 调用此 action 操作，则可以做到动态的重置 是否阻止浏览器默认操作行为
// store.setConfirmToLeaveMethod((RouteMeta)=>{}) 离开时，弹窗提示或者其他交互操作，可以交由此方法进行配置
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

### 路由内置状态管理

`vmo-router` 是基于模版思想构建的一种路由实践，所需时配置可动态配置路由是它最大的亮点，但它需要一种全局状态的合理管控，因此其默认携带一个基于 `pinia` 的状态管理器。并且在`vmo-router` 实例前，必须实例化该 pinia 实例(单例模式)

```typescript
import { useRouterStore } from 'vmo-router'
const store = useRouterStore() // 路由内置状态管理
```

`store` 的 `getters` 如下:

```typescript
// 获取当前持久化路由表，此表不是 keepAlive 表达，其负责的是刷新页面时，可以获取的需要添加的路由
store.getCachedRoutes
// 获取当前缓存的路由 keepAlive ，但是它需要配合 keepAlive 组件使用，其内容的维护，也依赖 actions 中的 insertKeepAliveNames 方法
store.getKeepAliveRouteNames,
  // 获取当前是否为多持久化情况，持久化路由表中如果需要缓存多个路由表，需要将其值设置为 true
  store.getMutipleCatch,
  // 当前是否阻止路由器刷新 关闭等操作
  store.getBrowserBeforeunloadDisabled,
  // 当前是否阻拦路由正常的跳转，包括 push,reolace, back 等
  store.getRouteToLeaveDisabled,
  // 获取允许的 keepAlive 上限
  store.getKeepAliveMax,
  // 获取当前的 持久化缓存方法， getter, setter
  store.getCacheMethod,
  // 当 getRouteToLeaveDisabled  为 true，在路由守卫执行前，将会执行该方法,
  store.getConfirmToLeaveMethod
```

`store` 的 `actios` 如下:

```typescript
// 添加新的持久化路由表
store.insertCachedRoute(to: RouteToRaw)
// 移除已缓存的路由表
store.removeCachedRoute(name:string),
// 添加 keepAlive
  store.insertKeepAliveNames(name: string),
  // 移除 keepAlive
  store.removeKeepAliveNames(name: string),
  // 设置当前缓存模式，多缓存或者单一缓存， true 为多缓存
  store.setMutipleCatch(mutipleCatch: boolean),
  // 设置是否离开页面提示，是否禁止浏览器默认刷新，返回，导致离开页面的行为，可在单个页面内返回调用
  store.setBrowserBeforeunloadDisabled(browserBeforeunloadDisabled: boolean)
  // 设置触发路由离开提示, 设置触发路由离开是否提示
  store.setRouteToLeaveDisabled(routeToLeaveDisabled: boolean)
  // 设置路由缓存最大数
  store.setKeepAliveMax(max: number = 0),
  // 清除所有持久化由表
  store.clearDynamicRouters()
  // 设置缓存所需方法
  // method: getter()=>router[], setter:(value:router[])=>void
  store.setCacheMethods(methods: RouterStore.CacherMethods<RouteToRaw>)
  //  设置跳转阻拦器方式，它支持 异步的返回结果，可以支持弹窗，浮窗等各种交互确认方式
  store.setConfirmToLeaveMethod( method: (meta: RouterStore.ExtractRouteInfoType<RouteToRaw>) => Promise<boolean> | boolean)
```

### TypeScript 类型与说明

```typescript
import type { RouterStore, Lazy, VmoRouteRecordRaw, VmoRouteToRaw, VmoRouteMenuItemRaw } from 'vmo-router'

// RouterStore:路由全局状态管理器 pinia 实例类型
// Lazy<T>:异步组件加载方法
// VmoRouteRecordRaw<META>:路由对象类型约束 继承自 RouteRecordRaw, META extends Record<string,any>, 允许用户自定义 meta
// VmoRouteToRaw<META>: vmo-router 跳转时真正所需的数据结构
// VmoRouteMenuItemRaw<MENU,META> 路由菜单结构,此类型方便开发者可以扩展基于 vmo-router 的菜单
//
```
