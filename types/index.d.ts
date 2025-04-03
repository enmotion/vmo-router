/*
 * @Author: enmotion
 * @Date: 2024-12-14 00:30:07
 * @Last Modified by: enmotion
 * @Last Modified time: 2025-01-08 18:01:50
 */

import type {
  RouteRecordRaw,
  RouteComponent,
  RouteLocationAsRelativeGeneric,
  Router,
  RouteLocationNormalized,
  NavigationFailure
  // RouteLocationNamedRaw,
  // RouteQueryAndHash,
  // RouteLocationOptions,
  // RouteLocationRaw,
  // RouteLocationAsPathGeneric
} from 'vue-router'
/* types   ---------- ---------- ---------- ---------- ---------- ----------*/
export declare type Lazy<T> = () => Promise<T>
/**
 * 路由对象类型约束 继承自 RouteRecordRaw
 * META 是 meta 可扩展的情况 如下:
 * {
 *  pageName: string // 页面标题
 *  tokenRequire?: boolean // 登录约束，如果为false 或者
 *  powerRequire?: string[] // 前端权限，当路由被后端管理时，不做约束
 *  avoidTabMenu?: boolean // 不添加至标签菜单 true 不允许添加到菜单
 *  unConfigurable?: boolean // 该页面是否允许进入动态配置 true 不允许
 *  keepAlive?: boolean // 是否存入缓存，true存入 false 免于存入
 * }
 * 用于例: index.pg.ts 文件中，有关路由懒加载的配置文件
 */
export declare type VmoRouteRecordRaw<META extends Record<string, any>> = Omit<RouteRecordRaw, 'meta' | 'component'> & {
  meta?: META
  component?: RouteComponent | Lazy<RouteComponent>
}

export declare type VmoRouteLocationRow = RouteLocationAsRelativeGeneric

/**
 * 路由跳转方式所需的 to 对象类型声明
 * 1. 由 vue-router RouteLocationRaw 类型扩展 push,replace 方法使用
 * 2. template: 路由池化后，动态加载所需数据,
 *    template.pageKey:对应路由池化名称，一般就是路由的文件夹父名称强转位驼峰命名
 *    template.parent?:非必填的父级路由，装填时，未必路由会直接加载，而是指定父路由装载
 *    template.router:路由池化的配置，需要为新的配置覆盖，但是唯独去掉了 name, 因为 name, 将由外层 RouteLocationRaw.name 决定
 * 用于 push , replace 方法中的 to 参数
 */
export declare type VmoRouteToRaw<META extends Record<string, any>> = RouteLocationAsRelativeGeneric & {
  template?: {
    pageKey: string
    parent?: string
    route: Omit<VmoRouteRecordRaw<META>, 'name'>
  }
}

/**
 * V2 路由菜单结构
 * ITEM 范型，可扩展为用户习惯的菜单形式, 但是其 to, template, strict 必须符合类型约束
 * META 范型，可以自由扩展成用户习惯的模式，但是必须为一个 Record<string,any> 类型的扩展
 * to: 路由实际跳转时需要依赖的配置
 */
export declare type VmoRouteMenuItemRaw<ITEM extends Record<string, any>, META extends Record<string, any>> = Omit<
  ITEM,
  'to' | 'children'
> & {
  to?: VmoRouteToRaw<META>
  children?: VmoRouteMenuItemRaw<ITEM, META>[] // 是否有子菜单,树状递归结构
}
/**
 * router.beforeEach 方法中需要作为入参的函数，
 * 主要是修改了原函数的参数，去掉了 next
 */
export type VmoNavigationGuard = (
  from: RouteLocationNormalized,
  to: RouteLocationNormalized
) => boolean | Record<string, any>
