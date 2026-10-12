# Store API

## useRouterStore

```ts
const store = useRouterStore<VmoRouteToRaw<Meta>>()
```

在安装 Pinia 后调用。store ID 为 `router`，同一 Pinia 实例内共享状态，不要与应用自己的同名 store 冲突。

## Getters

| Getter | 含义 |
| --- | --- |
| `getCachedRoutes` | 内存配置优先，否则使用注入的 getter，默认空数组 |
| `getKeepAliveRouteNames` | KeepAlive 名单 |
| `getMutipleCatch` | 是否保存多个动态路由，默认 true |
| `getBrowserBeforeunloadDisabled` | 刷新关闭保护，默认 false |
| `getRouteToLeaveDisabled` | SPA 离开保护，默认 false |
| `getKeepAliveMax` | 名单上限，未设置或 0 表示不限制 |
| `getCacheMethod` | 当前持久化回调对象 |
| `getConfirmToLeaveMethod` | 当前确认方法 |

## Actions

| Action | 行为 |
| --- | --- |
| `insertCachedRoute(to)` | 按名称插入或更新，执行 setter |
| `removeCachedRoute(name)` | 删除配置并执行 setter，名称支持 string/symbol |
| `clearDynamicRouters()` | 清空配置并执行 setter，不删除真实路由 |
| `setCacheMethods({ getter, setter })` | 设置同步持久化回调 |
| `setMutipleCatch(boolean)` | 切换持久化模式，下一次写入生效 |
| `setKeepAliveName(string \| string[])` | 替换名单 |
| `insertKeepAliveName(string \| string[])` | 去重插入并按上限裁剪 |
| `removeKeepAliveName(string \| string[])` | 删除名单中的名称 |
| `setKeepAliveMax(number = 0)` | 取绝对值并四舍五入；后续插入时裁剪 |
| `setBrowserBeforeunloadDisabled(boolean)` | 设置刷新关闭保护 |
| `setRouteToLeaveDisabled(boolean)` | 设置 SPA 离开保护 |
| `setConfirmToLeaveMethod(fn)` | 设置接收离开页 meta 的确认回调 |

缓存配置需要可序列化时请使用字符串路由名。多个 router 共用该 store 时会共享名单与开关，当前主要使用方式是一个应用一个 router。

## 状态默认值

| 状态 | 默认值 | 说明 |
| --- | --- | --- |
| cachedRoutes | null | null 时 getter 回退到持久化 getter 或空数组；写入后以内存数组为准 |
| cacheMethods | undefined | 不默认选择 localStorage 或 sessionStorage |
| mutipleCatch | true | 保留多个配置；false 表示每次写入只留本条 |
| keepAliveRouteNames | [] | 组件 include 名单，不是组件实例 |
| keepAliveMax | undefined | 未设置或 0 不限制 |
| routeToLeaveDisabled | false | true 启用 SPA 离开确认 |
| browserBeforeunloadDisabled | false | true 启用浏览器刷新/关闭保护 |
| confirmToLeaveMethod | async () => true | 默认放行，不自动弹窗 |

所有 action 同步返回 void；注册的确认回调本身可以返回 Promise。getter 只读取状态，不注册路由。下表补充参数、写入时机和边界：

| Action | 参数 / 默认值 | 副作用与边界 |
| --- | --- | --- |
| insertCachedRoute | to: RouteToRaw | 多缓存按 name 更新或追加；单缓存替换整个数组；每次调用 setter |
| removeCachedRoute | name: string或symbol | 过滤配置，即使名称不存在也调用 setter |
| clearDynamicRouters | 无 | cachedRoutes=[] 并调用 setter；不清理注册清单或 KeepAlive |
| setCacheMethods | 同步 getter/setter | 仅设置回调，不立即读取、写入或恢复；已有 cachedRoutes 数组会优先于 getter |
| setMutipleCatch | boolean | 仅改变后续写入策略，不立刻裁剪已有配置 |
| setKeepAliveName | string或string[] | 直接替换名单，不去重、不按 max 裁剪 |
| insertKeepAliveName | string或string[] | 去重后按插入顺序保留最后 max 项；重复名称不会移动到末尾 |
| removeKeepAliveName | string或string[] | 按名称移除，不删除路由或持久化配置 |
| setKeepAliveMax | number=0 | Math.round(Math.abs(max))；仅在后续 insert 时应用 |
| setRouteToLeaveDisabled | boolean | 仅设置 SPA 开关；成功导航自动重置 false |
| setBrowserBeforeunloadDisabled | boolean | 仅设置浏览器开关；还需安装生命周期监听 |
| setConfirmToLeaveMethod | (meta) => boolean或`Promise<boolean>` | 替换回调，接收离开页面的 meta，不是目标页 |

业务持久化写入的 setter 应同步处理自身错误；action 不捕获存储错误，可能在内存已更新后抛出。空数组会阻止 getter 回退，切换账号通常先 clearRoutes，再显式载入新定义，不能仅更换 getter 就期待自动恢复。

```ts
store.setKeepAliveMax(5)
store.insertKeepAliveName(['report-monthly', 'report-yearly'])
store.setConfirmToLeaveMethod(async () => window.confirm('放弃未保存修改？'))
store.setRouteToLeaveDisabled(true)
// 保存完成后：
store.setRouteToLeaveDisabled(false)
```

router.removeRoute/clearRoutes 同步多种状态；这些 store action 各自只处理自己的状态，不可将 clearDynamicRouters 当成清理真实路由的替代品。

## Getter 返回类型

getCachedRoutes 返回 RouteToRaw[]；getKeepAliveRouteNames 返回 string[]；getMutipleCatch、getBrowserBeforeunloadDisabled、getRouteToLeaveDisabled 返回 boolean；getKeepAliveMax 返回 number | undefined；getCacheMethod 返回 `CacherMethods<RouteToRaw>` | undefined；getConfirmToLeaveMethod 返回确认回调或 undefined。
