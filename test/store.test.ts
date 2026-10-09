// routerStore.test.ts
import { describe, test, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRouterStore } from '../use.lib/store' // 替换为你的文件路径
import { VmoStore } from 'vmo-store'

describe('useRouterStore', () => {
  beforeEach(() => {
    // 每次测试前初始化 pinia
    setActivePinia(createPinia())
  })

  // 测试 state 初始化
  test('should initialize state correctly', () => {
    const store = useRouterStore()
    expect(store.confirmToLeaveMethod).toBeDefined()
    expect(store.cachedRoutes).toEqual(null)
    expect(store.keepAliveRouteNames).toEqual([])
    expect(store.mutipleCatch).toBe(true)
    expect(store.routeToLeaveDisabled).toBe(false)
    expect(store.browserBeforeunloadDisabled).toBe(false)
  })

  // 测试 getters
  test('should return correct values from getters', () => {
    const store = useRouterStore()
    expect(store.getCachedRoutes).toEqual([])
    expect(store.getKeepAliveRouteNames).toEqual([])
    expect(store.getMutipleCatch).toBe(true)
    expect(store.getBrowserBeforeunloadDisabled).toBe(false)
    expect(store.getRouteToLeaveDisabled).toBe(false)
    expect(store.getKeepAliveMax).toBeUndefined()
  })

  // 测试 actions
  test('should insert cached route correctly', () => {
    const store = useRouterStore()
    const route = { name: 'route1', path: '/path1', meta: {} }
    store.insertCachedRoute(route)
    expect(store.getCachedRoutes).toContainEqual(route)
  })

  test('should not insert duplicate cached route', () => {
    const store = useRouterStore()
    const route = { name: 'route1', path: '/path1', meta: {} }
    store.insertCachedRoute(route)
    store.insertCachedRoute(route)
    expect(store.getCachedRoutes.length).toBe(1)
  })

  test('should only insert one route when mutipleCatch false', () => {
    const store = useRouterStore()
    store.setMutipleCatch(false)
    const route1 = { name: 'route1', path: '/path1', meta: {} }
    const route2 = { name: 'route2', path: '/path1', meta: {} }
    store.insertCachedRoute(route1)
    store.insertCachedRoute(route2)
    expect(store.getCachedRoutes.length).toBe(1)
  })

  test('should remove cached route correctly', () => {
    const store = useRouterStore()
    const route1 = { name: 'route1', path: '/path1', meta: {} }
    const route2 = { name: 'route2', path: '/path2', meta: {} }
    store.insertCachedRoute(route1)
    store.insertCachedRoute(route2)
    store.removeCachedRoute('route1')

    expect(store.getCachedRoutes).not.toContainEqual(route1)
    expect(store.getCachedRoutes).toContainEqual(route2)
  })

  test('should not insert duplicate keepAlive route names', () => {
    const store = useRouterStore()
    store.insertKeepAliveName('route1')
    store.insertKeepAliveName('route1')
    expect(store.getKeepAliveRouteNames.length).toBe(1)
  })

  test('should remove keepAlive route names correctly', () => {
    const store = useRouterStore()
    store.insertKeepAliveName('route1')
    store.insertKeepAliveName('route2')
    store.removeKeepAliveName('route1')
    expect(store.getKeepAliveRouteNames).not.toContain('route1')
    expect(store.getKeepAliveRouteNames).toContain('route2')
  })

  test('should remove keepAlive route names correctly', () => {
    const store = useRouterStore()
    store.setKeepAliveMax(2)
    store.insertKeepAliveName('route1')
    store.insertKeepAliveName('route2')
    store.insertKeepAliveName('route3')
    expect(store.getKeepAliveRouteNames).not.toContain('route1')
    expect(store.getKeepAliveRouteNames).toContain('route2')
    expect(store.getKeepAliveRouteNames.length).equal(2)
  })

  test('should set mutipleCatch correctly', () => {
    const store = useRouterStore()
    store.setMutipleCatch(false)
    expect(store.getMutipleCatch).toBe(false)
  })

  test('should set browserBeforeunloadDisabled correctly', () => {
    const store = useRouterStore()
    store.setBrowserBeforeunloadDisabled(true)
    expect(store.getBrowserBeforeunloadDisabled).toBe(true)
  })

  test('should set routeToLeaveDisabled correctly', () => {
    const store = useRouterStore()
    store.setRouteToLeaveDisabled(true)
    expect(store.getRouteToLeaveDisabled).toBe(true)
  })

  test('should set keepAliveMax correctly', () => {
    const store = useRouterStore()
    store.setKeepAliveMax(5)
    expect(store.getKeepAliveMax).toBe(5)
  })

  test('should clear dynamic routers correctly', () => {
    const store = useRouterStore()
    const route = { name: 'route1', path: '/path1', meta: {} }
    store.insertCachedRoute(route)
    store.clearDynamicRouters()
    expect(store.getCachedRoutes).toEqual([])
  })

  test('should set cache methods correctly', () => {
    const store = useRouterStore()
    const methods = {
      setter: routes => {},
      getter: () => []
    }
    store.setCacheMethods(methods)
    expect(store.getCacheMethod).toEqual(methods)
  })

  test('should set confirmToLeaveMethod correctly', () => {
    const store = useRouterStore()
    const method = async meta => true
    store.setConfirmToLeaveMethod(method)
    expect(store.getConfirmToLeaveMethod).toEqual(method)
  })

  test('should set keepAliveName correctly with string', () => {
    const store = useRouterStore()
    store.setKeepAliveName('main-pg')
    expect(store.getKeepAliveRouteNames).toEqual(['main-pg'])
  })

  test('should set keepAliveName correctly width array', () => {
    const store = useRouterStore()
    store.setKeepAliveName(['main-pg'])
    expect(store.getKeepAliveRouteNames).toEqual(['main-pg'])
  })

  test('should insertkeepAliveName correctly with string', () => {
    const store = useRouterStore()
    store.insertKeepAliveName('main-pg')
    expect(store.getKeepAliveRouteNames).toEqual(['main-pg'])
  })

  test('should insertkeepAliveName correctly width array', () => {
    const store = useRouterStore()
    store.insertKeepAliveName(['main-pg'])
    expect(store.getKeepAliveRouteNames).toEqual(['main-pg'])
  })

  test('should removekeepAliveName correctly with string', () => {
    const store = useRouterStore()
    store.insertKeepAliveName('main-pg')
    store.insertKeepAliveName('main1-pg')
    store.removeKeepAliveName('main-pg')
    expect(store.getKeepAliveRouteNames).toEqual(['main1-pg'])
  })

  test('should removekeepAliveName correctly width array', () => {
    const store = useRouterStore()
    store.insertKeepAliveName('main-pg')
    store.insertKeepAliveName('main1-pg')
    store.removeKeepAliveName(['main-pg', 'main1-pg'])
    expect(store.getKeepAliveRouteNames).toEqual([])
  })

  test('should set clear cacheMethods return with one', () => {
    const store = useRouterStore()
    store.setCacheMethods({} as any)
    store.insertCachedRoute({ name: 'a' })
    expect(store.getCachedRoutes).toEqual([{ name: 'a' }])
  })

  test('should set clear cacheMethods return with one', () => {
    const store = useRouterStore()
    store.setCacheMethods({
      getter: () => JSON.parse(sessionStorage.getItem('store') ?? '[]'),
      setter: value => sessionStorage.setItem('store', JSON.stringify(value))
    })
    store.insertCachedRoute({ name: 'a' })
    store.clearDynamicRouters()
    expect(store.getCachedRoutes).toEqual([])
  })

  test('should set confirmToLeaveMethod correctly', () => {
    const store = useRouterStore()
    const data = new VmoStore<{ routes: any[] }>({
      namespace: 'router:test',
      dataProps: {
        routes: {
          type: String,
          default: () => [],
          storge: 'sessionStorage'
        }
      }
    })
    store.setCacheMethods({
      setter: routes => {
        return data.setData('routes', routes)
      },
      getter: () => {
        return data.getData('routes')
      }
    })
    const method = async meta => true
    store.setConfirmToLeaveMethod(method)
    expect(store.getConfirmToLeaveMethod).toEqual(method)
  })
})

describe('cache consistency regressions', () => {
  beforeEach(() => setActivePinia(createPinia()))
  test('updates params for the same cached route', () => {
    const store = useRouterStore()
    store.insertCachedRoute({ name: 'a', params: { id: '1' } })
    store.insertCachedRoute({ name: 'a', params: { id: '2' } })
    expect(store.getCachedRoutes).toEqual([{ name: 'a', params: { id: '2' } }])
  })
  test('switching to single mode collapses a previously cached name', () => {
    const store = useRouterStore()
    store.insertCachedRoute({ name: 'a' })
    store.insertCachedRoute({ name: 'b' })
    store.setMutipleCatch(false)
    store.insertCachedRoute({ name: 'a' })
    expect(store.getCachedRoutes).toEqual([{ name: 'a' }])
  })
  test('default confirmation permits leaving and removal supports a getter-only cache', async () => {
    const store = useRouterStore()
    expect(await store.getConfirmToLeaveMethod!({})).toBe(true)
    store.setCacheMethods({ getter: () => [{ name: 'a' }] } as any)
    store.removeCachedRoute('a')
    expect(store.getCachedRoutes).toEqual([])
  })
})
