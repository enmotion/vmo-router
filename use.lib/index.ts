/*
 * @Author: enmotion
 * @Date: 2024-12-05 23:19:20
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-12 17:31:30
 */
import * as VueRouter from 'vue-router'
import { omit } from 'ramda'
import type { Router, RouterOptions, RouteRecordNameGeneric, RouteRecordRaw, NavigationFailure } from 'vue-router'
import { VmoRouteToRaw } from '@type'
import { allowCreateRouteRecordRawByTemplate, createRouteRecordRawByTemplate } from './lib'

export type Methods<META extends Record<string, any>> = {
  hasRoute: (name: NonNullable<RouteRecordNameGeneric>) => boolean
  addRouter: (parentName: NonNullable<RouteRecordNameGeneric>, route: RouteRecordRaw) => void
  push: (to: VmoRouteToRaw<META>, autoAddToRouter: boolean) => Promise<NavigationFailure | void | undefined>
  replace: (to: VmoRouteToRaw<META>) => Promise<NavigationFailure | void | undefined>
  removeRoute: (name: NonNullable<RouteRecordNameGeneric>) => void
  reloadRoutes: () => void
  clearRoutes: () => void
  generateRousteByTreeData: () => void
}

export function useRouter<META extends Record<string, any>>() {
  return VueRouter.useRouter() as Router & { $instance: Router } & Methods<META>
}
/**
 * 构建代理
 * @param options // 路由表
 * @param template // 模版池对象
 * @returns {Router & { $instance: Router }} // 返回代理对象
 */
export function createRouter<META extends Record<string, any>>(
  options: RouterOptions,
  template: Record<string, RouteRecordRaw>,
  routeStore: any
) {
  const _router: Router = VueRouter.createRouter(options)
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
  function addRouter(parentName: NonNullable<RouteRecordNameGeneric>, route: RouteRecordRaw) {
    return _router.addRoute(parentName, route)
  }
  /**
   * 劫持 push 方法
   * @param to 目标路由
   * @param autoAddToRouter 是否自动装载
   * @returns
   */
  async function push(to: VmoRouteToRaw<META>, autoAddToRouter: boolean = true) {
    console.log('aaaa')
    try {
      if (!!to.name && !_router.hasRoute(to.name)) {
        if (allowCreateRouteRecordRawByTemplate(to, template)) {
          await createRouteRecordRawByTemplate(to, autoAddToRouter, template, _router)
          return await _router.push(to)
        }
      } else {
        return await _router.push(to)
      }
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
      if (!!to.name && !_router.hasRoute(to.name)) {
        if (allowCreateRouteRecordRawByTemplate(to, template)) {
          await createRouteRecordRawByTemplate(to, autoAddToRouter, template, _router)
          return await _router.replace(to)
        }
      } else {
        return await _router.replace(to)
      }
    } catch (err) {
      console.error(err)
    }
  }
  function removeRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.removeRoute(name)
  }

  function generateRousteByTreeData() {}
  function reloadRoutes() {}
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
