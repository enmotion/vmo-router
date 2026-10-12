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

### 路由清理

`removeRoute(name)` 按 Vue Router 的父子关系删除目标路由及其子孙路由、别名，并同步移除对应的动态注册配置、持久化路由缓存和 keep-alive 名称。目标名称不存在时，仍会清理该名称对应的缓存和 keep-alive 名称。

`clearRoutes()` 对本库管理的动态路由执行上述清理，保留无关的静态路由；`clearRoutes(true)` 清空全部路由、动态配置缓存和 keep-alive 名称。通过原生 API 添加到待删除父路由下的子路由也会随父路由删除。

`reloadRoutes(routes)` 默认先清理旧动态路由，再注册并持久化新配置；`reloadRoutes(routes, false)` 追加配置，不清理旧路由。清理和注册均不执行导航，当前页面的跳转由应用调用 `push/replace` 完成。

清理不解析路由地址，因此删除带必填参数的路由无需提供 `params`，无关的 `/project-home/:id/:name` 路由也不会因缺少参数而阻断清理。正常按名称导航或调用 `resolve()` 时，仍需提供必填参数；无需将参数改成可选，也无需手动清空浏览器缓存。

以上清理行为不改变这些方法的参数或返回类型。

### 导航与守卫

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

## 逐项使用契约

### createRouter(options, templates, store?)

同步返回 VmoProxyRouter。options 是原生 RouterOptions，包含 history 与静态 routes；templates 是键到本地路由记录的映射；store 可省略。省略时仍支持动态注册和清理，但不维护持久化、KeepAlive 或 store 离开保护。创建时读取缓存并同步恢复、写回配置。无效定义、重复名称、缺失或循环父关系会同步抛错；存储回调抛错也可能导致创建失败。

### `useRouter<META>`()

无参数，在组件 setup 中获取注入的代理；不创建新 router，也不改变状态。需先 app.use(router)。泛型约束页面 meta，不能将原生 router 自动变成代理。

### push(to) / replace(to)

接收字符串、原生路径对象、命名目标或 VmoRouteToRaw。返回 `Promise<NavigationFailure | void | undefined>`。目标具名且尚未注册时，先用 template 注册，再导航；已存在时只导航，忽略新的 template 覆盖。replace 替换当前历史项，push 新增历史项。

成功导航写入受管理目标的配置及实际 params/query/hash，关闭 SPA 离开保护。取消或重复导航可返回 NavigationFailure；无效注册、缺失必填参数、守卫及加载错误可能拒绝 Promise。注册发生在导航前，取消导航不会撤销注册。

```ts
const failure = await router.push({ name: 'report-monthly', params: { id: '2026-10' } })
if (isNavigationFailure(failure)) return
await router.replace('/login')
```

### addRouter(to)

同步返回 void。新定义需非空 name、有效 template.pageKey 和 template.route.path。深度合并模板后注册并记录在动态清单，不导航、不立即写缓存。重复名称或无效配置同步抛错。单次注册若父路由不存在，会按根路由装载；要求严格父依赖时用 reloadRoutes。

```ts
router.addRouter({ name: 'report', template: {
  pageKey: 'Report', route: { path: '/report/:id' }
} })
```

### reloadRoutes(routes, needClear = true)

routes 是 VmoRouteToRaw 数组，返回 `Promise<void>`。默认替换本库管理的动态注册，false 追加；两者都注册并写缓存、不导航。预检查模板和名称、按父依赖排序，输入可为任意父子顺序。无效定义、名称冲突或缺失/循环父关系会拒绝且预检查不改动现有路由。预检查不调用持久化；实际写缓存时的外部存储异常不保证回滚。单缓存模式下每次写入会覆盖前一次，因此持久化结果只留最后一条。

### removeRoute(name) / clearRoutes(all = false)

均同步返回 void。name 支持 string/symbol；持久化与 KeepAlive 推荐字符串名称。removeRoute 可删除静态或动态目标，其后代与别名由原生路由器一并处理，再清理已删除名称对应的配置和名单。clearRoutes 默认只从受管理动态注册出发清理；all=true 清空整个路由表。独立的原生 addRoute 注册不在动态清单内，但若属于被删除父路由的后代，会一起删除。存储 setter 异常可同步抛出，真实路由可能已经删除。清理不跳转、不自动关闭离开保护。

```ts
router.removeRoute('report')
router.clearRoutes()
await router.replace({ name: 'login' })
```

### beforeEach(guard)

接收 VmoNavigationGuard，返回注销函数。guard 的参数为 to/from，无 next；返回 true/undefined 放行、false 取消、导航目标重定向，支持 Promise。抛错或拒绝进入导航错误流程。注册和注销本身不导航，也不写缓存。内部 store 确认守卫在 createRouter 时独立注册。

### $instance 与原生方法

$instance 返回底层 Router，便于原生集成。直接操作它可能绕过动态清单和缓存同步。其 addRoute 与代理上的原生 addRoute 不等于 addRouter。代理保留其他原生方法和响应式 currentRoute；重新导出的函数见[原生 API](./native.md)。
