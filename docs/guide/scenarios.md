# 应用场景与完整流程

## 后端菜单驱动的后台

后端提供可序列化的页面定义，本地模板池保留组件与加载函数。应用先验证配置的模板键、路径、名称及账号归属，再装载路由。菜单如何渲染由应用决定，VmoRouteMenuItemRaw 只是描述数据的类型。

以下代码放在已完成快速开始接入的应用服务模块中，router 和 store 是创建好的单例，Report 是本地懒加载模板。为便于演示，使用本地数组模拟已校验的后端配置：

```ts
import type { VmoRouteToRaw } from 'vmo-router'

type Meta = { title?: string; keepAlive?: boolean }
const definitions: VmoRouteToRaw<Meta>[] = [
  { name: 'report-monthly', template: { pageKey: 'Report', route: {
    path: '/reports/monthly/:id', props: true,
    meta: { title: 'Monthly', keepAlive: true }
  } } },
  { name: 'report-yearly', template: { pageKey: 'Report', route: {
    path: '/reports/yearly/:id', props: true,
    meta: { title: 'Yearly', keepAlive: true }
  } } }
]

async function loadAccountPages() {
  await router.reloadRoutes(definitions)
  await router.replace({ name: 'report-monthly', params: { id: '2026-10' } })
}

async function openYearlyReport() {
  await router.push({ name: 'report-yearly', params: { id: '2026' } })
}

async function logout() {
  store.setRouteToLeaveDisabled(false)
  router.clearRoutes()
  await router.replace({ name: 'login' })
}
```

login 应是静态路由。退出前若需确认未保存内容，应先完成确认，再关闭离开保护并清理；示例假定退出已确认。身份凭据的清理由应用处理。

## 同模板多页面

两个不同名称的路由复用 Report 模板，避免复制页面代码。配合 [KeepAlive 接入](./keep-alive.md)，切换回来可保留各页面的局部输入。仅改变同名路由的 id 不会创建另一组件名称；接口数据加载及参数变化响应需由页面实现。

## 刷新恢复

在 createRouter 之前设置 [同步持久化回调](./caching.md)，恢复路由定义后才开始首次导航。刷新到 /reports/yearly/2026 时，地址决定要打开的页面；不是自动逐个打开缓存列表。存储键应按账号及配置版本隔离，恢复前校验当前身份和配置。

## 账号切换

先清理旧账号路由及缓存，再切换存储上下文、获取新账号配置并 reloadRoutes。无关静态路由保留；clearRoutes(true) 会连登录页一起删除，不适合作为通常的退出清理。

## 未保存表单

编辑时启用离开保护，保存后关闭；SPA 导航调用确认回调，浏览器刷新和关闭使用 beforeunload。[离开保护](./leave-protection.md)说明两者的接入及浏览器限制。KeepAlive 保留实例不等于数据已经保存。

## 能力边界

本库不提供菜单或标签页组件，不持久化业务表单，也不代替服务端权限验证。route meta 是应用约定的数据，只有应用接入相关行为后才生效。
