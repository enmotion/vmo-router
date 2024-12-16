/*
 * @Author: enmotion
 * @Date: 2024-12-05 23:19:20
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-16 09:16:06
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
  stringifyQuery,
  NavigationGuardWithThis
} from 'vue-router'
import type { Router, RouterOptions, RouteRecordNameGeneric, RouteRecordRaw, NavigationFailure } from 'vue-router'
import { VmoRouteToRaw } from '@type'
import { addRouterWithVmoRouterToRaw } from './lib'

export type Methods<META extends Record<string, any>> = {
  beforeEach: (guard: NavigationGuardWithThis<Router>) => void
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
 * 1. 传递 option 配置 创建一个vue-router的实例
 * 2. 重载所有路由？？
 * 3. 返回 vue-router 实例的代理对象，通过代理劫持部分需要重置的方法
 * @param options // 路由表
 * @param template // 模版池对象
 * @param reloadRouters // 需要重载的路由数据
 * @returns {Router & { $instance: Router }} // 返回代理对象
 */
function createRouter<META extends Record<string, any>>(
  options: RouterOptions,
  template: Record<string, RouteRecordRaw>,
  reloadRouters: VmoRouteToRaw<META>[]
) {
  const _router: Router = VueRouter.createRouter(options)
  reloadRoutes(reloadRouters)
  /**
   * 劫持路由守卫的创建过程
   * @param guard 用户自定义的路由守卫方法
   */
  function beforeEach(guard: NavigationGuardWithThis<Router>) {
    const newguard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
      //... 劫持守卫的方法内容可以写在这里
      console.log(to.path)
      return guard.bind(_router)(to, from, next)
    }
    _router.beforeEach(newguard)
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
      if (!!to.name && !_router.hasRoute(to.name)) {
        addRouter(to).then(() => {
          _router[method](to)
        })
      } else {
        console.log(to)
        _router[method](to)
      }
    } catch (err) {
      console.error(err)
      _router[method](to)
    }
  }
  /**
   * 劫持 addRouter 方法
   * @param to 需要动态新增的路由配置
   * @returns
   */
  async function addRouter(to: VmoRouteToRaw<META>) {
    try {
      return addRouterWithVmoRouterToRaw(to, template, _router)
    } catch (err) {
      console.error(err)
      return false
    }
  }
  /**
   * 劫持删除路由的方法
   * @param name
   * @returns
   */
  function removeRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.removeRoute(name)
  }
  /**
   * 重载所需动态路由 批量操作
   * @param reloads
   */
  function reloadRoutes(reloads: VmoRouteToRaw<META>[]) {
    reloads
      .sort(a => {
        return a.template?.parent ? 1 : -1 // 先操作没有父路由的，再操作需要父路由的路由
      })
      .forEach(async item => {
        await addRouter(item)
      })
  }

  function generateRousteByTreeData() {}
  function clearRoutes() {}

  // 重注册属性或方法映射
  const _registration: Methods<META> = {
    beforeEach,
    push,
    replace,
    addRouter,
    removeRoute,
    reloadRoutes,
    clearRoutes,
    generateRousteByTreeData
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
