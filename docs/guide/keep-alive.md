# KeepAlive 页面缓存

## 意义与实现

路由配置缓存让刷新后能找到页面；KeepAlive 让页面切换回来时保留组件实例中的输入和局部状态。刷新会销毁实例，这两种缓存不能互相替代。

本库只管理组件名称名单，Vue 的 `<keep-alive>` 才负责保存实例。名单匹配组件 name，不直接匹配 URL 或路由参数。

懒加载模板通过加载器复制组件顶层选项，并将 name 设为动态配置的外层路由名。同一模板生成 report-monthly 与 report-yearly 两个不同名称的路由时，可以对应不同组件名称。直接传入同步组件不会自动重命名，应自行保证其组件名称与名单一致。

同一个路由名称只改变 params，不会因此生成新的实例名称；独立缓存不同业务页面时，使用不同路由名和可区分的路径。标签页 UI 及组件 key 策略由应用决定。

## 接入步骤

使用懒加载模板，为页面设置应用约定的 meta.keepAlive，成功导航后添加名单，并将名单绑定到 `<keep-alive :include>`。meta 字段本身不会自动启用缓存。


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
