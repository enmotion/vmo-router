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
