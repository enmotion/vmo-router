import { createRouter } from '@lib/index'
import type { Lazy, VmoRouteRecordRaw, VmoRouteToRaw, VmoRouteMenuItemRaw } from '@type'

/**
 * createRouter 创建路由的方法
 */
export { createRouter }
/**
 * VmoRouteRecordRaw<META extends Record<string,any>>
 * 给路由配置使用 *.pg.ts
 * VmoRouteToRaw<META extends Record<string,any>> createRouter
 * 生成的代理方法 push, replace 入参
 * VmoRouteMenuItemRaw<ITEM extend Reocrd<string,any>,META extends Record<string,any>>
 * 给菜单使用
 */
export type { Lazy, VmoRouteRecordRaw, VmoRouteToRaw, VmoRouteMenuItemRaw }
