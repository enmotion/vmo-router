# vmo-router

`vmo-router` 是对 `vue-router` 进行二次封装的路由管理工具，旨在解决 `vue` `spa` 实际开发中 **动态路由配置** 复杂、功能一致性差, 缺少**最佳实践**的问题。它的设计理念是低侵入式的，核心思想是通过劫持 `vue-router` 的路由创建过程，代理部分常用方法，从而简化路由管理的复杂性。
`vmo-router` 的一个重要特性是将常规页面模板“**池化**”，即从静态模式转变为动态调度模式。这意味着页面的加载和切换不再依赖于预先定义的静态配置，而是通过动态调度来实现。结合高效的缓存机制，vmo-router 确保用户在使用过程中几乎无感知，但整个操作流程却完全动态化，提升了开发效率和用户体验。
通过这种设计，`vmo-router` 不仅简化了动态路由的配置，还提供了更加一致和系统化的路由管理实践，帮助开发者更好地应对复杂的`vue`框架下的前端路由需求。

#### 功能特点：

1. **池化路由模版**：通过 `vue-router` 提供的 `loadPageTemplateByImport` 方法，`vmo-router` 能够自动加载页面模板，并支持懒加载模式。这确保了页面在需要时才进行加载，提升了应用的初始加载速度和性能。
2. **静路由预实例**：`vmo-router` 支持基础页面（如登录页、首页、异常报错页面）的预先加载。这些页面作为系统的基础路由，实现了路由的动静分离，满足不同场景的需求。
3. **批量动态装载**，用户登录后，`vmo-router` 可以通过后端返回的 `JSON` 数据动态装载所有页面模板，构建完整的路由表。每个模板实例可以单独设置 `name`、`path`、`params`、`meta` 和 `父子路由关系`，确保路由配置的灵活性和一致性。
4. **单点动态装载**，`router.push` 和 `router.replace` 方法被扩展，支持动态添加路由表。这些方法同样支持路由模板实例参数的动态配置和缓存处理，使路由管理更加灵活和高效。
5. **页面返回禁止**，`vmo-router` 提供对浏览器和 `vue-router` 路由跳转、刷新、关闭的劫持控制，确保用户的操作更为安全。例如，可以禁止用户在某些页面通过浏览器后退按钮返回，提升用户体验和安全性。
6. **路由状态管理**，`vmo-router` 内置了一个基于 `Pinia` 的状态管理器，可以方便地对路由的全局状态（如 `keepAlive`）进行操作。这使得路由状态的管理更加简便和统一，提升了开发效率。

#### 如何安装:

```typescript
npm i vmo-router
```

#### 快速上手:

src/main.ts

```typescript
import './assets/style.css'
import { mergeAll } from 'ramda'
import { createWebHashHistory } from 'vue-router'
import { createRouter, type VmoRouteToRaw } from '../index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

import PGS from './pages/index'
import App from './App.vue'
import { VmoStore } from 'vmo-store'
import { useRouterStore } from '@lib/store'
import { ElMessageBox } from 'element-plus'
/**
 * 建立路由统一的 meta 标签类型声明
 */
type Meta = {
  keepAlive: boolean
  name: string
}
/**
 * 通过 VmoStore 建立持久化的缓存
 */
const data = new VmoStore<{ cachedRoutes: VmoRouteToRaw<Meta>[] }>({
  namespace: 'vmo-router',
  cryptoKey: 'aaafdasffasd',
  version: 1,
  dataProps: {
    cachedRoutes: {
      type: Array,
      default: () => [],
      storge: 'localStorage'
    }
  }
})
console.log(PGS)

try {
  const app = createApp(App).use(createPinia())
  const store = useRouterStore<VmoRouteToRaw<Meta>>()
  store.setCacheMethods({
    setter: routes => data.setData('cachedRoutes', routes),
    getter: () => data.getData('cachedRoutes')
  })
  // setConfirmToLeaveMethod 当路由跳转行为被阻拦时，将会通过该方法进行提示确认。
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
  const router = createRouter<Meta>(
    {
      history: createWebHashHistory(),
      routes: [mergeAll([PGS.MainPg, { children: [PGS.SampleA, PGS.SampleB] }]), PGS.Error404]
    },
    PGS, // 页面模板池
    store // 全局路由状态管理器 基于 pinia
  )
  // store.setMutipleCatch(false)
  // 路由全局守卫
  router.beforeEach((to, from, next) => {
    console.log(to)
    if (to.meta.keepAlive) {
      store.insertKeepAliveNames(to.name as string)
    }
    if (to.matched.length == 0) {
      next({ name: 'error-404' })
      return
    }
    next()
  })
  app.use(router).mount('#app')
  // router.$instance.replace({ name: 'sample-01' })
} catch (err) {
  console.log(err)
}
```

#### 路由模板:

路由模板可以通过常规的方式创建，也可以通过 `vmo-router` 内部提供的 ` loadPageTemplateByImport` 方法进行自动装载

1. 在项目根目录下，创建 src/pages 文件夹，它将作为我们存储模板页面的地方
2. 在 `pages` 下，再创建一个文件夹 `sample-a`，作为首个模板页面存放的位置，并分别创建两个文件，如下

src/pages/sample-a/index.pg.ts

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

src/pages/sample-a/page.vue

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

#### 路由创建

路由的创建，与`vue-router`基本类似，具体方法如下：
创建文件夹 src/router/index.ts

```typescript
import { mergeAll } from 'ramda'
import { createRouter, createWebHashHistory, useRouterStore } from '../../index'
import type { VmoRouteToRaw } from '../../index'
import PGS from '../pages/index'
import { ElMessageBox } from 'element-plus'

type RouteMeta = {
  title?: string
  keepAlive: boolean
  name: string
}
// 一定要将内容通过函数包裹起来，避免 useRouterStore 在 pinia 未能注入前调用
export function generateRouter() {
  const store = useRouterStore<VmoRouteToRaw<RouteMeta>>()
  // 给全局状态管理器添加缓存处理模式
  store.setCacheMethods({
    setter: routes => sessionStorage.setItem('routes', JSON.stringify(routes)),
    getter: () => JSON.parse(sessionStorage.getItem('routes') ?? '[]') as VmoRouteToRaw<RouteMeta>[]
  })
  // 配置路由跳转时，如果遇到需要阻断的情况，阻断行为的具体逻辑
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
  const router =
    createRouter<RouteMeta>(
      {
        history: createWebHashHistory(), // 同 vue-router
        routes: [
          mergeAll([PGS.MainPg, { children: [PGS.SampleA, PGS.SampleB] }]), // 此处装载的是静态路由，不受动态路由管控
          PGS.Error404
        ]
      },
      PGS, // 模板池 基于 loadPageTemplateByImport 方法创建
      store // 路由全局状态管理器
    ) /
    // store.setMutipleCatch(false) // 路由表缓存 是否开启多项，默认多项，如果开启单项，则只会缓存当前路由配置持久化，对本地缓存更为友好，但是对某种场景下，通过地址直接跳转带来不便。
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

> PS: router.beforeEach 的处理函数，已经依照 vue-router 官方推荐方式，弃用了 next， 这里再使用 next 模式无效！

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

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
   介于个人开发习惯的差异，请先了解其功能特点，再决定是否引用。
