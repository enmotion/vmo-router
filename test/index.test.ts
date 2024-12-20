// router.test.ts
import { mergeAll } from 'ramda'
import { describe, it, expect, beforeEach as setupBeforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, useRouter } from '../use.lib/index'
import { createWebHistory } from 'vue-router'
import templatePool from '../src/pages/index'
import { useRouterStore } from '../use.lib/store'

import type { VmoRouteToRaw } from '../types'
import type { VmoExtendedRouter } from '../types'
import type { Router, RouterOptions } from 'vue-router'
// 模拟 RouterStore

// 模拟 addRouterWithVmoRouterToRaw
vi.mock('./lib', () => ({
  addRouterWithVmoRouterToRaw: vi.fn(async to => {
    // 模拟添加路由成功
    return true
  })
}))

// 模拟路由配置
const routerOptions: RouterOptions = {
  history: createWebHistory(),
  routes: [mergeAll([templatePool.MainPg, { children: [templatePool.SampleA] }])]
}

describe('createRouter', () => {
  let router: VmoExtendedRouter<Record<string, any>>
  let mockRouterStore: ReturnType<typeof useRouterStore>
  setupBeforeEach(() => {
    // 重置所有模拟函数
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockRouterStore = useRouterStore()
  })

  it('should create a router instance with proxy methods', () => {
    router = createRouter(routerOptions, templatePool, mockRouterStore)
    expect(router).toBeDefined()
    expect(router.$instance).toBeDefined()
    expect(router.beforeEach).toBeDefined()
    expect(router.push).toBeDefined()
    expect(router.replace).toBeDefined()
    expect(router.addRouter).toBeDefined()
    expect(router.removeRoute).toBeDefined()
    expect(router.reloadRoutes).toBeDefined()
    expect(router.clearRoutes).toBeDefined()
  })

  it('should correctly handle push navigation', async () => {
    router = createRouter(routerOptions, templatePool, mockRouterStore)
    const to: VmoRouteToRaw<Record<string, any>> = {
      name: 'sample-b',
      template: { pageKey: 'SampleB', route: { path: 'sampl-b' } }
    }
    // 模拟 _handleRouteNavigation
    const pushMock = vi.spyOn(router, 'push')
    await router.push(to)
    expect(pushMock).toHaveBeenCalledWith(to)
  })

  it('should correctly handle replace navigation', async () => {
    router = createRouter(routerOptions, templatePool, mockRouterStore)
    const to: VmoRouteToRaw<Record<string, any>> = {
      name: 'sample-b',
      template: { pageKey: 'SampleB', route: { path: 'sampl-b' } }
    }
    // 模拟 _handleRouteNavigation
    const replaceMock = vi.spyOn(router, 'replace')
    await router.replace(to)
    expect(replaceMock).toHaveBeenCalledWith(to)
  })

  it('should correctly handle push', async () => {
    const addRouteSpy = vi.spyOn(mockRouterStore, 'insertCachedRoute')
    router = createRouter(routerOptions, templatePool, mockRouterStore)
    const to: VmoRouteToRaw<Record<string, any>> = {
      name: 'sample-c',
      template: { pageKey: 'SampleC', route: { path: 'sampl-c' } }
    }
    await router.push(to)
    expect(addRouteSpy).toHaveBeenCalledWith(to)
  })

  it('should correctly handle removeRoute', async () => {
    const removeCachedRoute = vi.spyOn(mockRouterStore, 'removeCachedRoute')
    router = createRouter(routerOptions, templatePool, mockRouterStore)
    const name = 'home'
    router.removeRoute(name)
    expect(removeCachedRoute).toHaveBeenCalledWith(name)
  })

  it('should correctly handle clearRoutes with all=true', async () => {
    router = createRouter(routerOptions, templatePool, mockRouterStore)
    const clearRoutesMock = vi.spyOn(router.$instance, 'clearRoutes')
    router.clearRoutes(true)
    expect(clearRoutesMock).toHaveBeenCalled()
  })

  it('should correctly handle reloadRoutes', async () => {
    router = await createRouter(routerOptions, templatePool, mockRouterStore)
    console.log(useRouter(), 'aaaa')
    const addRoute = vi.spyOn(router.$instance, 'addRoute')
    const reloads: VmoRouteToRaw<Record<string, any>>[] = [
      { name: 'sample-a1', template: { pageKey: 'SampleA', route: { path: 'sample-a1' } } },
      { name: 'sample-b1', template: { pageKey: 'SampleB', route: { path: 'sample-b1' } } }
    ]

    await router.reloadRoutes(reloads)

    expect(addRoute).toHaveBeenCalled()
    // expect(mockRouterStore.insertCachedRoute).toHaveBeenCalledWith(reloads[1])
  })

  it('should correctly handle clearRoutes', async () => {
    const removeCachedRoute = vi.spyOn(mockRouterStore, 'removeCachedRoute')
    router = createRouter(routerOptions, templatePool, mockRouterStore)
    await router.push({ name: 'sample-b', template: { pageKey: 'SampleB', route: { path: 'sampl-b' } } })
    await router.push({ name: 'sample-b1', template: { pageKey: 'SampleB', route: { path: 'sampl-b1' } } })
    router.clearRoutes(false)
    expect(removeCachedRoute).toHaveBeenCalledWith('sample-b')
    expect(removeCachedRoute).toHaveBeenCalledWith('sample-b1')
  })

  it('should only cached one route', async () => {
    router = createRouter(routerOptions, templatePool, mockRouterStore)
    mockRouterStore.setMutipleCatch(false)
    await router.push({ name: 'sample-b', template: { pageKey: 'SampleB', route: { path: 'sampl-b' } } })
    await router.push({ name: 'sample-b1', template: { pageKey: 'SampleB', route: { path: 'sampl-b1' } } })
    expect(mockRouterStore.getCachedRoutes).toEqual([
      { name: 'sample-b1', template: { pageKey: 'SampleB', route: { path: 'sampl-b1' } } }
    ])
  })

  //   it('should correctly handle beforeEach with store', async () => {
  //     router = createRouter(routerOptions, templatePool, mockRouterStore)
  //     const guard = vi.fn()

  //     await router.beforeEach(guard)

  //     const to = { path: '/about' }
  //     const from = { path: '/' }
  //     const next = vi.fn()

  //     // 模拟路由守卫调用
  //     const wrappedGuard = (router as any).beforeEach.mock.calls[0][0]
  //     await wrappedGuard(to, from, next)

  //     expect(mockRouterStore.setRouteToLeaveDisabled).toHaveBeenCalledWith(false)
  //     expect(guard).toHaveBeenCalledWith(to, from, next)
  //     expect(next).toHaveBeenCalled()
  //   })
})
