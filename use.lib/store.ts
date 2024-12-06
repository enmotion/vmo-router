/*
 * @Author: enmotion
 * @Date: 2023-11-09 10:36:24
 * @Last Modified by: enmotion
 * @Last Modified time: 2024-12-06 16:19:53
 * 路由全局状态管理器, 基于 pinia 实现
 */
import { pluck, mergeDeepRight } from 'ramda'
// import baseRouteInstance from "@src/router"; // 工程路由
// import store from '@src/stores/browserStorage' // 本地持久缓存器
import { defineStore } from 'pinia'
import type { VmoxRouteLocationNamedRaw } from '../types/index'
/**
 * 路由缓存数据类型定义
 * @param dynamicRoutes 动态添加到路由里的配置数据；
 * @param keepAlivePage 需要缓存的内存路由名称
 * @param mutipleCatch 缓存模式 为ture 时，会缓存所有的路由表，false 只缓存当前路由，此设置可配合 token机制，做到浏览器开启新标签是否能打开用户获得授权的任意页面，或直接地址跳转；
 */

export namespace RouterStore {
  export type RouteList = VmoxRouteLocationNamedRaw[]
  export interface State {
    preventNavigation: boolean
    preventDialogContent: { title: string; message: string }
    mutipleCatch: boolean // 缓存模式 为ture 时，会缓存所有的路由表，false 只缓存当前路由，此设置可配合 token机制，做到浏览器开启新标签是否能打开用户获得授权的任意页面，或直接地址跳转；
    dynamicRoutes: RouteList // 动态添加路由加载表，作为缓存避免页面刷新时丢失
    keepAlivePage: string[] // 缓存路由表, 此表只在内存中存在，刷新后会丢弃
    keepAliveMax?: number
  }
}

export const useRouterStateStore = defineStore('router', {
  state: (): RouterStore.State => ({
    preventNavigation: false,
    preventDialogContent: {
      title: '操作警告',
      message: '存在未保存的数据，是否坚持离开？'
    },
    mutipleCatch: true,
    dynamicRoutes: /*store.$data.dynamicRoutes ||*/ [],
    keepAlivePage: ['main-pg'],
    keepAliveMax: 0
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
    insertDynamicRoutes(route: VmoxRouteLocationNamedRaw) {
      // 加塞动态路由时，会将路由添加入动态路由表，加载方式分为多路由方式与单个模式，主要用于应对用户刷新页面后，路由是否需要多页面加载或是只加载当前路由情况，此设置会影响路由的内存情况，在微应用的情况下，可以考虑用单例情况
      const routes = !this.mutipleCatch
        ? [route]
        : !pluck('name', this.dynamicRoutes).includes(route.name)
        ? Array.from(new Set(this.dynamicRoutes).add(route))
        : this.dynamicRoutes
      this.dynamicRoutes = /*store.$data.dynamicRoutes = */ routes
    },
    /**
     * 移除动态路由表记录
     * @param max 缓存最大数
     * @returns {void}
     */
    removeDynamicRoutes(route: VmoxRouteLocationNamedRaw) {
      const index = pluck('name', this.dynamicRoutes).indexOf((route.name || route) as string)
      this.dynamicRoutes = index < 0 ? this.dynamicRoutes : this.dynamicRoutes.slice(index, 1)
      // store.$data.dynamicRoutes = this.dynamicRoutes
      this.removeKeepAlivePage((route.name || route) as string) // 移除路由中的缓存
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
