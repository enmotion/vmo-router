/*
 * @Author: enmotion
 * @Date: 2024-12-05 23:19:20
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-12 17:31:30
 */
import * as VueRouter from 'vue-router'
import {
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
} from 'vue-router'
import type { Router, RouterOptions, RouteRecordNameGeneric, RouteRecordRaw, NavigationFailure } from 'vue-router'
import { VmoRouteToRaw } from '@type'
import { allowCreateRouteRecordRawByTemplate, createRouteRecordRawByTemplate } from './lib'
import { type RouterStore } from './store'

export type Methods<META extends Record<string, any>> = {
  hasRoute: (name: NonNullable<RouteRecordNameGeneric>) => boolean
  addRouter: (to: VmoRouteToRaw<META>, autoAddToRouter: boolean) => Promise<boolean>
  push: (to: VmoRouteToRaw<META>, autoAddToRouter: boolean) => Promise<NavigationFailure | void | undefined>
  replace: (to: VmoRouteToRaw<META>, autoAddToRouter: boolean) => Promise<NavigationFailure | void | undefined>
  removeRoute: (name: NonNullable<RouteRecordNameGeneric>) => void
  reloadRoutes: (reloads: VmoRouteToRaw<META>[]) => void
  clearRoutes: () => void
  generateRousteByTreeData: () => void
}
/**
 * 重新定义返回的 Router 实例的类型
 * @returns
 */
function useRouter<META extends Record<string, any>>(): Router & { $instance: Router } & Methods<META> {
  return VueRouter.useRouter() as Router & { $instance: Router } & Methods<META>
}
/**
 * 构建劫持代理方法
 * @param options // 路由表
 * @param template // 模版池对象
 * @returns {Router & { $instance: Router }} // 返回代理对象
 */
function createRouter<META extends Record<string, any>>(
  options: RouterOptions,
  template: Record<string, RouteRecordRaw>,
  reloadRouters: VmoRouteToRaw<META>[]
) {
  const _router: Router = VueRouter.createRouter(options)
  reloadRouters
    .filter(r => {
      return !r.template?.parent
    })
    .forEach(async item => {
      await addRouter(item)
    })
  reloadRouters
    .filter(r => {
      return !!r.template?.parent
    })
    .forEach(async item => {
      await addRouter(item)
    })

  // 重注册属性或方法映射
  const _registration: Methods<META> = {
    hasRoute,
    addRouter,
    push,
    replace,
    removeRoute,
    reloadRoutes,
    clearRoutes,
    generateRousteByTreeData
  }
  /* 重注册方法 */
  function hasRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.hasRoute(name)
  }
  async function addRouter(to: VmoRouteToRaw<META>) {
    try {
      const raw = createRouteRecordRawByTemplate(to, template, _router)
      if (!!raw) {
        if (raw?.parent) {
          _router.addRoute(raw?.parent, raw?.routerRaw as VueRouter.RouteRecordRaw)
        } else {
          _router.addRoute(raw?.routerRaw as VueRouter.RouteRecordRaw)
        }
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error(err)
      return false
    }
  }
  // function addRouter(parentName: NonNullable<RouteRecordNameGeneric>, route: RouteRecordRaw) {
  //   return _router.addRoute(parentName, route)
  // }
  /**
   * 劫持 push 方法
   * @param to 目标路由
   * @param autoAddToRouter 是否自动装载
   * @returns
   */
  async function push(to: VmoRouteToRaw<META>, autoAddToRouter: boolean = true) {
    try {
      return _handleRouteNavigation('push', to, autoAddToRouter)
    } catch (err) {
      console.error(err)
    }
  }
  /**
   * 劫持 replace 方法
   * @param to 目标路由
   * @param autoAddToRouter 是否自动装载
   * @returns
   */
  async function replace(to: VmoRouteToRaw<META>, autoAddToRouter: boolean = true) {
    try {
      return _handleRouteNavigation('replace', to, autoAddToRouter)
    } catch (err) {
      console.error(err)
    }
  }
  function removeRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.removeRoute(name)
  }

  function generateRousteByTreeData() {}
  function reloadRoutes(reloads: VmoRouteToRaw<META>[]) {
    reloads.forEach(router => {})
  }
  function clearRoutes() {}

  /**
   * 私有导航跳转处理函数,优化push 与 replace 的结构
   * @param method
   * @param to
   * @param autoAddToRouter
   * @returns
   */
  async function _handleRouteNavigation(
    method: 'push' | 'replace',
    to: VmoRouteToRaw<META>,
    autoAddToRouter: boolean = true
  ) {
    try {
      if (!!to.name && !_router.hasRoute(to.name)) {
        if (allowCreateRouteRecordRawByTemplate(to, template)) {
          addRouter(to)
          return _router[method](to)
        }
      } else {
        return _router[method](to)
      }
    } catch (err) {
      console.error(err)
      return _router[method](to)
    }
  }

  return new Proxy(_router, {
    get(target, prop, receiver) {
      if (!_registration?.[prop as keyof Methods<META>]) {
        /* 如果当前 属性或方法未被重注册，则返回 实例或者实例方法 */
        return prop == '$instance' ? target : Reflect.get(target, prop, receiver)
      } else {
        /* 返回当前注册对象 */
        return _registration[prop as keyof Methods<META>]
      }
    }
  }) as Router & { $instance: Router } & Methods<META>
}
// 动态导出所有属性和方法
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
  stringifyQuery
}
