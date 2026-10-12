---
layout: home
hero:
  name: vmo-router
  text: 用模板组织动态路由
  tagline: 在 Vue Router 上管理动态页面、刷新恢复与 KeepAlive，减少后台系统的重复配置。
  actions:
    - theme: brand
      text: 了解本库
      link: /guide/why-vmo-router
    - theme: alt
      text: 查阅 API
      link: /api/router
    - theme: alt
      text: GitHub
      link: https://github.com/enmotion/vmo-router
features:
  - title: 模板注册
    details: 将页面组件留在本地，用配置指定页面名称、路径、参数和父级路由。
  - title: 动态导航
    details: 按需装载或批量注册，push 与 replace 返回可等待的导航结果。
  - title: 刷新恢复
    details: 注入持久化 getter/setter，在创建路由时恢复动态路由树。
  - title: 页面状态
    details: 管理 KeepAlive 名单和离开确认，分别控制路由配置与组件状态。
---

## 从哪里开始

第一次使用请阅读[快速开始](./guide/getting-started.md)。已接入旧版的项目请先阅读[迁移说明](./guide/migration.md)。

本文档描述当前仓库实现。安装的 npm 版本可能尚未包含仓库中的修复，使用前请核对发布版本。

## 推荐阅读顺序

1. [为什么使用 vmo-router](./guide/why-vmo-router.md)：业务价值及与 Vue Router 的区别。
2. [动态路由与模板](./guide/dynamic-routes.md)、[路由配置缓存](./guide/caching.md)、[KeepAlive](./guide/keep-alive.md)：理解配置、恢复与组件状态。
3. [应用场景与完整流程](./guide/scenarios.md)：登录、页面切换、刷新恢复与退出。
4. [快速开始](./guide/getting-started.md)与[离开保护](./guide/leave-protection.md)：实际接入。
5. [Router API](./api/router.md)、[Store API](./api/store.md)、[辅助函数](./api/helpers.md)、[类型](./api/types.md)、[原生 API](./api/native.md)：逐项查询。
