// usePreventBrowserBeforeunloadBehavior.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { usePreventBrowserBeforeunloadBehavior } from '../use.lib/lib'
import { createPinia, setActivePinia } from 'pinia'
import { useRouterStore } from '../use.lib/store'

describe('usePreventBrowserBeforeunloadBehavior', () => {
  // 创建一个 Pinia 实例并设置为当前活动的 Pinia
  const pinia = createPinia()
  setActivePinia(pinia)

  const routerStore = useRouterStore()

  // Mock the getCurrentInstance function to return a Vue component instance
  vi.stubGlobal('getCurrentInstance', () => ({
    emit: vi.fn(),
    options: {
      name: 'TestComponent'
    }
  }))

  afterEach(() => {
    vi.resetAllMocks()
    routerStore.setBrowserBeforeunloadDisabled(false)
    routerStore.setRouteToLeaveDisabled(false)
  })

  it('should add beforeunload listener on component mount when enabled', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const preventNav = vi.fn()
    const wrapper = mount({
      setup() {
        usePreventBrowserBeforeunloadBehavior(true, 'Are you sure?')
        return {}
      },
      template: '<div></div>'
    })
    // 确保 addEventListener 被调用
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
    wrapper.unmount()
  })

  it('should not add beforeunload listener on component mount when disabled', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const wrapper = mount({
      setup() {
        usePreventBrowserBeforeunloadBehavior(false, 'Are you sure?')
        return {}
      },
      template: '<div></div>'
    })
    // 确保 addEventListener 被调用
    expect(addEventListenerSpy).toHaveBeenCalled()
    // 触发 beforeunload 事件，确保 event.preventDefault 不会被执行
    const event = {
      preventDefault: vi.fn(),
      returnValue: ''
    } as unknown as BeforeUnloadEvent
    // 获取 addEventListener 的回调函数
    const preventNav = addEventListenerSpy.mock.calls[0][1]
    // @ts-ignore
    preventNav(event)
    // 检查 event.preventDefault 是否没有被调用
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(event.returnValue).toBe('')

    wrapper.unmount()
  })

  it('should remove beforeunload listener on component unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const wrapper = mount({
      setup() {
        usePreventBrowserBeforeunloadBehavior(true, 'Are you sure?')
        return {}
      },
      template: '<div></div>'
    })

    // 确保 addEventListener 被调用
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))

    // 卸载组件
    wrapper.unmount()

    // 确保 removeEventListener 被调用
    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('should prevent unload when enabled', async () => {
    const event = {
      preventDefault: vi.fn(),
      returnValue: ''
    } as unknown as BeforeUnloadEvent
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const wrapper = mount({
      setup() {
        usePreventBrowserBeforeunloadBehavior(true, 'Are you sure?')
        return {}
      },
      template: '<div></div>'
    })
    // 触发 beforeunload 事件
    const preventNav = addEventListenerSpy.mock.calls[0][1]
    // @ts-ignore
    preventNav(event)
    // 检查事件是否被正确处理
    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.returnValue).toBe('Are you sure?')

    wrapper.unmount()
  })

  it('should not prevent unload when disabled', async () => {
    const event = {
      preventDefault: vi.fn(),
      returnValue: ''
    } as unknown as BeforeUnloadEvent

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    const wrapper = mount({
      setup() {
        usePreventBrowserBeforeunloadBehavior(false, 'Are you sure?')
        return {}
      },
      template: '<div></div>'
    })

    // 触发 beforeunload 事件
    const preventNav = addEventListenerSpy.mock.calls[0]?.[1]
    if (preventNav) {
      // @ts-ignore
      preventNav(event)
    }
    // 检查事件是否没有被处理
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(event.returnValue).toBe('')
    wrapper.unmount()
  })

  it('should not prevent unload when store values are false', async () => {
    const event = {
      preventDefault: vi.fn(),
      returnValue: ''
    } as unknown as BeforeUnloadEvent

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    const wrapper = mount({
      setup() {
        usePreventBrowserBeforeunloadBehavior(true, 'Are you sure?')
        return {}
      },
      template: '<div></div>'
    })

    routerStore.setBrowserBeforeunloadDisabled(false)
    routerStore.setRouteToLeaveDisabled(false)

    // 触发 beforeunload 事件
    const preventNav = addEventListenerSpy.mock.calls[0][1]
    // @ts-ignore
    preventNav(event)

    // 检查事件是否没有被处理
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(event.returnValue).toBe('')

    wrapper.unmount()
  })

  it('should prevent unload when store values are true', async () => {
    const event = {
      preventDefault: vi.fn(),
      returnValue: ''
    } as unknown as BeforeUnloadEvent
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const wrapper = mount({
      setup() {
        usePreventBrowserBeforeunloadBehavior(false, 'Are you sure?')
        return {}
      },
      template: '<div></div>'
    })
    routerStore.setBrowserBeforeunloadDisabled(true)
    routerStore.setRouteToLeaveDisabled(true)
    // 触发 beforeunload 事件
    const preventNav = addEventListenerSpy.mock.calls[0][1]
    // @ts-ignore
    preventNav(event)
    // 检查事件是否被正确处理
    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.returnValue).toBe('Are you sure?')
    wrapper.unmount()
  })

  it('should prevent unload when only routeToLeaveDisabled is true', async () => {
    const event = {
      preventDefault: vi.fn(),
      returnValue: ''
    } as unknown as BeforeUnloadEvent
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const wrapper = mount({
      setup() {
        usePreventBrowserBeforeunloadBehavior(false, 'Are you sure?')
        return {}
      },
      template: '<div></div>'
    })
    routerStore.setBrowserBeforeunloadDisabled(false)
    routerStore.setRouteToLeaveDisabled(true)
    // 触发 beforeunload 事件
    const preventNav = addEventListenerSpy.mock.calls[0][1]
    // @ts-ignore
    preventNav(event)
    // 检查事件是否被正确处理
    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.returnValue).toBe('Are you sure?')
    wrapper.unmount()
  })

  it('should prevent unload when only browserBeforeunloadDisabled is true', async () => {
    const event = {
      preventDefault: vi.fn(),
      returnValue: ''
    } as unknown as BeforeUnloadEvent
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const wrapper = mount({
      setup() {
        usePreventBrowserBeforeunloadBehavior(false, 'Are you sure?')
        return {}
      },
      template: '<div></div>'
    })
    routerStore.setBrowserBeforeunloadDisabled(true)
    routerStore.setRouteToLeaveDisabled(false)
    // 触发 beforeunload 事件
    const preventNav = addEventListenerSpy.mock.calls[0][1]
    // @ts-ignore
    preventNav(event)
    // 检查事件是否被正确处理
    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.returnValue).toBe('Are you sure?')
    wrapper.unmount()
  })
})
