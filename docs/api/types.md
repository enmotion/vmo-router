# 类型参考

## 类型

| 导出 | 用途 |
| --- | --- |
| `Lazy<T>` | `() => Promise<T>` |
| `VmoRouteRecordRaw<META>` | 页面模板，meta 由泛型约束 |
| `VmoRouteToRaw<META>` | 命名目标及可选模板配置 |
| `VmoRouteMenuItemRaw<ITEM, META>` | 扩展菜单字段、to 与递归 children |
| `VmoNavigationGuard` | `to, from` 返回值守卫，支持 Promise |
| `VmoProxyRouter<META>` | 扩展路由实例 |
| `RouterStore` | store、缓存回调与状态类型命名空间 |

```ts
import type { VmoRouteToRaw } from 'vmo-router'
type Meta = { title?: string; keepAlive?: boolean }
const to: VmoRouteToRaw<Meta> = {
  name: 'report',
  template: { pageKey: 'Report', route: { path: '/reports/:id', meta: { title: '报表' } } },
  params: { id: '2026' }
}
```

## VmoRouteToRaw 字段

| 字段 | 类型与必填条件 | 含义 |
| --- | --- | --- |
| name | string/symbol；新动态注册必填 | 全局路由名称，持久化用字符串 |
| params | 原生命名导航参数，可选 | 对应路径占位符；导航时提供必填项 |
| query / hash | 原生导航字段，可选 | 查询参数及锚点，不参与模板选择 |
| template | 已注册导航可省略；新注册必填 | 本地模板选择与覆盖 |
| template.pageKey | string，必填 | 模板池键，如 Report |
| template.parent | string，可选 | 父路由名称，不是父路径 |
| template.route | `Omit<VmoRouteRecordRaw<META>, 'name'>`，必填 | 深度覆盖模板；新注册需非空 path |

类型继承原生相对导航对象，name/template 在类型上可选不意味着任意对象都能新建动态路由。新注册需满足运行时校验；已存在名称只需普通导航字段。

## 模板与菜单类型

`VmoRouteRecordRaw<META>` 基于 RouteRecordRaw，替换 meta 与 component 类型；meta 受 META 约束，component 可为 RouteComponent 或 `Lazy<RouteComponent>`。保留 path、children、props、redirect、components 等记录字段。

`VmoRouteMenuItemRaw<ITEM, META>` 保留 ITEM 的业务字段，替换 to 与 children。两者可选，children 递归使用相同泛型；类型不生成菜单、不注册路由、不实现权限。

```ts
import type { VmoRouteMenuItemRaw } from 'vmo-router'
type Menu = VmoRouteMenuItemRaw<{ title: string }, { keepAlive?: boolean }>
const menu: Menu = { title: 'Reports', children: [{
  title: 'Monthly', to: { name: 'report-monthly', params: { id: '2026-10' } }
}] }
```

## 实例、守卫与 Store 类型

`VmoProxyRouter<META>` 保留 Router 的原生字段，以扩展方法替换同名方法并增加 $instance: Router。VmoNavigationGuard 接收原生 RouteLocationNormalized 的 to/from，返回原生 NavigationGuardReturn 或其 Promise，无 next。

`RouterStore.CacherMethods<RouteToRaw>` 包含 getter: () => RouteToRaw[] 和 setter: (routes: RouteToRaw[]) => void；RouterStore.State 描述状态；RouterStore.PiniaStore 是 useRouterStore 的返回类型；RouterStore.ExtractRouteInfoType 提取配置的 meta 泛型。回调只支持同步操作。

所有类型只用于编译检查，运行时输入仍需验证。辅助函数见[辅助函数 API](./helpers.md)，原生重导出见[原生 API](./native.md)。
