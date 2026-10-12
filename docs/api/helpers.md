# 辅助函数

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

## 完整签名与副作用

### loadPageTemplateByImport(templates)

```ts
loadPageTemplateByImport(templates: Record<string, unknown>): Record<string, RouteRecordRaw>
```

同步返回模板池，不注册路由、不写 store、不导航。输入的模块路径需要能取到直接父文件夹名；将该名字转为 PascalCase 作为键。模块内容可为默认导出包装或直接路由记录。重复键抛错；它不负责完整验证每条模板。组件是否懒加载取决于模板 component，eager glob 只加载模板声明。

```ts
const templates = loadPageTemplateByImport(
  import.meta.glob('./**/*.pg.ts', { eager: true, import: 'default' })
)
```

### validateVmoRouterToRaw(to, templates)

```ts
validateVmoRouterToRaw<META>(
  to: VmoRouteToRaw<META>,
  templates: Record<string, Partial<RouteRecordRaw>>
): boolean
```

返回基础字段是否通过非空检查；不注册、不导航、不改缓存。返回 true 不能保证完整定义可注册，不检查权限、重复路径、父关系、完整数据形状或组件是否可用。导入应用前仍应验证外部数据。

### addRouterWithVmoRouterToRaw(to, templates, routerInstance?)

```ts
addRouterWithVmoRouterToRaw<META>(
  to: VmoRouteToRaw<META>,
  templates: Record<string, RouteRecordRaw>,
  routerInstance?: Router
): void
```

同步合并模板与覆盖字段，外层 name 设置记录名称。提供 routerInstance 时调用原生 addRoute；省略时仅处理与检查配置，不返回生成对象。无效配置或没有组件、命名视图、重定向及 children 时抛错。它不会建立本库动态注册清单、写缓存或管理 KeepAlive；日常使用 addRouter。

### usePreventBrowserBeforeunloadBehavior(disabled = true, message = '')

```ts
usePreventBrowserBeforeunloadBehavior(disabled?: boolean, message?: string): void
```

在组件 setup 调用，同步返回 void。disabled 会立即设置 store.browserBeforeunloadDisabled；这里 true 表示启用离开保护，命名应按现有 API 理解。挂载时注册 beforeunload，卸载时移除。浏览器保护或 SPA 保护任一开关为 true 时取消事件默认行为并设置 returnValue。组件外调用只设置开关，不安装监听；未安装 Pinia 会出错。message 是请求提示文本，浏览器可能忽略并显示固定提示。不支持等待异步确认，不能保证浏览器一定展示提示。不会修改路由或缓存。

```ts
// 在根组件 setup 中安装监听，初始不启用浏览器保护。
usePreventBrowserBeforeunloadBehavior(false)
// 编辑时：store.setBrowserBeforeunloadDisabled(true)
```

实际 SPA 确认回调见[离开保护](../guide/leave-protection.md)。
