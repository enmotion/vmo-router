import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'vmo-router',
  base: '/vmo-router/',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: '面向 Vue 3 的动态路由模板、持久化恢复与页面缓存管理',
      themeConfig: {
        nav: [
          { text: '认识本库', link: '/guide/why-vmo-router' },
          { text: '使用指南', link: '/guide/getting-started' },
          { text: 'API', link: '/api/router' },
          { text: '部署文档', link: '/guide/deployment' }
        ],
        sidebar: [
          { text: '认识本库', items: [
            { text: '价值与 Vue Router 对比', link: '/guide/why-vmo-router' }
          ] },
          { text: '理解原理', items: [
            { text: '模板与动态路由', link: '/guide/dynamic-routes' },
            { text: '路由管理与配置缓存', link: '/guide/caching' },
            { text: 'KeepAlive 页面缓存', link: '/guide/keep-alive' }
          ] },
          { text: '场景与使用', items: [
            { text: '应用场景与完整流程', link: '/guide/scenarios' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '离开保护', link: '/guide/leave-protection' }
          ] },
          { text: 'API 参考', items: [
            { text: 'Router API', link: '/api/router' },
            { text: 'Store API', link: '/api/store' },
            { text: '辅助函数', link: '/api/helpers' },
            { text: '类型参考', link: '/api/types' },
            { text: 'Vue Router 原生 API', link: '/api/native' }
          ] },
          { text: '项目维护', items: [
            { text: '迁移与常见问题', link: '/guide/migration' },
            { text: '文档开发与部署', link: '/guide/deployment' }
          ] }
        ],
        editLink: { pattern: 'https://github.com/enmotion/vmo-router/edit/main/docs/:path', text: '在 GitHub 上编辑此页' },
        outline: { label: '本页目录', level: [2, 3] },
        docFooter: { prev: '上一页', next: '下一页' },
        sidebarMenuLabel: '菜单', returnToTopLabel: '回到顶部', darkModeSwitchLabel: '主题',
        langMenuLabel: '切换语言'
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      description: 'Dynamic route templates, persistence and page caching for Vue 3',
      themeConfig: {
        nav: [
          { text: 'Introduction', link: '/en/guide/why-vmo-router' },
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'API', link: '/en/api/router' },
          { text: 'Deployment', link: '/en/guide/deployment' }
        ],
        sidebar: [
          { text: 'Introduction', items: [
            { text: 'Value and Vue Router comparison', link: '/en/guide/why-vmo-router' }
          ] },
          { text: 'How it works', items: [
            { text: 'Templates and dynamic routes', link: '/en/guide/dynamic-routes' },
            { text: 'Route management and configuration caching', link: '/en/guide/caching' },
            { text: 'KeepAlive page caching', link: '/en/guide/keep-alive' }
          ] },
          { text: 'Scenarios and usage', items: [
            { text: 'Scenarios and complete workflow', link: '/en/guide/scenarios' },
            { text: 'Getting started', link: '/en/guide/getting-started' },
            { text: 'Leave protection', link: '/en/guide/leave-protection' }
          ] },
          { text: 'API reference', items: [
            { text: 'Router API', link: '/en/api/router' },
            { text: 'Store API', link: '/en/api/store' },
            { text: 'Helper functions', link: '/en/api/helpers' },
            { text: 'Type reference', link: '/en/api/types' },
            { text: 'Native Vue Router APIs', link: '/en/api/native' }
          ] },
          { text: 'Maintenance', items: [
            { text: 'Migration and FAQ', link: '/en/guide/migration' },
            { text: 'Documentation development and deployment', link: '/en/guide/deployment' }
          ] }
        ],
        editLink: { pattern: 'https://github.com/enmotion/vmo-router/edit/main/docs/:path', text: 'Edit this page on GitHub' },
        outline: { label: 'On this page', level: [2, 3] },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        sidebarMenuLabel: 'Menu', returnToTopLabel: 'Return to top', darkModeSwitchLabel: 'Theme',
        langMenuLabel: 'Change language'
      }
    }
  },
  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/enmotion/vmo-router' }],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细内容', resetButtonTitle: '清除搜索',
                backButtonTitle: '返回', noResultsText: '没有找到相关结果',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    }
  },
  vite: { css: { postcss: { plugins: [] } } }
})
