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
          { text: '使用指南', link: '/guide/getting-started' },
          { text: 'API', link: '/api/router' },
          { text: '部署文档', link: '/guide/deployment' }
        ],
        sidebar: [
          { text: '使用指南', items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '动态路由与模板', link: '/guide/dynamic-routes' },
            { text: '持久化与 KeepAlive', link: '/guide/caching' },
            { text: '离开保护', link: '/guide/leave-protection' }
          ] },
          { text: 'API 与维护', items: [
            { text: 'Router API', link: '/api/router' },
            { text: 'Store API', link: '/api/store' },
            { text: '类型与辅助函数', link: '/api/types' },
            { text: '迁移与常见问题', link: '/guide/migration' },
            { text: '开发与 GitHub Pages', link: '/guide/deployment' }
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
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'API', link: '/en/api/router' },
          { text: 'Deployment', link: '/en/guide/deployment' }
        ],
        sidebar: [
          { text: 'Guide', items: [
            { text: 'Getting started', link: '/en/guide/getting-started' },
            { text: 'Dynamic routes and templates', link: '/en/guide/dynamic-routes' },
            { text: 'Persistence and KeepAlive', link: '/en/guide/caching' },
            { text: 'Leave protection', link: '/en/guide/leave-protection' }
          ] },
          { text: 'API and maintenance', items: [
            { text: 'Router API', link: '/en/api/router' },
            { text: 'Store API', link: '/en/api/store' },
            { text: 'Types and helpers', link: '/en/api/types' },
            { text: 'Migration and FAQ', link: '/en/guide/migration' },
            { text: 'Development and GitHub Pages', link: '/en/guide/deployment' }
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
