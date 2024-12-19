import { describe, it, expect, vi } from 'vitest'
import { createRouter, createWebHistory } from '../use.lib/index'
import { addRouterWithVmoRouterToRaw } from '../use.lib/lib'
import mockPageTemplates from '../src/pages/index'

/**
  验证 routeLocationNamedRaw 未提供时抛出错误
  验证 pageTemplates 未提供时抛出错误
  验证 routeLocationNamedRaw.template 未提供时抛出错误
  验证 routeLocationNamedRaw.template.pageKey 未提供时抛出错误
  验证 routeLocationNamedRaw.template.route 未提供时抛出错误
  验证 routeLocationNamedRaw.template.pageKey 不存在于 pageTemplates 时抛出错误
  验证 routeLocationNamedRaw.name 和 routeLocationNamedRaw.template.route.path 是否为空
  验证 routeLocationNamedRaw.template.parent 不存在于 routerInstance 时路由作为根路由添加
  验证 routeLocationNamedRaw.template.parent 存在于 routerInstance 时路由作为子路由添加
  验证 routeLocationNamedRaw.template.route.path 是否去除了冗余的 /
  验证 routeLocationNamedRaw.template.route.path 是否添加了缺省的 /
 */
// 模拟路由配置

const mockRouter = createRouter(
  {
    history: createWebHistory(),
    routes: [{ path: '/parent', component: { template: '<div>Parent Page</div>' }, name: 'ParentPage' }]
  },
  mockPageTemplates
)

// 模拟路由状态存储
vi.mock('./store', () => ({
  useRouterStore: vi.fn(() => ({
    setBrowserBeforeunloadDisabled: vi.fn(),
    getBrowserBeforeunloadDisabled: vi.fn(),
    getRouteToLeaveDisabled: vi.fn()
  }))
}))

describe('addRouterWithVmoRouterToRaw', () => {
  it('should throw error if routeLocationNamedRaw is not provided', () => {
    expect(() => {
      addRouterWithVmoRouterToRaw(null, mockPageTemplates, mockRouter)
    }).toThrow()
  })

  it('should throw error if pageTemplates is not provided', () => {
    expect(() => {
      addRouterWithVmoRouterToRaw(
        { name: 'TestPage', template: { pageKey: 'TestPage', route: { path: '/test' } } },
        // @ts-ignore
        null,
        mockRouter
      )
    }).toThrow()
  })

  it('should throw error if template is not provided', () => {
    expect(() => {
      addRouterWithVmoRouterToRaw({ name: 'TestPage' }, mockPageTemplates, mockRouter)
    }).toThrow()
  })

  it('should throw error if template.pageKey is not provided', () => {
    expect(() => {
      addRouterWithVmoRouterToRaw(
        { name: 'TestPage', template: { route: { path: '/test' } } },
        mockPageTemplates,
        mockRouter
      )
    }).toThrow()
  })

  it('should throw error if template.route is not provided', () => {
    expect(() => {
      addRouterWithVmoRouterToRaw(
        { name: 'TestPage', template: { pageKey: 'TestPage' } },
        mockPageTemplates,
        mockRouter
      )
    }).toThrow()
  })

  it('should throw error if template.pageKey is not found in pageTemplates', () => {
    expect(() => {
      addRouterWithVmoRouterToRaw(
        { name: 'TestPage', template: { pageKey: 'NotFoundPage', route: { path: '/test' } } },
        mockPageTemplates,
        mockRouter
      )
    }).toThrow()
  })

  it('should throw error if name and path are empty', () => {
    expect(() => {
      addRouterWithVmoRouterToRaw(
        { name: '', template: { pageKey: 'ChildPage', route: { path: '' } } },
        mockPageTemplates,
        mockRouter
      )
    }).toThrow()
  })

  it('should add route as root route if parent is not found', async () => {
    const addRouteSpy = vi.spyOn(mockRouter, 'addRoute')
    addRouterWithVmoRouterToRaw(
      {
        name: 'TestPage',
        template: {
          pageKey: 'SampleA',
          route: { path: '/test', meta: { title: 'Child Page', avoidTag: true, keepAlive: true }, props: true }
        }
      },
      mockPageTemplates,
      mockRouter
    )

    expect(addRouteSpy).toHaveBeenCalledWith({
      name: 'TestPage',
      path: '/test',
      component: expect.any(Function),
      props: true,
      meta: { title: 'Child Page', avoidTag: true, keepAlive: true }
    })
  })

  it('should add route as child route if parent is found', async () => {
    const addRouteSpy = vi.spyOn(mockRouter, 'addRoute')
    addRouterWithVmoRouterToRaw(
      {
        name: 'TestChildPage',
        template: { pageKey: 'SampleB', parent: 'ParentPage', route: { path: '/test-child' } }
      },
      mockPageTemplates,
      mockRouter
    )

    expect(addRouteSpy).toHaveBeenCalledWith('ParentPage', {
      name: 'TestChildPage',
      path: 'test-child',
      component: expect.any(Function),
      props: true,
      meta: { avoidTag: true, boy: 'boy', keepAlive: true }
    })
  })

  it('should remove leading slash from path if parent exists', async () => {
    const addRouteSpy = vi.spyOn(mockRouter, 'addRoute')
    addRouterWithVmoRouterToRaw(
      {
        name: 'TestChildPage',
        template: { pageKey: 'SampleB', parent: 'ParentPage', route: { path: '/test-child' } }
      },
      mockPageTemplates,
      mockRouter
    )

    expect(addRouteSpy).toHaveBeenCalledWith('ParentPage', {
      name: 'TestChildPage',
      path: 'test-child',
      component: expect.any(Function),
      props: true,
      meta: { avoidTag: true, boy: 'boy', keepAlive: true }
    })
  })

  it('should add leading slash to path if no parent exists', async () => {
    const addRouteSpy = vi.spyOn(mockRouter, 'addRoute')
    addRouterWithVmoRouterToRaw(
      { name: 'TestPage', template: { pageKey: 'SampleC', route: { path: 'test' } } },
      mockPageTemplates,
      mockRouter
    )
    expect(addRouteSpy).toHaveBeenCalledWith({
      name: 'TestPage',
      path: '/test',
      component: expect.any(Function),
      props: true,
      meta: { avoidTag: true, keepAlive: true }
    })
  })
})
