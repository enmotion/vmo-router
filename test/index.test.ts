import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory, isNavigationFailure, useRouter } from '../use.lib/index'
import { useRouterStore } from '../use.lib/store'
import type { VmoRouteToRaw } from '../types'

const component = { render: () => h('div') }
const pool = { Page: { path: '/template', component } }
const to = (name: string, parent?: string): VmoRouteToRaw<Record<string, any>> => ({
  name, template: { pageKey: 'Page', parent, route: { path: name } }
})
function setup() {
  const store = useRouterStore()
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/', name: 'home', component }, { path: '/other', name: 'other', component }
  ] }, pool, store)
  return { router, store }
}
beforeEach(() => setActivePinia(createPinia()))

describe('router integration', () => {
  it('awaits push and replace and preserves normal path navigation', async () => {
    const { router, store } = setup()
    expect(router.$instance).toBeDefined()
    await router.push(to('a'))
    expect(router.currentRoute.value.name).toBe('a')
    expect(store.getCachedRoutes).toEqual([to('a')])
    await router.replace(to('b'))
    expect(router.currentRoute.value.name).toBe('b')
    await router.push('/')
    await router.replace({ path: '/other' })
    expect(router.currentRoute.value.name).toBe('other')
    expect(store.getCachedRoutes.map(r => r.name)).toEqual(['a', 'b'])
    expect(isNavigationFailure(await router.push({ name: 'other' }))).toBe(true)
  })
  it('rejects invalid additions without navigating or persisting', async () => {
    const { router, store } = setup()
    await router.push('/')
    await expect(router.push({ name: 'missing' })).rejects.toThrow()
    expect(router.currentRoute.value.name).toBe('home')
    expect(store.getCachedRoutes).toEqual([])
    router.addRouter(to('a'))
    expect(() => router.addRouter(to('a'))).toThrow('already exists')
  })
  it('keeps leave protection on cancellation, rejection and subsequent guard abort', async () => {
    const { router, store } = setup()
    await router.push('/')
    const confirm = vi.fn().mockResolvedValue(false)
    store.setConfirmToLeaveMethod(confirm)
    store.setRouteToLeaveDisabled(true)
    expect(isNavigationFailure(await router.push(to('a')))).toBe(true)
    expect(isNavigationFailure(await router.push(to('a')))).toBe(true)
    expect(confirm).toHaveBeenCalledTimes(2)
    expect(store.getCachedRoutes).toEqual([])
    expect(store.getRouteToLeaveDisabled).toBe(true)
    confirm.mockRejectedValueOnce(new Error('cancel'))
    expect(isNavigationFailure(await router.push('/other'))).toBe(true)
    confirm.mockResolvedValue(true)
    const unregister = router.beforeEach(async () => false)
    expect(isNavigationFailure(await router.push('/other'))).toBe(true)
    expect(store.getRouteToLeaveDisabled).toBe(true)
    unregister()
    await router.push('/other')
    expect(store.getRouteToLeaveDisabled).toBe(false)
  })
  it('supports guard redirects and exposes async guard errors', async () => {
    const { router } = setup()
    const stop = router.beforeEach((target, from) => {
      expect(from.path).toBe('/')
      return target.name === 'a' ? { name: 'other' } : true
    })
    await router.push(to('a'))
    expect(router.currentRoute.value.name).toBe('other')
    stop()
    router.onError(() => {})
    router.beforeEach(async () => { throw new Error('guard failed') })
    await expect(router.push('/')).rejects.toThrow('guard failed')
  })
  it('clears all dynamic registrations in single-cache mode while preserving static routes', async () => {
    const { router, store } = setup()
    store.setMutipleCatch(false)
    await router.push(to('a'))
    await router.push(to('b'))
    await router.push('/')
    expect(store.getCachedRoutes).toEqual([to('b')])
    store.setKeepAliveName(['a', 'b'])
    router.clearRoutes()
    expect(router.hasRoute('a')).toBe(false)
    expect(router.hasRoute('b')).toBe(false)
    expect(router.hasRoute('home')).toBe(true)
    expect(store.getCachedRoutes).toEqual([])
    expect(store.getKeepAliveRouteNames).toEqual([])
    router.clearRoutes(true)
    expect(router.getRoutes()).toEqual([])
  })
  it('restores nested routes synchronously and handles arbitrary input order without mutation', async () => {
    const store = useRouterStore()
    const saved = [to('leaf', 'child'), to('child', 'root'), to('root')]
    store.setCacheMethods({ getter: () => saved, setter: () => {} })
    const { router } = setup()
    expect(router.resolve({ name: 'leaf' }).path).toBe('/root/child/leaf')
    expect(saved.map(r => r.name)).toEqual(['leaf', 'child', 'root'])
    await router.push({ name: 'leaf' })
    router.removeRoute('root')
    expect(router.hasRoute('leaf')).toBe(false)
    expect(store.getCachedRoutes).toEqual([])
    router.removeRoute('unknown')
  })
  it('validates a reload before changing existing routes and supports append', async () => {
    const { router, store } = setup()
    await router.push(to('a'))
    await expect(router.reloadRoutes([to('b'), { name: 'bad' }])).rejects.toThrow()
    expect(router.hasRoute('a')).toBe(true)
    expect(router.hasRoute('b')).toBe(false)
    await expect(router.reloadRoutes([to('b', 'missing')])).rejects.toThrow('parent')
    await expect(router.reloadRoutes([to('b', 'c'), to('c', 'b')])).rejects.toThrow('parent')
    await expect(router.reloadRoutes([to('b'), to('b')])).rejects.toThrow('already exists')
    await router.reloadRoutes([to('b')], false)
    expect(router.hasRoute('a')).toBe(true)
    await router.reloadRoutes([to('c')])
    expect(router.hasRoute('a')).toBe(false)
    expect(router.hasRoute('c')).toBe(true)
    expect(store.getCachedRoutes).toEqual([to('c')])
  })
  it('persists the resolved params, query and hash when revisiting a dynamic route', async () => {
    const { router, store } = setup()
    const definition = to('detail')
    definition.template!.route.path = 'detail/:id'
    await router.push({ ...definition, params: { id: '1' }, query: { tab: 'a' }, hash: '#top' })
    await router.push({ name: 'detail', params: { id: '2' }, query: { tab: 'b' }, hash: '#bottom' })
    expect(store.getCachedRoutes[0]).toMatchObject({ params: { id: '2' }, query: { tab: 'b' }, hash: '#bottom' })
    await router.push({ name: 'detail', params: { id: '3' } })
    expect(store.getCachedRoutes[0].query).toEqual({})
    expect(store.getCachedRoutes[0].hash).toBe('')
  })
  it('works without a store and injects the proxy into components', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component }] }, pool)
    await router.push('/')
    let injected: unknown
    const wrapper = mount(defineComponent({ setup() { injected = useRouter(); return () => h('div') } }), {
      global: { plugins: [router] }
    })
    expect(injected).toBe(router)
    wrapper.unmount()
    await router.push(to('a'))
    router.clearRoutes()
    expect(router.hasRoute('a')).toBe(false)
    router.clearRoutes(true)
  })
})
