/*
 * @Author: enmotion
 * @Date: 2023-11-09 10:36:24
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-18 10:07:46
 * 路由全局状态管理器, 基于 pinia 实现
 */
import { pluck } from 'ramda'
import { defineStore } from 'pinia'
import type { VmoRouteToRaw } from '@type'

export namespace RouterStore {
  export type CacherMethods<RouteToRaw extends Record<string, any>> = {
    setter: (route: RouteToRaw[]) => void
    getter: () => RouteToRaw[]
  }
  export type ExtractRouteInfoType<T> = T extends VmoRouteToRaw<infer M> ? M : never
  export interface State<RouteToRaw extends VmoRouteToRaw<Record<string, any>>> {
    confirmToLeaveMethod?: (meta: RouterStore.ExtractRouteInfoType<RouteToRaw>) => Promise<boolean> | boolean
    cacheMethods?: CacherMethods<RouteToRaw> // 路由缓存的方法
    browserBeforeunloadDisabled: boolean // 浏览器关闭刷行行为是否触发弹窗
    routeToLeaveDisabled: boolean // 是否阻止路由跳转
    mutipleCatch: boolean // 缓存模式 为ture 时，会缓存所有的路由表，false 只缓存当前路由，此设置可配合 token 机制，做到浏览器开启新标签是否能打开用户获得授权的任意页面，或直接地址跳转；
    cachedRoutes: RouteToRaw[] // 动态添加路由加载表，作为缓存避免页面刷新时丢失
    keepAliveRouteNames: string[] // 缓存路由表, 此表只在内存中存在，刷新后会丢弃
    keepAliveMax?: number
  }
  export type PiniaStore<RouteToRaw extends Record<string, any>> = ReturnType<typeof useRouterStore<RouteToRaw>>
}

export function useRouterStore<RouteToRaw extends Record<string, any>>() {
  return defineStore('router', {
    state: (): RouterStore.State<RouteToRaw> => ({
      confirmToLeaveMethod: async meta => {
        console.log('confirmToLeaveMethod:', meta)
        return true
      },
      cachedRoutes: [],
      keepAliveRouteNames: [],
      mutipleCatch: true,
      routeToLeaveDisabled: false,
      browserBeforeunloadDisabled: false
    }),
    getters: {
      getCachedRoutes: state => state.cacheMethods?.getter() ?? state.cachedRoutes,
      getKeepAliveRouteNames: state => state.keepAliveRouteNames,
      getMutipleCatch: state => state.mutipleCatch,
      getBrowserBeforeunloadDisabled: state => state.browserBeforeunloadDisabled,
      getRouteToLeaveDisabled: state => state.routeToLeaveDisabled,
      getKeepAliveMax: state => state.keepAliveMax,
      getCacheMethod: state => state.cacheMethods,
      getPreventNavigationMethod: state => state.confirmToLeaveMethod
    },
    actions: {
      /**
       * 添加路由至路由表缓存
       * @param to
       */
      insertCachedRoute(to: RouteToRaw) {
        ;(this.cachedRoutes as RouteToRaw[]) = this.cacheMethods?.getter() ?? []
        if (!pluck('name', this.cachedRoutes).includes(to.name)) {
          this.mutipleCatch
            ? (this.cachedRoutes as RouteToRaw[]).push(to as RouteToRaw)
            : ((this.cachedRoutes as RouteToRaw[]) = [to])
          this.cacheMethods?.setter(this.cachedRoutes as RouteToRaw[])
        }
      },
      /**
       * 移除路由表缓存
       * @param name
       */
      removeCachedRoute(name: string) {
        ;(this.cachedRoutes as RouteToRaw[]) = this.cacheMethods?.getter() ?? []
        this.cachedRoutes = this.cachedRoutes.filter(route => route.name != name)
        this.cacheMethods?.setter(this.cachedRoutes as RouteToRaw[])
        // 调用持久化方法
      },
      /**
       * 添加 keepAlive 缓存名
       * @param name
       */
      insertKeepAliveNames(name: string) {
        try {
          this.keepAliveRouteNames = Array.from(new Set([...this.keepAliveRouteNames, name]))
          this.keepAliveRouteNames = !this.keepAliveMax
            ? this.keepAliveRouteNames
            : this.keepAliveRouteNames.slice(-this.keepAliveMax)
        } catch (err) {
          throw err
        }
      },
      /**
       * 移除 keepAlive 缓存名
       * @param name
       */
      removeKeepAliveNames(name: string) {
        this.keepAliveRouteNames = this.keepAliveRouteNames.filter(item => item != name)
      },
      /**
       * 设置路由缓存最模式， 单页，
       * @param mutipleCatch 是否开启
       * @returns {void}
       */
      setMutipleCatch(mutipleCatch: boolean) {
        this.mutipleCatch = mutipleCatch
      },
      /**
       * 设置是否离开页面提示
       * @param browserBeforeunloadDisabled 是否禁止浏览器默认刷新，返回，导致离开页面的行为
       * @returns {void}
       */
      setBrowserBeforeunloadDisabled(browserBeforeunloadDisabled: boolean) {
        this.browserBeforeunloadDisabled = browserBeforeunloadDisabled
      },
      /**
       * 设置触发路由离开提示
       * @param routeToLeaveDisabled 设置触发路由离开是否提示
       * @returns {void}
       */
      setRouteToLeaveDisabled(routeToLeaveDisabled: boolean) {
        this.routeToLeaveDisabled = routeToLeaveDisabled
      },
      /**
       * 设置路由缓存最大数
       * @param max 缓存最大数
       * @returns {void}
       */
      setKeepAliveMax(max: number = 0) {
        this.keepAliveMax = Math.abs(Math.round(max))
      },
      /**
       * 清除所有动态缓存路由表
       * @param max 缓存最大数
       * @returns {void}
       */
      clearDynamicRouters() {
        this.cachedRoutes = []
        this.cacheMethods?.setter(this.cachedRoutes as RouteToRaw[])
      },
      /**
       * 设置缓存所需方法
       * @param methods
       */
      setCacheMethods(methods: RouterStore.CacherMethods<RouteToRaw>) {
        this.cacheMethods = methods
      },
      /**
       * 设置跳转阻拦器方法
       * @param method
       */
      setConfirmToLeaveMethod(
        method: (meta: RouterStore.ExtractRouteInfoType<RouteToRaw>) => Promise<boolean> | boolean
      ) {
        this.confirmToLeaveMethod = method
      }
    }
  })()
}
