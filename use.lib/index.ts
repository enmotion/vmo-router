/*
 * @Author: enmotion
 * @Date: 2024-12-05 23:19:20
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-06 16:26:44
 */
import * as VueRouter from 'vue-router'
import type { Router, RouterOptions, RouteRecordNameGeneric } from 'vue-router'

/**
 * 构建代理
 * @param options
 * @returns
 */
export function createRouter(options: RouterOptions) {
  const _router: Router = VueRouter.createRouter(options)
  // 注册需要被代理的方法
  const _registrationMethod: Record<string, any> = {
    hasRoute,
    removeRoute
  }
  function hasRoute(name: NonNullable<RouteRecordNameGeneric>) {
    console.log(name)
    return _router.hasRoute(name)
  }
  function removeRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.removeRoute(name)
  }
  return new Proxy(_router, {
    get(target, prop, receiver) {
      if (prop == '$instance') {
        return target
      }
      if (!_registrationMethod?.[prop as string]) {
        return Reflect.get(target, prop, receiver)
      } else {
        return _registrationMethod[prop as string]
      }
    }
  }) as Router & { $instance: Router }
}
