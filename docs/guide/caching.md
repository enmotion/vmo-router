# 持久化与 KeepAlive

这两种缓存解决不同问题：持久化保存路由配置，以便刷新后恢复；KeepAlive 保留组件实例及输入状态。

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

## KeepAlive

```ts
router.afterEach((to, _from, failure) => {
  if (!failure && to.meta.keepAlive && typeof to.name === 'string') {
    store.insertKeepAliveName(to.name)
  }
})
store.setKeepAliveMax(3)
```

```vue
<router-view v-slot="{ Component }">
  <keep-alive :include="store.getKeepAliveRouteNames">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

`keepAlive` 是应用约定的 meta 字段，需要自己注册上述钩子。名单上限按插入顺序裁剪；再次插入已有名称不会移动顺序，因此不是 LRU。`setKeepAliveMax` 不立即裁剪现有名单，后续插入时生效。刷新不会保存组件内存。

`store.clearDynamicRouters()` 仅清空持久化配置；若要同时删除真实路由，请调用 `router.clearRoutes()`。
