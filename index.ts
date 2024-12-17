import {
  useRouter,
  createRouter,
  createMemoryHistory,
  createWebHashHistory,
  createRouterMatcher,
  createWebHistory,
  isNavigationFailure,
  loadRouteLocation,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useLink,
  useRoute,
  parseQuery,
  stringifyQuery
} from '@lib/index'
import {
  loadPageTemplateByImport,
  validateVmoRouterToRaw,
  addRouterWithVmoRouterToRaw,
  usePreventBrowserBehavior
} from '@lib/lib'
import { useRouterStore } from '@lib/store'
import type { RouterStore } from '@lib/store'
import type { Lazy, VmoRouteRecordRaw, VmoRouteToRaw, VmoRouteMenuItemRaw } from '@type'

/**
 * createRouter 创建路由的方法
 */
export {
  useRouter,
  createRouter,
  createMemoryHistory,
  createWebHashHistory,
  createRouterMatcher,
  createWebHistory,
  isNavigationFailure,
  loadRouteLocation,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useLink,
  useRoute,
  parseQuery,
  stringifyQuery,
  // --
  loadPageTemplateByImport,
  validateVmoRouterToRaw,
  addRouterWithVmoRouterToRaw,
  usePreventBrowserBehavior,
  // --
  useRouterStore
}
/**
 * VmoRouteRecordRaw<META extends Record<string,any>>
 * 给路由配置使用 *.pg.ts
 * VmoRouteToRaw<META extends Record<string,any>> createRouter
 * 生成的代理方法 push, replace 入参
 * VmoRouteMenuItemRaw<ITEM extend Reocrd<string,any>,META extends Record<string,any>>
 * 给菜单使用
 */
export type { RouterStore, Lazy, VmoRouteRecordRaw, VmoRouteToRaw, VmoRouteMenuItemRaw }
