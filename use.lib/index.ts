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
  type NavigationGuard
} from 'vue-router'
import type { Router, RouterOptions, RouteRecordRaw, NavigationFailure, RouteLocationRaw, RouteRecordName } from 'vue-router'
import type { VmoRouteToRaw, VmoNavigationGuard } from '@type'
import { addRouterWithVmoRouterToRaw } from './lib'
import type { RouterStore } from './store'

export type ProxyVueRouterMethods<META extends Record<string, any>> = {
  beforeEach: (guard: VmoNavigationGuard) => () => void
  addRouter: (to: VmoRouteToRaw<META>) => void
  push: (to: VmoRouteToRaw<META> | RouteLocationRaw) => Promise<NavigationFailure | void | undefined>
  replace: (to: VmoRouteToRaw<META> | RouteLocationRaw) => Promise<NavigationFailure | void | undefined>
  removeRoute: (name: NonNullable<RouteRecordName>) => void
  reloadRoutes: (reloads: VmoRouteToRaw<META>[], needClear?: boolean) => Promise<void>
  clearRoutes: (all?: boolean) => void
}

export type VmoProxyRouter<META extends Record<string, any>> = Omit<
  Router, keyof ProxyVueRouterMethods<META>
> & { $instance: Router } & ProxyVueRouterMethods<META>

function useRouter<META extends Record<string, any>>(): VmoProxyRouter<META> {
  return VueRouter.useRouter() as unknown as VmoProxyRouter<META>
}

function createRouter<META extends Record<string, any>>(
  options: RouterOptions,
  template: Record<string, RouteRecordRaw>,
  store?: RouterStore.PiniaStore<VmoRouteToRaw<META>>
): VmoProxyRouter<META> {
  const router = VueRouter.createRouter(options)
  // Track registrations independently of persistence (which may retain only one route).
  const dynamicRoutes = new Map<NonNullable<RouteRecordName>, VmoRouteToRaw<META>>()

  router.beforeEach(async (_to, from) => {
    if (!store?.getRouteToLeaveDisabled) return true
    try {
      return !!(await store.confirmToLeaveMethod?.(from.meta as META))
    } catch {
      return false
    }
  })
  router.afterEach((to, _from, failure) => {
    if (failure) return
    store?.setRouteToLeaveDisabled(false)
    const definition = to.name == null ? undefined : dynamicRoutes.get(to.name)
    if (definition) {
      const cached = { ...definition }
      if (Object.keys(to.params).length || definition.params) cached.params = to.params
      if (Object.keys(to.query).length || definition.query) cached.query = to.query
      if (to.hash || definition.hash) cached.hash = to.hash
      store?.insertCachedRoute(cached)
    }
  })

  function beforeEach(guard: VmoNavigationGuard): () => void {
    return router.beforeEach(guard as NavigationGuard)
  }

  async function navigate(method: 'push' | 'replace', to: VmoRouteToRaw<META> | RouteLocationRaw) {
    if (typeof to === 'object' && 'name' in to && to.name != null && !router.hasRoute(to.name)) {
      addRouter(to as VmoRouteToRaw<META>)
    }
    return router[method](to)
  }

  function addRouter(to: VmoRouteToRaw<META>): void {
    if (to.name != null && router.hasRoute(to.name)) {
      throw new Error(`VmoRouter: route name already exists: ${String(to.name)}`)
    }
    addRouterWithVmoRouterToRaw(to, template, router)
    dynamicRoutes.set(to.name!, to)
  }

  function removeRoute(name: NonNullable<RouteRecordName>): void {
    // Vue Router also removes descendants; synchronize their persistence and KeepAlive names.
    const removed = router.getRoutes().filter(record => record.name != null &&
      router.resolve({ name: record.name }).matched.some(parent => parent.name === name)
    )
    removed.forEach(record => {
      dynamicRoutes.delete(record.name!)
      store?.removeCachedRoute(record.name!)
      if (typeof record.name === 'string') store?.removeKeepAliveName(record.name)
    })
    if (router.hasRoute(name)) router.removeRoute(name)
    if (!removed.length) {
      dynamicRoutes.delete(name)
      store?.removeCachedRoute(name)
      if (typeof name === 'string') store?.removeKeepAliveName(name)
    }
  }

  function restore(reloads: VmoRouteToRaw<META>[], needClear: boolean): void {
    // Stage every record before changing live state. Resolve arbitrary parent depth.
    const staging = VueRouter.createRouter({ history: createMemoryHistory(), routes: [] })
    for (const record of router.getRoutes()) {
      if (record.name != null && (!needClear || !dynamicRoutes.has(record.name))) {
        staging.addRoute({ path: record.path, name: record.name, component: {} })
      }
    }
    const pending = [...reloads]
    const ordered: VmoRouteToRaw<META>[] = []
    while (pending.length) {
      const index = pending.findIndex(item => !item.template?.parent || staging.hasRoute(item.template.parent))
      if (index < 0) throw new Error('VmoRouter: missing or circular parent route')
      const [item] = pending.splice(index, 1)
      if (item.name != null && staging.hasRoute(item.name)) {
        throw new Error(`VmoRouter: route name already exists: ${String(item.name)}`)
      }
      addRouterWithVmoRouterToRaw(item, template, staging)
      ordered.push(item)
    }
    if (needClear) clearRoutes()
    ordered.forEach(item => {
      addRouter(item)
      store?.insertCachedRoute(item)
    })
  }

  async function reloadRoutes(reloads: VmoRouteToRaw<META>[], needClear = true): Promise<void> {
    restore(reloads, needClear)
  }

  function clearRoutes(all = false): void {
    if (all) {
      router.clearRoutes()
      dynamicRoutes.clear()
      store?.clearDynamicRouters()
      store?.setKeepAliveName([])
    } else {
      [...dynamicRoutes.keys()].forEach(removeRoute)
    }
  }

  // Restore synchronously so initial navigation sees the complete route tree.
  restore([...(store?.getCachedRoutes ?? [])] as VmoRouteToRaw<META>[], false)
  const methods: ProxyVueRouterMethods<META> = {
    beforeEach, push: to => navigate('push', to), replace: to => navigate('replace', to),
    addRouter, removeRoute, reloadRoutes, clearRoutes
  }
  return new Proxy(router, {
    get(target, prop, receiver) {
      if (prop === '$instance') return target
      if (Object.prototype.hasOwnProperty.call(methods, prop)) return methods[prop as keyof typeof methods]
      return Reflect.get(target, prop, receiver)
    }
  }) as unknown as VmoProxyRouter<META>
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
