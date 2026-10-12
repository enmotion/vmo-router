# 路由管理与配置缓存

## 三种状态各自保存什么

| 状态 | 内容与所有者 | 生命周期与用途 |
| --- | --- | --- |
| 动态注册清单 dynamicRoutes | router 闭包中的 Map；本库注册的配置 | 只在内存中存在，跟踪全部动态注册，供导航写缓存与清理使用 |
| 路由配置缓存 cachedRoutes | Pinia 中的配置数组；getter/setter 连接外部存储 | 保存定义及 params/query/hash，刷新后重新注册路由 |
| KeepAlive 名称名单 | Pinia 中的字符串数组 | 交给 Vue 的 include 筛选组件；组件实例由 Vue 缓存 |

注册清单和配置缓存必须分开：addRouter 注册后可能尚未导航，取消导航也可能留下注册记录，单缓存模式只保留最近写入的配置。clearRoutes 仍能清理这些已经注册的动态路由。

## 从注册到刷新恢复

```text
本地模板 + 动态配置
  → 注册到 Vue Router 和动态清单
  → 成功导航：更新配置缓存，并调用 setter
  → 页面刷新：应用先配置 getter/setter
  → createRouter 读取缓存并同步恢复路由
  → 按当前地址执行首次导航
```

addRouter 不立即写入持久化。成功导航到受管理的具名实例后，内部 afterEach 更新其 params、query、hash；静态路由不写动态缓存。reloadRoutes 则在注册时直接写入配置，无需先导航。createRouter 的恢复也会写入缓存，setter 应支持重复写入。

恢复路由不等于重新打开每个缓存页面：当前地址仍决定首次导航目标。缓存不保存组件代码、表单输入或接口数据；刷新后的业务状态需由应用另行恢复。

删除路由时，本库以实际删除的名称同步清理注册清单、配置缓存和 KeepAlive 名单；不用解析地址，所以不需要必填 params。存储回调只支持同步操作，异常应由应用处理，不保证外部存储失败时回滚。

## 持久化配置

在 `createRouter` 之前注入缓存方法：

```ts
store.setCacheMethods({
  getter: () => {
    try {
      const routes = JSON.parse(sessionStorage.getItem('vmo:routes') ?? '[]')
      return Array.isArray(routes) ? routes : []
    } catch {
      return []
    }
  },
  setter: routes => {
    try {
      sessionStorage.setItem('vmo:routes', JSON.stringify(routes))
    } catch (error) {
      console.warn('路由缓存写入失败', error)
    }
  }
})
```

应用还应校验恢复配置是否符合当前模板、账号和版本。数组检查只处理数据形状，不能替代完整验证。无效配置可能使 `createRouter` 同步抛出错误。

路由创建时同步恢复配置，保证首次导航能找到目标。`sessionStorage` 适合同标签页刷新；`localStorage` 跨会话保存，需自行隔离账号和清理旧数据。回调只支持同步读写。

## 单缓存与多缓存

```ts
store.setMutipleCatch(true) // 默认：保存多个动态路由
store.setMutipleCatch(false) // 下一次写入仅保留一个配置
```

单缓存模式影响持久化内容，不会删除其他已经注册的动态路由。同名配置更新时，会覆盖旧的参数、查询和哈希。静态路由导航不写入动态缓存。

单缓存模式下，如果当前页依赖动态父路由，持久化一个子路由不足以恢复整棵树。嵌套动态路由建议使用多缓存，或将父路由定义为静态路由。


组件实例保留请继续阅读 [KeepAlive 页面缓存](./keep-alive.md)。
