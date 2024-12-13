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
import { addRouterWithVmoRouterToRaw } from './lib'

export type Methods<META extends Record<string, any>> = {
  hasRoute: (name: NonNullable<RouteRecordNameGeneric>) => boolean
  addRouter: (to: VmoRouteToRaw<META>) => void
  push: (to: VmoRouteToRaw<META>) => NavigationFailure | void | undefined
  replace: (to: VmoRouteToRaw<META>) => NavigationFailure | void | undefined
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
  reloadRoutes(reloadRouters)
  console.log('sss')
  // 重注册属性或方法映射
  const _registration: Methods<META> = {
    push,
    replace,
    hasRoute,
    addRouter,
    removeRoute,
    reloadRoutes,
    clearRoutes,
    generateRousteByTreeData
  }
  /**
   * 劫持 push 方法
   * @param to 目标路由
   * @returns
   */
  function push(to: VmoRouteToRaw<META>) {
    try {
      _handleRouteNavigation('push', to)
    } catch (err) {
      console.error(err)
    }
  }
  /**
   * 劫持 replace 方法
   * @param to 目标路由
   * @returns
   */
  function replace(to: VmoRouteToRaw<META>) {
    try {
      _handleRouteNavigation('replace', to)
    } catch (err) {
      console.error(err)
    }
  }
  /**
   * 私有导航跳转处理函数,更改 push 与 replace 处理逻辑
   * @param method
   * @param to
   * @param autoAddToRouter
   * @returns
   */
  function _handleRouteNavigation(method: 'push' | 'replace', to: VmoRouteToRaw<META>) {
    try {
      // name 存在，且当前路由中没有此路由的情况，则会进行路由加载, 等待成功后，再进行跳转
      if (!!to.name && !hasRoute(to.name)) {
        addRouter(to).then(() => {
          _router[method](to)
        })
      } else {
        _router[method](to)
      }
    } catch (err) {
      console.error(err)
      _router[method](to)
    }
  }
  /* 重注册方法 */
  function hasRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.hasRoute(name)
  }
  async function addRouter(to: VmoRouteToRaw<META>) {
    try {
      await addRouterWithVmoRouterToRaw(to, template, _router)
    } catch (err) {
      console.error(err)
      return false
    }
  }
  function removeRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.removeRoute(name)
  }
  function generateRousteByTreeData() {}
  function reloadRoutes(reloads: VmoRouteToRaw<META>[]) {
    reloads
      .sort(a => {
        return a.template?.parent ? 1 : -1
      })
      .forEach(async item => {
        await addRouter(item)
      })
  }
  function clearRoutes() {}

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
