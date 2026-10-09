# Router API

## createRouter

```ts
createRouter<META>(options, templates, store?)
```

`options` is Vue Router's `RouterOptions`. `templates` is a `Record<string, RouteRecordRaw>`, and `store` is an optional router store. Returns `VmoProxyRouter<META>`, preserving most native router features. Invalid recovery definitions throw synchronously.

## Extended methods

| Method | Returns | Behavior |
| --- | --- | --- |
| `push(to)` | Navigation Promise | Register from a template when needed, then navigate |
| `replace(to)` | Navigation Promise | Dynamic navigation replacing the current history entry |
| `addRouter(to)` | `void` | Synchronous registration; invalid definitions or duplicate names throw |
| `reloadRoutes(routes, needClear = true)` | `Promise<void>` | Prevalidate definitions and dependencies, then replace or append |
| `removeRoute(name)` | `void` | Remove the route and descendants; synchronize managed caches and names |
| `clearRoutes(all = false)` | `void` | Keep static routes by default; true clears every route and cache |
| `beforeEach(guard)` | `() => void` | Register a guard and return its unregister function |

`push/replace` accepts `VmoRouteToRaw<META>` and native `RouteLocationRaw`, including strings and path objects. Navigation failures can resolve to `NavigationFailure`; configuration, guard and lazy-loading errors can reject the Promise.

```ts
const unregister = router.beforeEach(async (to, from) => {
  return true
})
unregister()
```

Guards use return values, with arguments ordered `to, from`. No `next` argument is provided.

## Native methods and $instance

`afterEach`, `onError`, `isReady`, `getRoutes`, `hasRoute`, `resolve`, `back` and `forward` retain their native behavior.

`router.$instance` is the underlying Vue Router instance. Routes registered through `$instance` or native `addRoute` are outside this library's dynamic registration list. Direct changes to the underlying instance can bypass cache synchronization.

## useRouter

```ts
const router = useRouter<META>()
```

Returns the installed router proxy inside component setup. Install a router created by this library to use the extended methods.
