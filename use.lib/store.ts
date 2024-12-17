/*
 * @Author: enmotion
 * @Date: 2023-11-09 10:36:24
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-16 09:09:30
 * 路由全局状态管理器, 基于 pinia 实现
 */
import { pluck } from 'ramda'
import { defineStore } from 'pinia'
import type { VmoRouteToRaw } from '../types/index'

export namespace RouterStore {
  export type CacherMethods<M extends Record<string, any>> = {
    setter: (route: VmoRouteToRaw<M>[]) => void
    getter: () => VmoRouteToRaw<M>[]
  }
  export interface State<M extends Record<string, any>> {
    cacheMethods?: CacherMethods<M> // 路由缓存的方法
    navigationDisabled: boolean // 是否阻止路由跳转
    mutipleCatch: boolean // 缓存模式 为ture 时，会缓存所有的路由表，false 只缓存当前路由，此设置可配合 token 机制，做到浏览器开启新标签是否能打开用户获得授权的任意页面，或直接地址跳转；
    cachedRoutes: VmoRouteToRaw<M>[] // 动态添加路由加载表，作为缓存避免页面刷新时丢失
    keepAliveRouteNames: string[] // 缓存路由表, 此表只在内存中存在，刷新后会丢弃
    keepAliveMax?: number
  }
  export type RouterStore<M extends Record<string, any>> = ReturnType<typeof useRouterStore<M>>
}

export function useRouterStore<M extends Record<string, any>>() {
  return defineStore('router', {
    state: (): RouterStore.State<M> => ({
      cachedRoutes: [],
      keepAliveRouteNames: [],
      mutipleCatch: true,
      navigationDisabled: false
    }),
    getters: {
      getCachedRoutes: state => state.cacheMethods?.getter() ?? state.cachedRoutes,
      getKeepAliveRouteNames: state => state.keepAliveRouteNames,
      getMutipleCatch: state => state.mutipleCatch,
      getNavigationDisabled: state => state.navigationDisabled,
      getKeepAliveMax: state => state.keepAliveMax,
      getCacheMethod: state => state.cacheMethods
    },
    actions: {
      /**
       * 添加路由至路由表缓存
       * @param to
       */
      insertCachedRoute(to: VmoRouteToRaw<M>) {
        ;(this.cachedRoutes as VmoRouteToRaw<M>[]) = this.cacheMethods?.getter() ?? []
        if (!pluck('name', this.cachedRoutes).includes(to.name)) {
          this.mutipleCatch
            ? (this.cachedRoutes as VmoRouteToRaw<M>[]).push(to as VmoRouteToRaw<M>)
            : ((this.cachedRoutes as VmoRouteToRaw<M>[]) = [to])
          this.cacheMethods?.setter(this.cachedRoutes as VmoRouteToRaw<M>[])
        }
      },
      /**
       * 移除路由表缓存
       * @param name
       */
      removeCachedRoute(name: string) {
        ;(this.cachedRoutes as VmoRouteToRaw<M>[]) = this.cacheMethods?.getter() ?? []
        this.cachedRoutes = this.cachedRoutes.filter(route => route.name != name)
        this.cacheMethods?.setter(this.cachedRoutes as VmoRouteToRaw<M>[])
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
            : this.keepAliveRouteNames.slice(0, this.keepAliveMax)
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
       * @param navigationDisabled 是否禁止浏览器默认刷新，返回，导致离开页面的行为
       * @returns {void}
       */
      setNavigationDisabled(navigationDisabled: boolean) {
        this.navigationDisabled = navigationDisabled
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
        this.cacheMethods?.setter(this.cachedRoutes as VmoRouteToRaw<M>[])
      },
      setCacheMethods(methods: RouterStore.CacherMethods<M>) {
        this.cacheMethods = methods
      }
    }
  })()
}
