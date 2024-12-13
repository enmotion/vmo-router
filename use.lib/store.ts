// /*
//  * @Author: enmotion
//  * @Date: 2023-11-09 10:36:24
//  * @Last Modified by: enmotion
//  * @Last Modified time: 2024-12-06 16:19:53
//  * 路由全局状态管理器, 基于 pinia 实现
//  */
import { pluck, mergeDeepRight } from 'ramda'
import type { Router } from 'vue-router'
import { defineStore, type StoreDefinition } from 'pinia'
import type { VmoRouteMenuItemRaw, VmoRouteToRaw } from '../types/index'
import { multiply } from 'lodash'
import { KeepAlive } from 'vue'

export namespace RouterStore {
  export type CacherMethods = {
    setCacheRouters: (router: Router, mode: 'replace' | 'insert') => void
    getCacheRouters: () => Router[]
  }
  export interface State<M extends Record<string, any>> {
    preventNavigation: boolean
    preventDialogContent: { title: string; message: string }
    mutipleCatch: boolean // 缓存模式 为ture 时，会缓存所有的路由表，false 只缓存当前路由，此设置可配合 token机制，做到浏览器开启新标签是否能打开用户获得授权的任意页面，或直接地址跳转；
    dynamicRoutes: VmoRouteToRaw<M>[] // 动态添加路由加载表，作为缓存避免页面刷新时丢失
    keepAlivePage: string[] // 缓存路由表, 此表只在内存中存在，刷新后会丢弃
    keepAliveMax?: number
  }
}
export function generateRouterStore<M extends Record<string, any>>(option: {
  cacherMethods: RouterStore.CacherMethods
  preventDialogContent: { title: string; message: string }
  mutipleCatch: boolean
}) {
  return defineStore('router', {
    state: (): RouterStore.State<M> => ({
      preventNavigation: false,
      preventDialogContent: option.preventDialogContent,
      mutipleCatch: option.mutipleCatch,
      dynamicRoutes: [],
      keepAlivePage: [],
      keepAliveMax: 100
    }),
    getters: {
      getPreventNavigation: state => state.preventNavigation,
      getPreventDialogContent: state => state.preventDialogContent,
      getMutipleCatch: state => state.mutipleCatch,
      getDynamicRoutes: state => state.dynamicRoutes,
      getKeepAlivePage: state => state.keepAlivePage,
      getKeepAliveMax: state => state.keepAliveMax
    },
    actions: {
      setPreventNavigation(preventNavigation: boolean) {
        this.preventNavigation = preventNavigation
      },
      setPreventDialogContent(preventDialogContent: Partial<{ title: string; message: string }>) {
        this.preventDialogContent = mergeDeepRight(this.preventDialogContent, preventDialogContent)
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
        this.keepAlivePage = Array.from(new Set(this.keepAlivePage).add(name))
      },

      /**
       * 移除缓存页面
       * @param name //页面名称
       * @requires void
       */
      removeKeepAlivePage(name: string) {
        this.keepAlivePage.includes(name) && this.keepAlivePage.splice(this.keepAlivePage.indexOf(name), 1)
      }
    }
  })
}
