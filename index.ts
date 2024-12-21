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
import type { VmoProxyRouter } from '@lib/index'
import {
  loadPageTemplateByImport,
  validateVmoRouterToRaw,
  addRouterWithVmoRouterToRaw,
  usePreventBrowserBeforeunloadBehavior
} from '@lib/lib'
import { useRouterStore } from '@lib/store'
import type { RouterStore } from '@lib/store'
import type { Lazy, VmoRouteRecordRaw, VmoRouteToRaw, VmoRouteMenuItemRaw, VmoNavigationGuard } from '@type'

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

export type {
  RouterStore,
  Lazy,
  VmoRouteRecordRaw,
  VmoRouteToRaw,
  VmoRouteMenuItemRaw,
  VmoNavigationGuard,
  VmoProxyRouter
}
