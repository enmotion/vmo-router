# Router API

## createRouter

```ts
createRouter<META>(options, templates, store?)
```

`options` 为 Vue Router 的 `RouterOptions`，`templates` 为 `Record<string, RouteRecordRaw>`，`store` 为可选路由 store。返回 `VmoProxyRouter<META>`，保留原生路由的大部分功能。恢复配置无效时同步抛错。

## 扩展方法

| 方法 | 返回 | 行为 |
| --- | --- | --- |
| `push(to)` | 导航 Promise | 必要时按模板注册，然后导航 |
| `replace(to)` | 导航 Promise | 动态导航，替换当前历史项 |
| `addRouter(to)` | `void` | 同步注册；无效配置或重复名称抛错 |
| `reloadRoutes(routes, needClear = true)` | `Promise<void>` | 预检查配置与依赖，然后替换或追加 |
| `removeRoute(name)` | `void` | 删除目标及其后代，同步受管理的缓存和名单 |
| `clearRoutes(all = false)` | `void` | 默认保留静态路由；true 清空全部路由和缓存 |
| `beforeEach(guard)` | `() => void` | 注册守卫，返回注销函数 |

`push/replace` 支持 `VmoRouteToRaw<META>` 及原生 `RouteLocationRaw`，包括字符串和路径对象。底层失败可返回 `NavigationFailure`，配置、守卫或懒加载错误可拒绝 Promise。

```ts
const unregister = router.beforeEach(async (to, from) => {
  return true
})
unregister()
```

守卫使用返回值风格，参数顺序为 `to, from`，不提供 `next`。

## 原生方法与 $instance

`afterEach`、`onError`、`isReady`、`getRoutes`、`hasRoute`、`resolve`、`back`、`forward` 等保留原生行为。

`router.$instance` 是原始 Vue Router 实例。通过 `$instance` 或原生 `addRoute` 注册的路由不进入本库动态管理清单；直接修改原始实例可能绕过缓存同步。

## useRouter

```ts
const router = useRouter<META>()
```

在组件 setup 内返回安装到应用的路由代理。应用必须安装本库创建的 router，才能使用扩展方法。
