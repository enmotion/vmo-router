/*
 * @Author: enmotion
 * @Date: 2024-12-05 23:19:20
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-20 13:15:36
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
import type { Router, RouterOptions, RouteRecordRaw, NavigationFailure } from 'vue-router'
import { VmoRouteToRaw } from '@type'
import { addRouterWithVmoRouterToRaw } from './lib'
import type { RouterStore } from './store'

export type ProxyVueRouterMethods<META extends Record<string, any>> = {
  beforeEach: (guard: NavigationGuardWithThis<Router>) => void
  addRouter: (to: VmoRouteToRaw<META>) => void
  push: (to: VmoRouteToRaw<META>) => NavigationFailure | void | undefined
  replace: (to: VmoRouteToRaw<META>) => NavigationFailure | void | undefined
  removeRoute: (name: string) => void
  reloadRoutes: (reloads: VmoRouteToRaw<META>[], needClear?: boolean) => void
  clearRoutes: (all?: boolean) => void
}
/**
 * 重新定义返回的 Router 实例的类型
 * @returns
 */
function useRouter<META extends Record<string, any>>(): Router & { $instance: Router } & ProxyVueRouterMethods<META> {
  return VueRouter.useRouter() as Router & { $instance: Router } & ProxyVueRouterMethods<META>
}

/**
 * 构建劫持代理方法
 * 1. 传递 option 配置 创建一个vue-router的实例
 * 2. 重载所有路由？？
 * 3. 返回 vue-router 实例的代理对象，通过代理劫持部分需要重置的方法
 * @param options // 路由表
 * @param template // 模版池对象
 * @param store // 挂载的缓存
 * @returns {Router & { $instance: Router }} // 返回代理对象
 */
function createRouter<META extends Record<string, any>>(
  options: RouterOptions,
  template: Record<string, RouteRecordRaw>,
  store?: RouterStore.PiniaStore<VmoRouteToRaw<META>>
) {
  const _router: Router = VueRouter.createRouter(options)
  reloadRoutes((store?.getCachedRoutes ?? []) as VmoRouteToRaw<META>[])
  /**
   * 劫持路由守卫的创建过程
   * @param guard 用户自定义的路由守卫方法
   */
  async function beforeEach(guard: NavigationGuardWithThis<Router>) {
    const wrapGuard: NavigationGuardWithThis<undefined> = async (to, from, next) => {
      //... 劫持守卫的方法内容可以写在这里
      try {
        if (store?.getRouteToLeaveDisabled) {
          const confirmed = store?.confirmToLeaveMethod && (await store?.confirmToLeaveMethod(from.meta as META))
          store.setRouteToLeaveDisabled(false)
          return confirmed ? guard.bind(_router)(to, from, next) : next(false)
        } else {
          return guard.bind(_router)(to, from, next)
        }
      } catch (err) {
        next(false)
      }
    }
    _router.beforeEach(await wrapGuard)
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
          store?.insertCachedRoute(to) // 添加成功后插入路由缓存，只有非初始化时后添加的路由，才会建立动态缓存 并非keepAlive
          _router[method](to)
        })
      } else {
        // console.log(to)
        _router[method](to)
        !store?.getMutipleCatch && store?.insertCachedRoute(to) // 当路由表缓存设置为单个时, 每次跳转都需要更新当前的缓存
      }
    } catch (err) {
      console.error(err)
      _router[method](to)
      !store?.getMutipleCatch && store?.insertCachedRoute(to) // 当路由表缓存设置为单个时, 每次跳转都需要更新当前的缓存
    }
  }
  /**
   * 劫持 addRouter 方法
   * @param to 需要动态新增的路由配置
   * @returns
   */
  async function addRouter(to: VmoRouteToRaw<META>) {
    try {
      // 动态的添加路由, 该方法会通过 to 对象的设置，动态实例一个路由，并添加到路由表中
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
  function removeRoute(name: string) {
    store?.removeCachedRoute(name) // 移除路由缓存表，并非keepAlive
    return _router.hasRoute(name as string) && _router.removeRoute(name as string) // 从路由中移除
  }
  /**
   * 重载所需动态路由 批量操作
   * @param reloads
   */
  async function reloadRoutes(reloads: VmoRouteToRaw<META>[]) {
    try {
      // 先操作没有父路由的，再操作需要父路由的路由
      const sortedReloads = reloads.sort((a, b) => (a.template?.parent ? 1 : -1) - (b.template?.parent ? 1 : -1))
      clearRoutes()
      // 使用 Promise.all 并行处理路由加载
      return Promise.all(sortedReloads.map(item => addRouter(item)))
        .then(res => {
          // 添加路由成功后，需要逐一将路由表添入缓存路由状态管理器中
          sortedReloads.forEach(item => store?.insertCachedRoute(item))
          console.log('All routes reloaded successfully')
        })
        .catch(err => {
          console.error('Error reloading routes:', err)
          throw err
        })
    } catch (err) {
      console.error('Error in reloadRoutes:', err)
      throw err
    }
  }

  function clearRoutes(all: boolean = false) {
    if (all) {
      _router.clearRoutes() // 如果是全面清除，则会直接清空所有的路由缓存
    } else {
      store?.getCachedRoutes?.forEach?.(to => {
        to.name && removeRoute(to.name as string)
      })
    }
  }

  // 重注册属性或方法映射
  const _registration: ProxyVueRouterMethods<META> = {
    beforeEach,
    push,
    replace,
    addRouter,
    removeRoute,
    reloadRoutes,
    clearRoutes
  }
  return new Proxy(_router, {
    get(target, prop, receiver) {
      if (!_registration?.[prop as keyof ProxyVueRouterMethods<META>]) {
        /* 如果当前 属性或方法未被重注册，则返回 实例或者实例方法 */
        return prop == '$instance' ? target : Reflect.get(target, prop, receiver)
      } else {
        /* 返回当前注册对象 */
        return _registration[prop as keyof ProxyVueRouterMethods<META>]
      }
    }
  }) as Omit<Router, 'addRouter' | 'removeRoute' | 'clearRoutes'> & { $instance: Router } & ProxyVueRouterMethods<META>
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
