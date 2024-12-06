/*
 * @Author: enmotion
 * @Date: 2024-12-05 23:19:20
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-06 16:51:10
 */
import * as VueRouter from 'vue-router'
import type { Router, RouterOptions, RouteRecordNameGeneric } from 'vue-router'

/**
 * 构建代理
 * @param options // 路由表
 * @returns {Router & { $instance: Router }} // 返回代理对象
 */
export function createRouter(options: RouterOptions) {
  const _router: Router = VueRouter.createRouter(options)
  // 重注册属性或方法映射
  const _registration: Record<string, any> = {
    hasRoute,
    removeRoute
  }
  /* 重注册方法 */
  function hasRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.hasRoute(name)
  }
  function removeRoute(name: NonNullable<RouteRecordNameGeneric>) {
    return _router.removeRoute(name)
  }
  return new Proxy(_router, {
    get(target, prop, receiver) {
      if (!_registration?.[prop as string]) {
        /* 如果当前 属性或方法未被重注册，则返回 实例或者实例方法 */
        return prop == '$instance' ? target : Reflect.get(target, prop, receiver)
      } else {
        /* 返回当前注册对象 */
        return _registration[prop as string]
      }
    }
  }) as Router & { $instance: Router }
}
