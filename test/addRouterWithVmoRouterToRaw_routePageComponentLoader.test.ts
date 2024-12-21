import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from '../use.lib/index'
import type { VmoProxyRouter } from '../types'
import type { Router } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { useRouterStore } from '../use.lib/store'
import pageTemplates from '../src/pages/index'

// 测试用的路由配置
const routeLocationNamedRaw = {
  name: 'Home',
  template: {
    pageKey: 'MainPg',
    route: {
      path: '/home'
    }
  }
} as const

// 创建一个 Vue Router 实例

describe('addRouterWithVmoRouterToRaw', () => {
  let routerStore: any
  let router: VmoProxyRouter<Record<string, any>>

  beforeEach(() => {
    vi.resetAllMocks()
    // 创建一个 Pinia 实例并设置为当前活动的 Pinia
    const pinia = createPinia()
    setActivePinia(pinia)
    routerStore = useRouterStore()
    routerStore.setBrowserBeforeunloadDisabled(true)
    routerStore.setRouteToLeaveDisabled(false)
    router = createRouter(
      {
        history: createWebHistory(),
        routes: []
      },
      pageTemplates,
      routerStore
    )
  })

  it('should call _routePageComponentLoader and modify the component name', async () => {
    router.reloadRoutes([
      {
        name: 'sample-a1',
        // @ts-ignore
        template: {
          pageKey: 'SampleA',
          route: {
            path: 'sample-a1/:id'
          }
        }
      },
      {
        name: 'sample-a2',
        // @ts-ignore
        template: {
          pageKey: 'SampleA',
          route: {
            path: 'sample-a2/:id'
          }
        }
      },
      {
        name: 'sample-b1',
        // @ts-ignore
        template: {
          pageKey: 'SampleB',
          route: {
            path: 'sample-b1/:id'
          }
        }
      },
      {
        name: 'sample-e1',
        // @ts-ignore
        template: {
          pageKey: 'SampleE',
          route: {
            path: 'sample-b1/:id'
          }
        }
      }
    ])
    expect(router.hasRoute('sample-a1')).toBe(true)
    expect(router.hasRoute('sample-a2')).toBe(true)
    expect(router.hasRoute('sample-b1')).toBe(true)
    expect(router.hasRoute('sample-e1')).toBe(true)
    expect(router.hasRoute('sample-e2')).toBe(false)
    expect(router.getRoutes().length).toBe(4)
  })

  // it('should call _routePageComponentLoader and modify the component name', async () => {
  //   const routerInstance = router
  //   const mockRoute = { path: '/home', component: pageTemplates.MainPg.component }

  //   // 替换 router.addRoute 为 mock 函数
  //   // @ts-ignore
  //   vi.spyOn(routerInstance, 'addRoute').mockImplementation(() => {})

  //   await addRouterWithVmoRouterToRaw(routeLocationNamedRaw, pageTemplates, routerInstance)

  //   // expect(_routePageComponentLoaderMock).toHaveBeenCalled()
  //   // expect(_routePageComponentLoaderMock).toHaveBeenCalledWith(mockRoute.component)

  //   const addedRoute = (routerInstance.addRoute as any).mock.calls[0][0]
  //   expect(addedRoute.name).toBe('Home')
  //   expect(addedRoute.path).toBe('/home')
  //   // expect(addedRoute.component).resolves.toEqual({ name: 'Home' })
  // })

  // it('should not call _routePageComponentLoader if route validation fails', async () => {
  //   const routerInstance = router
  //   vi.spyOn(routerInstance, 'addRoute').mockImplementation(() => {})

  //   const invalidRouteLocationNamedRaw = {
  //     name: 'Invalid',
  //     template: {
  //       pageKey: 'InvalidPage',
  //       route: {
  //         path: '/invalid',
  //         component: null
  //       }
  //     }
  //   } as const

  //   await addRouterWithVmoRouterToRaw(invalidRouteLocationNamedRaw, pageTemplates, routerInstance)

  //   expect(_routePageComponentLoaderMock).not.toHaveBeenCalled()
  //   expect(routerInstance.addRoute).not.toHaveBeenCalled()
  // })

  // it('should add route as a child route if parent exists', async () => {
  //   const routerInstance = router;
  //   vi.spyOn(routerInstance, 'addRoute').mockImplementation(() => {});

  //   const parentRoute = {
  //     path: '/parent',
  //     component: { name: 'ParentComponent' },
  //     children: [],
  //   };

  //   routerInstance.addRoute(parentRoute);

  //   const childRouteLocationNamedRaw = {
  //     name: 'Child',
  //     template: {
  //       pageKey: 'Home',
  //       route: {
  //         path: '/child',
  //         component: pageTemplates.Home.component,
  //       },
  //       parent: 'Parent',
  //     },
  //   } as const;

  //   await addRouterWithVmoRouterToRaw(childRouteLocationNamedRaw, pageTemplates, routerInstance);

  //   expect(_routePageComponentLoaderMock).toHaveBeenCalled();
  //   expect(_routePageComponentLoaderMock).toHaveBeenCalledWith(pageTemplates.Home.component);

  //   const addedRoute = (routerInstance.addRoute as any).mock.calls[0][1];
  //   expect(addedRoute.name).toBe('Child');
  //   expect(addedRoute.path).toBe('child');
  //   expect(addedRoute.component).resolves.toEqual({ name: 'MockComponent' });
  // });

  // it('should add route as a root route if parent does not exist', async () => {
  //   const routerInstance = router;
  //   vi.spyOn(routerInstance, 'addRoute').mockImplementation(() => {});

  //   const rootRouteLocationNamedRaw = {
  //     name: 'Root',
  //     template: {
  //       pageKey: 'Home',
  //       route: {
  //         path: '/root',
  //         component: pageTemplates.Home.component,
  //       },
  //     },
  //   } as const;

  //   await addRouterWithVmoRouterToRaw(rootRouteLocationNamedRaw, pageTemplates, routerInstance);

  //   expect(_routePageComponentLoaderMock).toHaveBeenCalled();
  //   expect(_routePageComponentLoaderMock).toHaveBeenCalledWith(pageTemplates.Home.component);

  //   const addedRoute = (routerInstance.addRoute as any).mock.calls[0][0];
  //   expect(addedRoute.name).toBe('Root');
  //   expect(addedRoute.path).toBe('/root');
  //   expect(addedRoute.component).resolves.toEqual({ name: 'MockComponent' });
  // });

  // it('should throw an error if required fields are missing', async () => {
  //   const routerInstance = router;
  //   const invalidRouteLocationNamedRaw = {
  //     name: '',
  //     template: {
  //       pageKey: '',
  //       route: { path: '', component: null },
  //     },
  //   } as const;

  //   await expect(async () => {
  //     await addRouterWithVmoRouterToRaw(invalidRouteLocationNamedRaw, pageTemplates, routerInstance);
  //   }).rejects.toThrow(`VmoRouter[ERROR]: 创建动态路由失败: [routeLocationNamedRaw?.name]:  PGS[routeLocationNamedRaw?.template]: undefined 请补全以上参数`);
  // });
})
