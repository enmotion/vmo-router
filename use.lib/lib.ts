/*
 * @Author: enmotion
 * @Date: 2023-11-07 15:43:42
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-14 00:36:22
 */

import type { RouteRecordRaw, Router } from 'vue-router'
import type { VmoRouteToRaw } from '@type'
import upperFirst from 'lodash/upperFirst' // 首字母大写字符转换
import camelCase from 'lodash/camelCase' // 骆驼字符转换 your-name => YourName
import { keys, mergeDeepRight, mergeAll, clone, isNil, isEmpty } from 'ramda' // ramda 引入

/**
 * loadPageTemplateByImport 自动加载页面文件，组装成模版池
 * 页面自动加载 模块;
 * 1.所有页面的命名，都以页面js文件的直接父级文件夹为命名为准
 * 2.作为批量自动加载的页面js文件，请都辅以.pg.js为尾缀命名规则
 * 3.命名转换规则,如此例:父文件夹[parent-page] => 结果:ParentPage
 * 4.页面.vue文件避免了同步加载，通过.js文件做了异步加载处理,自动提升访问体验
 * @param pageTemplates use vite import.meta.glob to get PageTemplates
 * @returns
 */
// import.meta.glob('./**/*.pg.ts', { eager: true, import: 'default' })

export function loadPageTemplateByImport(templates: Record<string, unknown>): Record<string, RouteRecordRaw> {
  const pageKeys = keys(templates)
  const pages: { [key: string]: RouteRecordRaw } = {}
  pageKeys.forEach((pagename: string) => {
    const content = templates[pagename]
    const name = upperFirst(camelCase(pagename.split('/').splice(-2, 1)[0])) //获取相关页面所在文件夹位置,仅取直接父文夹名为模版 Key 名称;
    pages[name] = (content as { default?: any }).default || content
  })
  return pages
}

/* methods ---------- ---------- ---------- ---------- ---------- ----------*/
/**
 * 是否为合法的 VmoRouterToRaw 对象
 * 1. 是否存在新的路由名称;
 * 2. 是否存在匹配的模版文件;
 * 3. 路由名称是否已被占用; 待实现
 * 4. 路由路径是否已被占用; 待实现
 * @param routeLocationNamedRaw 动态路由添加所需的配置
 * @returns {boolean}
 */
export function validateVmoRouterToRaw<META extends Record<string, any>>(
  routeLocationNamedRaw: VmoRouteToRaw<META>,
  pageTemplates: { [key: string]: RouteRecordRaw }
): boolean {
  return (
    [
      routeLocationNamedRaw?.name,
      routeLocationNamedRaw?.template,
      pageTemplates[routeLocationNamedRaw?.template?.pageKey as string]
    ].filter((item: any) => isNil(item) || isEmpty(item)).length == 0
  )
}

/**
 * 依据模版创建动态路由创建
 * 1. 验证路由生成配置 VmoRouteToRaw<META> 是否合法正确
 * 2. merge最终的路由配置，匹配的模版池对象+配置
 * 3. 判断父路由是否存在
 * 4. 父路由存在则添加为父路由的子级，否则作为根路由装配
 * @param routeLocationNamedRaw 动态路由添加所需的配置
 * @param autoAddToRouter 是否同步完成添加操作
 * @param routerInstance 路由对象实例
 * @param pageTemplates 路由模版持有者
 * @returns {VmoxRouteLocationNamedRaw|void}
 */
export function addRouterWithVmoRouterToRaw<META extends Record<string, any>>(
  routeLocationNamedRaw: VmoRouteToRaw<META>,
  pageTemplates: { [key: string]: RouteRecordRaw },
  routerInstance?: Router
) {
  try {
    if (validateVmoRouterToRaw(routeLocationNamedRaw, pageTemplates)) {
      const prototype = mergeDeepRight(
        clone(pageTemplates[routeLocationNamedRaw?.template?.pageKey as string]),
        routeLocationNamedRaw?.template?.route ?? {}
      ) // merge 最终的模版数据
      if (!isNil(prototype.component)) {
        typeof 'sser' == 'function'
        prototype.component =
          typeof prototype.component == 'function'
            ? _routePageComponentLoader.bind({ name: routeLocationNamedRaw.name }, prototype.component)
            : prototype.component // 指定上下文做好异步加载准备
        prototype.name = routeLocationNamedRaw.name
        if (routerInstance) {
          if (
            routeLocationNamedRaw.template?.parent &&
            routerInstance.hasRoute(routeLocationNamedRaw.template?.parent)
          ) {
            // 存在指定的父级路由，且父级路由已经装载
            prototype.path = prototype.path.replace(/^\/+/g, '') // 如果存在父级路由，则需要去除地址中以 / 开头的情况
            routerInstance.addRoute(routeLocationNamedRaw.template?.parent, prototype) // 在指定的父路由下，添加路由
          } else {
            // 否则 当作根路由装载，忽视其可能的父级路由情况
            prototype.path = !/^\/.*/.test(prototype.path) ? '/' + prototype.path : prototype.path // 如果不存在父级别路由，则需要检查是否携带/开头，如果没有，则需要补充
            routerInstance.addRoute(prototype) // 直接添加路由
          }
        }
      }
    } else {
      throw new Error(`VmoRouter[ERROR]: 创建动态路由失败:
        \n [routeLocationNamedRaw?.name]:${routeLocationNamedRaw?.name as string}
        \n [routeLocationNamedRaw?.template]:${routeLocationNamedRaw?.template?.pageKey as string}
        \n PGS[routeLocationNamedRaw?.template]:${pageTemplates[routeLocationNamedRaw?.template?.pageKey as string]}
        \n 请补全以上参数`)
    }
  } catch (err) {
    throw err
  }
}

/**
 * 异步页面加载器,加载器具备路由更名功能
 * @param this // 上下文，组件加载后，会修改组件内的自定义命名，符合加载规则
 * @param component // ()=>import("xxxx.vue") 异步加载的组件加载器
 * @returns function // 返回最终的加载器
 * 在懒加载的路由添加模式中，如果简单采用复制的方式，将会导致路由被重复声明内存空间，这将导致两个问题
 * 1.开发时，不得不采用刷新页面的方式，才能看到热更；
 * 2.生产时，内存空间被不断的过度消耗，
 * 所以目前采用更为轻巧的模式，只是浅拷贝，保持热更的同时，也能告诉路由缓存对应的内容;
 */
async function _routePageComponentLoader(this: any, component: any) {
  const context = this
  const module = await component()
  // 保守方法;
  // const compdata = clone(module.default ? module.default : module); // 安全写法，直接复制，避免内存污染的问题，但是目前该方法不能维持 vite 的热更响应，需要开发时手动刷新页面，才可以更新内容
  // const uniqID = Date.now().toString(32).toUpperCase();
  // compdata.name = context.name;
  // compdata.__hmrId = uniqID;
  // 新方法
  const compdata = mergeAll([module.default ? module.default : module, { name: context.name }])
  return Promise.resolve(compdata)
}
