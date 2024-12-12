# vmo-router

1. 所有页面模版化，支持在工程内部构件一个自动加载所有页面的自动装载方法，先将页面装载成 template，全部支持懒加载 (完成, 但方法是否通用待验证)
2. 基础页面预实例，部分基础页面，如登录，首页，异常报错页面，预先装载。成为系统的基础路由
3. 菜单指定路由装载，当用户登录后，我们可以通过后端返回的 JSON 来实际装填所有的 template ，构成真正的路由表。在这个过程中，需要考虑对每个模版实例单独设置 name ，path，keepAlive ,title, params，以及页面的父子路由关系。
4. 菜单装载路由的缓存处理，当用户登录后，菜单装载的路由需要缓存化，即用户刷新页面时，也会装载全部的菜单指定路由表。避免刷新丢失页面
5. 动态路由装载，用户在实际使用中，考虑到低代码的情况，我们需要考虑用户可能装载页面时，存在部分路由未能完全加载，而是用户点击跳转时，判断是否装载，如未能装载则动态装载，并且也要添加入缓存
6. 页面返回禁止，比如部分页面再为保存时，不可直接离开或者返回需要得到用户的再次确认。
7. 权限控制，支持简单的权限点匹配控制方式
8. 路由动画，此处 配合 transition 组件一起使用

### maybe need

你的路由管理模型已经涵盖了很多实际开发中常见的场景，但仍然有一些场景和细节可能会被遗漏。以下是一些你可能需要考虑的补充场景：

7. 权限控制
   在实际应用中，路由通常需要与用户的权限相关联。用户可能没有权限访问某些路由。你可以考虑以下实现：权限校验：在路由跳转前检查用户权限，如果没有权限，则跳转到无权限页面或提示用户。

```javascript
router.beforeEach((to, from, next) => {
  const user = store.state.user // 假设你将用户信息存储在 Vuex 中
  const requiredPermissions = to.meta.permissions || []

  if (requiredPermissions.length === 0) {
    next()
  } else {
    const hasPermission = requiredPermissions.every(perm => user.permissions.includes(perm))
    if (hasPermission) {
      next()
    } else {
      next('/no-permission')
    }
  }
})
```

8. 路由懒加载
   虽然你在动态路由装载中已经考虑了懒加载，但静态路由也可以通过懒加载提升性能，尤其是在页面较多的情况下。

```javascript
const Home = () => import('@/pages/Home.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]
```

9. 路由导航守卫
   除了 beforeEach，你还可以使用 beforeEnter、afterEach 等导航守卫来实现更细粒度的控制。

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      // 检查用户是否为管理员
      if (store.state.user.isAdmin) {
        next()
      } else {
        next('/no-permission')
      }
    }
  }
]
```

10. 路由动画
    可以为路由切换添加动画效果，提升用户体验。

```javascript
<transition name="fade">
  <router-view></router-view>
</transition>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
```

11. 路由缓存优化
    如果你的应用中有大量页面需要缓存，可以考虑对缓存进行优化，比如限制缓存的数量或根据页面使用频率动态调整缓存策略。

```javascript
// 示例：限制缓存数量
const MAX_CACHE_SIZE = 5

router.beforeEach((to, from, next) => {
  const cachedRoutes = JSON.parse(localStorage.getItem('cachedRoutes')) || []
  if (cachedRoutes.length > MAX_CACHE_SIZE) {
    cachedRoutes.shift() // 移除最早的缓存
  }
  localStorage.setItem('cachedRoutes', JSON.stringify(cachedRoutes))
  next()
})
```

12. 路由重定向
    某些情况下，用户访问的路径可能已经被重定向到新的路径。你可以设置重定向规则。

```javascript
const routes = [
  {
    path: '/old-path',
    redirect: '/new-path'
  },
  {
    path: '/new-path',
    component: NewComponent
  }
]
```

13. 路由参数和查询参数
    确保你在处理路由参数和查询参数时考虑到了各种情况，比如参数的类型、默认值等。

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    props: route => ({ id: Number(route.params.id) })
  }
]
```

14. 兼容性处理
    在实际开发中，可能会遇到不同浏览器对路由行为的差异，尤其是在处理 hash 模式和 history 模式时的兼容性问题。

15. 路由日志和监控
    在生产环境中，你可能需要监控路由的行为，比如记录用户访问的路径、停留时间等，以便进行数据分析和优化。

```javascript
router.afterEach((to, from) => {
  console.log(`路由变化: ${from.path} -> ${to.path}`)
  // 发送日志到服务器
  sendLog({ from: from.path, to: to.path, timestamp: Date.now() })
})
```

25. 路由的权限控制
    在许多应用中，权限控制是非常重要的一环。你需要确保只有具有相应权限的用户才能访问某些路由。

```javascript
const requiresAuth = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: requiresAuth
  }
]
```

26. 路由的动态权限
    有时，权限可能是动态的，取决于用户的角色或其他条件。你可以根据这些条件动态调整路由。

```javascript
const dynamicPermission = (to, from, next) => {
  const userRole = store.getters.userRole
  if (userRole === 'admin' || userRole === 'editor') {
    next()
  } else {
    next('/403')
  }
}

const routes = [
  {
    path: '/admin',
    component: AdminPanel,
    beforeEnter: dynamicPermission
  }
]
```

27. 路由的历史记录管理
    在某些应用中，你可能需要管理路由的历史记录，以便用户可以轻松地回到之前的页面。

```javascript
const pushToHistory = route => {
  history.pushState({ path: route.path }, '', route.path)
}

router.beforeEach((to, from, next) => {
  pushToHistory(to)
  next()
})
```

28. 路由的跳转动画
    为了提升用户体验，你可以在路由跳转时添加过渡动画。

```javascript
<transition name="fade">
  <router-view></router-view>
</transition>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
```

29. 路由的滚动行为
    在页面跳转时，你可能希望控制页面的滚动行为，比如始终滚动到顶部。

```javascript
const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
```

30. 路由的懒加载进度条
    在懒加载组件时，为了提升用户体验，你可以添加一个加载进度条。

```javascript
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start()
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})
```

31. 路由的深层嵌套
    在复杂应用中，你可能需要处理深层嵌套路由。

```javascript
const routes = [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: 'profile',
        component: UserProfile
      },
      {
        path: 'settings',
        component: UserSettings
      }
    ]
  }
]
```

32. 路由的查询参数管理
    在某些情况下，你可能需要管理路由的查询参数，以便在不同的页面之间传递数据。

```javascript
const queryParams = {
  name: 'Vue',
  version: '3.0'
}

router.push({ name: 'Search', query: queryParams })
```

33. 路由的元数据
    你可以在路由中添加元数据，以便在不同的生命周期钩子中使用。

```javascript
const routes = [
  {
    path: '/about',
    component: About,
    meta: { requiresAuth: true }
  }
]

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    requiresAuth(to, from, next)
  } else {
    next()
  }
})
```

34. 路由的扁平化处理
    在某些情况下，你可能需要将深层嵌套的路由扁平化处理，以便于管理和维护。

```javascript
const routes = [
  {
    path: '/user/profile',
    component: UserProfile
  },
  {
    path: '/user/settings',
    component: UserSettings
  }
]
```

35. 路由的导出和导入
    在开发和部署过程中，你可能需要导出和导入路由配置。

```javascript
export const routes = [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/about',
    component: About
  }
]

// 在其他文件中导入
import { routes } from './routes'
```
