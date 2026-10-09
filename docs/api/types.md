# 类型与辅助函数

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

## loadPageTemplateByImport

接受模块映射并返回模板池。使用文件直接父文件夹名生成 PascalCase 键；例如 `sample-a` 对应 `SampleA`。支持默认导出模块和 eager/default glob。归一化后的重复键会抛错。

## validateVmoRouterToRaw

```ts
validateVmoRouterToRaw(to, templates) // boolean
```

检查名称、模板覆盖路径和模板存在性；不会检查名称或路径是否与已有 router 冲突，也不替代后端配置的完整校验。

## addRouterWithVmoRouterToRaw

```ts
addRouterWithVmoRouterToRaw(to, templates, routerInstance?) // void
```

合并配置并可选注册到原生实例。名称取自外层 `to.name`；父路由存在时移除路径前导斜杠，否则按根路由装载。无可用组件、命名视图、重定向或子路由时抛错。不更新 store，不返回生成记录。日常使用建议调用代理的 `addRouter`。

## Vue Router 重新导出

`useRoute`、`createMemoryHistory`、`createWebHashHistory`、`createWebHistory`、`createRouterMatcher`、`isNavigationFailure`、`loadRouteLocation`、`onBeforeRouteLeave`、`onBeforeRouteUpdate`、`useLink`、`parseQuery` 和 `stringifyQuery`。

`usePreventBrowserBeforeunloadBehavior` 的用法见[离开保护](../guide/leave-protection.md)。
