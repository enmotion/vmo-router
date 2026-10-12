# Vue Router 原生 API

## 保留的实例能力

代理保留 currentRoute、options、install，以及 addRoute、hasRoute、getRoutes、resolve、afterEach、beforeResolve、onError、isReady、back、forward、go 等原生能力。push、replace、beforeEach、removeRoute、clearRoutes 被本库扩展；addRouter 和 reloadRoutes 为新增方法，详见 [Router API](./router.md)。

resolve 只解析、不导航，push/replace 才执行导航。命名解析和导航仍需满足必填 params。原生 addRoute 的返回注销函数及直接 $instance 修改不会自动同步本库缓存。

## 从本库重新导出的函数

以下函数从安装的 vue-router 原样导出，参数、返回值及限制以该依赖版本为准：

| 导出 | 用途 |
| --- | --- |
| createMemoryHistory | 内存历史，测试或 SSR 场景 |
| createWebHashHistory | hash 历史 |
| createWebHistory | HTML5 历史，服务端需配置地址回退 |
| createRouterMatcher | 底层路由匹配器，普通接入无需直接使用 |
| useRoute | setup 中获取当前响应式路由 |
| useLink | 自定义链接的组合式能力 |
| isNavigationFailure | 判断导航失败结果，可按失败类型筛选 |
| loadRouteLocation | 加载目标路由组件，返回 Promise |
| onBeforeRouteLeave / onBeforeRouteUpdate | 注册组件离开或更新守卫 |
| parseQuery / stringifyQuery | 查询字符串与查询对象转换 |

本库的 createRouter/useRouter 是扩展实现，不属于此处的原样重导出。它没有重新导出 Vue Router 的全部类型；需要 RouterOptions、RouteRecordRaw、NavigationFailure 等原生类型时从 vue-router 导入。详细签名应查阅所安装依赖的类型声明，不在此复制维护另一套原生手册。
