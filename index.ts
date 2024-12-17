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
  usePreventBrowserBeforeunloadBehavior
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
  /**---- */
  loadPageTemplateByImport,
  validateVmoRouterToRaw,
  addRouterWithVmoRouterToRaw,
  usePreventBrowserBeforeunloadBehavior,
  /**---- */
  useRouterStore
}

export type { RouterStore, Lazy, VmoRouteRecordRaw, VmoRouteToRaw, VmoRouteMenuItemRaw }
