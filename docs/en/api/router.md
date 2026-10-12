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

### Route cleanup

`removeRoute(name)` uses Vue Router's parent/child relationships to remove the target route, its descendants and aliases. It also removes their dynamic registration definitions, persisted route definitions and keep-alive names. If the target name does not exist, its cached definition and keep-alive name are still removed.

`clearRoutes()` applies this cleanup to managed dynamic routes while retaining unrelated static routes. `clearRoutes(true)` clears every route, cached dynamic definition and keep-alive name. Children added through native APIs under a removed parent are also removed with that parent.

`reloadRoutes(routes)` clears old dynamic routes by default, then registers and persists the new definitions. `reloadRoutes(routes, false)` appends definitions without clearing existing routes. Cleanup and registration do not navigate; call `push/replace` in your application to change the current page.

Cleanup does not resolve route locations, so removing routes with required parameters does not require `params`. An unrelated route such as `/project-home/:id/:name` cannot block cleanup because its parameters are missing. Named navigation and calls to `resolve()` still require mandatory parameters. There is no need to make parameters optional or manually clear browser storage.

These cleanup behaviors do not change the methods' parameters or return types.

### Navigation and guards

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

## Detailed contracts

### createRouter(options, templates, store?)

Synchronously returns VmoProxyRouter. options is native RouterOptions with history and static routes; templates maps keys to local records; store is optional. Without a store, dynamic registration and cleanup remain available but persistence, KeepAlive lists and store leave protection are absent. Creation reads cached definitions, restores synchronously and writes them back. Invalid definitions, duplicate names and missing/circular parents throw synchronously; storage exceptions may also fail creation.

### `useRouter<META>`()

Takes no arguments and retrieves the injected proxy inside component setup. It creates no router and changes no state. Install with app.use(router) first. The generic describes page meta; it does not turn a native router into a proxy.

### push(to) / replace(to)

Accept strings, native path objects, named targets or VmoRouteToRaw. Return `Promise<NavigationFailure | void | undefined>`. An unknown named target is registered from its template before navigation. Existing names navigate without reapplying template overrides. replace replaces the current history entry; push adds one.

Successful navigation persists managed targets with resolved params/query/hash and disables SPA leave protection. Canceled or duplicate navigation can return NavigationFailure; invalid registration, missing required parameters, guards or loaders can reject. Registration happens first and is not rolled back on cancellation.

```ts
const failure = await router.push({ name: 'report-monthly', params: { id: '2026-10' } })
if (isNavigationFailure(failure)) return
await router.replace('/login')
```

### addRouter(to)

Synchronously returns void. New definitions require a nonempty name, valid template.pageKey and template.route.path. Deep-merges the template, registers the result and tracks it without navigation or immediate persistence. Duplicate names and invalid definitions throw. A missing parent falls back to root registration for single additions; use reloadRoutes for strict parent dependencies.

```ts
router.addRouter({ name: 'report', template: {
  pageKey: 'Report', route: { path: '/report/:id' }
} })
```

### reloadRoutes(routes, needClear = true)

Accepts a VmoRouteToRaw array and returns `Promise<void>`. Replaces managed registrations by default; false appends. Both register and persist without navigation. Prevalidates templates and names and orders parent dependencies; input order is arbitrary. Invalid definitions, conflicts and missing/circular parents reject without changing live routes during prevalidation. Prevalidation does not call persistence; storage failures during actual writes do not guarantee rollback. Single-cache mode overwrites on each write, leaving only the last definition persisted.

### removeRoute(name) / clearRoutes(all = false)

Both synchronously return void. name accepts string/symbol; prefer strings for persistence and KeepAlive. removeRoute can remove static or dynamic targets. Native removal handles descendants and aliases; removed names then synchronize definitions and lists. clearRoutes starts with managed dynamic registrations by default; all=true clears every route. Independent native addRoute registrations are outside the list, but descendants of a removed parent are removed too. Setter exceptions can throw synchronously after routes have already been removed. Cleanup neither navigates nor disables leave protection.

```ts
router.removeRoute('report')
router.clearRoutes()
await router.replace({ name: 'login' })
```

### beforeEach(guard)

Accepts VmoNavigationGuard and returns an unregister function. Receives to/from without next. Return true/undefined to allow, false to cancel, or a location to redirect; promises are supported. Errors enter the navigation error flow. Registering or unregistering does not navigate or persist. The internal store confirmation guard is registered independently during creation.

### $instance and native methods

$instance exposes the underlying Router for native integrations. Direct mutations can bypass registration tracking and cache synchronization. Its addRoute, like the proxy's native addRoute, differs from addRouter. Other native methods and reactive currentRoute remain available; see [native APIs](./native.md) for re-exports.
