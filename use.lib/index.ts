/*
 * @Author: enmotion
 * @Date: 2024-12-05 23:19:20
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-06 18:26:19
 */
import * as VueRouter from 'vue-router'
import type {
  Router,
  RouterOptions,
  RouteRecordNameGeneric,
  RouteRecordRaw,
  RouteLocationRaw,
  NavigationFailure
} from 'vue-router'

export type Methods<T> = {
  hasRoute: (name: NonNullable<RouteRecordNameGeneric>) => boolean
  addRouter: (parentName: NonNullable<RouteRecordNameGeneric>, route: RouteRecordRaw) => void
  push: (to: RouteLocationRaw) => Promise<NavigationFailure | void | undefined>
  replace: (to: RouteLocationRaw) => Promise<NavigationFailure | void | undefined>
  removeRoute: (name: NonNullable<RouteRecordNameGeneric>) => void
  reloadRoutes: () => void
  clearRoutes: () => void
  generateRousteByTreeData: () => void
}

/**
 * 构建代理
 * @param options // 路由表
 * @returns {Router & { $instance: Router }} // 返回代理对象
 */
export function createRouter(options: RouterOptions) {
  const _router: Router = VueRouter.createRouter(options)
  // 重注册属性或方法映射
  const _registration: Methods<Record<string, any>> = {
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
  function addRouter(parentName: NonNullable<RouteRecordNameGeneric>, route: RouteRecordRaw) {
    return _router.addRoute(parentName, route)
  }
  function push(to: RouteLocationRaw) {
    return _router.push(to)
  }
  function replace(to: RouteLocationRaw) {
    return _router.replace(to)
  }
  function removeRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.removeRoute(name)
  }

  function generateRousteByTreeData() {}
  function reloadRoutes() {}
  function clearRoutes() {}

  return new Proxy(_router, {
    get(target, prop, receiver) {
      if (!_registration?.[prop as keyof Methods<{}>]) {
        /* 如果当前 属性或方法未被重注册，则返回 实例或者实例方法 */
        return prop == '$instance' ? target : Reflect.get(target, prop, receiver)
      } else {
        /* 返回当前注册对象 */
        return _registration[prop as keyof Methods<{}>]
      }
    }
  }) as Router & { $instance: Router }
}
