---
layout: home
hero:
  name: vmo-router
  text: 用模板组织动态路由
  tagline: 在 Vue Router 上管理动态页面、刷新恢复与 KeepAlive，减少后台系统的重复配置。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
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
