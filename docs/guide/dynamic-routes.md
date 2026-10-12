# 动态路由与模板

## 配置如何成为路由

模板池是 pageKey 到本地 RouteRecordRaw 的映射，不是已注册路由表。实例配置的 template.route 与模板深度合并，外层 name 决定最终记录名称；template.parent 按父名称指定装载位置。params/query/hash 是导航数据，不是模板覆盖字段。

addRouter 只注册；push/replace 可在首次导航前注册；reloadRoutes 批量注册并写入缓存。之后按已存在的 name 导航不会重新合并模板。修改路径或 meta 等定义需删除后重新注册，或批量重载。

## 模板与实例

模板池保存本地路由记录。动态配置通过 `template.pageKey` 选择模板，使用 `template.route` 深度合并覆盖配置，最终路由名称来自外层 `name`。

```ts
const destination = {
  name: 'report-yearly',
  params: { id: '2026' },
  template: {
    pageKey: 'Report',
    route: { path: '/yearly/:id', props: true, meta: { keepAlive: true } }
  }
}
await router.push(destination)
```

动态配置必须提供非空的 `name`、`template.route.path` 和有效模板键。为持久化使用字符串名称，并保持配置可以 JSON 序列化；组件和加载函数放在本地模板里。

## 多实例

同一模板可以生成不同名称和路径的路由。懒加载页面会复制顶层组件选项并设置实例名称，便于 KeepAlive 根据名称区分页面。

直接使用同步组件时，本库不会自动重命名组件。需要同模板多实例缓存时，建议使用 `() => import('./page.vue')`。

## 父子路由

```ts
await router.reloadRoutes([
  { name: 'child', template: { pageKey: 'Report', parent: 'workspace', route: { path: 'report/:id' } } },
  { name: 'workspace', template: { pageKey: 'Layout', route: { path: '/workspace' } } }
])
```

父页面需要包含 `<router-view />`。批量重载可以接收任意父子顺序；缺少父路由、循环依赖或重复名称会拒绝，预检查期间不改动当前路由表。

单次 `addRouter` 或首次动态 `push` 的父路由应预先注册；若不存在，底层装载函数会按根路由添加。不要依赖该回退来表达嵌套关系。

## 注册、导航与清理

- `addRouter(to)` 同步注册，不导航，也不立即持久化。
- `push/replace` 在目标名称未注册时按模板注册；已注册时直接导航，不重新应用传入模板。
- 成功导航后记录动态配置；取消可能留下已注册但尚未持久化的路由。
- `reloadRoutes(routes)` 替换本库管理的动态路由并写入缓存；第二参数 `false` 表示追加。
- `clearRoutes()` 清理全部受管理的动态路由，保留静态路由。
- 退出登录或切换账号时清理旧路由，再装载新用户的配置。

删除动态父路由时，其子孙路由和别名一并删除，对应的动态注册配置、持久化路由缓存和 keep-alive 名称也同步清理。无关的静态路由保留。

清理带必填参数的路由无需提供 `params`，其他参数化路由也不会阻断清理。正常导航仍需提供必填参数，无需改成可选参数或手动清空浏览器缓存。清理不执行导航，例如退出登录后应显式跳转到保留的静态登录页：

```ts
router.clearRoutes()
await router.replace({ name: 'login' }) // login 应在静态路由表中注册
```

完整清理范围与返回类型见 [Router API](../api/router.md#路由清理)。

路由装载不等于授权验证。后端需要继续校验每次业务请求的访问权限。
