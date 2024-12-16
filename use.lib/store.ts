/*
 * @Author: enmotion
 * @Date: 2023-11-09 10:36:24
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-16 09:09:30
 * 路由全局状态管理器, 基于 pinia 实现
 */
import { pluck, mergeDeepRight, mergeAll } from 'ramda'
import { defineStore, StoreDefinition } from 'pinia'
import type { VmoRouteToRaw } from '../types/index'

export namespace RouterStore {
  export type CacherMethods<M extends Record<string, any>> = {
    setCacheRouters: (router: VmoRouteToRaw<M>[]) => void
    getCacheRouters: () => VmoRouteToRaw<M>[]
  }
  export interface State<M extends Record<string, any>> {
    navigationDisabled: boolean
    mutipleCatch: boolean // 缓存模式 为ture 时，会缓存所有的路由表，false 只缓存当前路由，此设置可配合 token 机制，做到浏览器开启新标签是否能打开用户获得授权的任意页面，或直接地址跳转；
    dynamicRoutes: VmoRouteToRaw<M>[] // 动态添加路由加载表，作为缓存避免页面刷新时丢失
    keepAliveNames: string[] // 缓存路由表, 此表只在内存中存在，刷新后会丢弃
    keepAliveMax?: number
  }
}

export function useRouterStore<M extends Record<string, any>>(
  option?: Partial<{
    cacherMethods: RouterStore.CacherMethods<M>
    mutipleCatch?: boolean
    keepAliveName: string[]
    keepAliveMax: number
  }>
) {
  return defineStore('router', {
    state: (): RouterStore.State<M> =>
      mergeAll([
        {
          navigationDisabled: false,
          mutipleCatch: option?.mutipleCatch ?? true,
          dynamicRoutes: option?.cacherMethods?.getCacheRouters?.() ?? [],
          keepAliveNames: [],
          keepAliveMax: 100
        },
        option ?? {}
      ]),
    getters: {
      getNavigationDisabled: state => state.navigationDisabled,
      getMutipleCatch: state => state.mutipleCatch,
      getDynamicRoutes: state => state.dynamicRoutes,
      getKeepAliveNames: state => state.keepAliveNames,
      getKeepAliveMax: state => state.keepAliveMax
    },
    actions: {
      setKeepAliveNames(name:string){
        this.keepAliveNames= Array.from(new Set([...this.keepAliveNames,name]));
      },
      removeKeepAliveNames(name:string){
        this.keepAliveNames= this.keepAliveNames.filter(item=>item!=name)
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
       * 设置路由缓存最模式， 单页，
       * @param mutipleCatch 是否开启
       * @returns {void}
       */
      setMutipleCatch(mutipleCatch: boolean) {
        this.mutipleCatch = mutipleCatch
      },
      /**
       * 设置路由缓存最大数
       * @param max 缓存最大数
       * @returns {void}
       */
      setKeepAliveMax(max: number = 0) {
        this.keepAliveMax = max
      },
      /**
       * 添加动态路由表记录
       * @param max 缓存最大数
       * @returns {void}
       */
      insertDynamicRoutes(route: VmoRouteToRaw<M>) {
        // 加塞动态路由时，会将路由添加入动态路由表，加载方式分为多路由方式与单个模式，主要用于应对用户刷新页面后，路由是否需要多页面加载或是只加载当前路由情况，此设置会影响路由的内存情况，在微应用的情况下，可以考虑用单例情况
        const routes = !this.mutipleCatch
          ? [route]
          : !pluck('name', this.dynamicRoutes).includes(route.name)
          ? Array.from(new Set(this.dynamicRoutes).add(route as Record<string, any>))
          : this.dynamicRoutes
        this.dynamicRoutes = /*store.$data.dynamicRoutes = */ routes as Record<string, any>[]
        // 更新缓存
      },
      /**
       * 移除动态路由表记录
       * @param max 缓存最大数
       * @returns {void}
       */
      removeDynamicRoutes(route: VmoRouteToRaw<M>) {
        const index = pluck('name', this.dynamicRoutes).indexOf((route.name || route) as string)
        this.dynamicRoutes = index < 0 ? this.dynamicRoutes : this.dynamicRoutes.slice(index, 1)
        // store.$data.dynamicRoutes = this.dynamicRoutes
        this.removeKeepAlivePage((route.name || route) as string) // 移除路由中的缓存
        // 更新缓存
      },
      /**
       * 清除所有动态缓存路由表
       * @param max 缓存最大数
       * @returns {void}
       */
      clearDynamicRouters() {
        this.dynamicRoutes = /*store.$data.dynamicRoutes = */ []
      },
      /**
       * 添加缓存页面
       * @param name //页面名称
       * @requires void
       */
      insertKeepAlivePage(name: string) {
        this.keepAliveNames = Array.from(new Set(this.keepAliveNames).add(name))
      },
      /**
       * 移除缓存页面
       * @param name //页面名称
       * @requires void
       */
      removeKeepAlivePage(name: string) {
        this.keepAliveNames.includes(name) && this.keepAliveNames.splice(this.keepAliveNames.indexOf(name), 1)
      }
    }
  })()
}
