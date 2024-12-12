/*
 * @Author: enmotion
 * @Date: 2023-11-07 15:43:42
 * @Last Modified by: enmotion
 * @Last Modified time: 2023-11-07 15:49:34
 *
 * 页面自动加载 模块;
 * 1.所有页面的命名，都以页面js文件的直接父级文件夹为命名为准
 * 2.作为批量自动加载的页面js文件，请都辅以.pg.js为尾缀命名规则
 * 3.命名转换规则,如此例:父文件夹[parent-page] => 结果:ParentPage
 * 4.页面.vue文件避免了同步加载，通过.js文件做了异步加载处理,自动提升访问体验
 */
// import type { RouteRecordRaw } from 'vue-router'
// import upperFirst from 'lodash/upperFirst' // 首字母大写字符转换
// import camelCase from 'lodash/camelCase' // 骆驼字符转换 your-name => YourName
// import * as R from 'ramda' // ramda 引入

// const requireSources = import.meta.glob('./**/*.pg.ts', { eager: true, import: 'default' }) // vite模式资源自动加载的方式 深度遍历符 **
// const PageNames = R.keys(requireSources)
// const PageRouter: { [key: string]: RouteRecordRaw } = {}
// PageNames.forEach((pagename: string) => {
//   const content = requireSources[pagename]
//   const name = upperFirst(camelCase(pagename.split('/').splice(-2, 1)[0])) //获取相关页面所在文件夹位置,取直接父文夹名为页面名称;
//   PageRouter[name] = (content as { default?: any }).default || content
// })

// console.warn('PGS inited')
// export default PageRouter

import { loadPageTemplateByImport } from '@lib/lib'
export default loadPageTemplateByImport(import.meta.glob('./**/*.pg.ts', { eager: true, import: 'default' }))
