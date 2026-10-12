# Dynamic routes and templates

## How definitions become routes

The template pool maps pageKey to local RouteRecordRaw objects; it is not the registered route table. template.route is deep-merged with a template, the outer name determines the final name, and template.parent selects the parent by name. params/query/hash are navigation data, not template overrides.

addRouter only registers; push/replace can register before initial navigation; reloadRoutes registers in batches and writes the cache. Navigating to existing names does not merge templates again. To change paths or meta, remove and register again, or reload definitions.

## Templates and instances

The template pool holds local route records. Dynamic configuration selects a template with `template.pageKey` and deep-merges overrides from `template.route`. The resulting route name comes from the outer `name` field.

```ts
const destination = {
  name: 'report-yearly',
  params: { id: '2026' },
  template: {
    pageKey: 'Report',
    route: { path: '/yearly/:id', props: true, meta: { keepAlive: true } }
  }
}
await router.push(destination)
```

Provide a non-empty `name`, `template.route.path` and a valid template key. For persistence, use string names and JSON-serializable configuration; keep components and loader functions in local templates.

## Multiple instances

One template can produce routes with different names and paths. Lazy page loaders copy the component's top-level options and assign the instance name, allowing KeepAlive to distinguish pages by name.

Synchronous components are not automatically renamed. Prefer `() => import('./page.vue')` when caching multiple instances of the same template.

## Parent and child routes

```ts
await router.reloadRoutes([
  { name: 'child', template: { pageKey: 'Report', parent: 'workspace', route: { path: 'report/:id' } } },
  { name: 'workspace', template: { pageKey: 'Layout', route: { path: '/workspace' } } }
])
```

The parent page must render `<router-view />`. Batch reloads accept any parent/child order. Missing parents, circular dependencies and duplicate names reject the reload; prevalidation does not change the current route table.

For a single `addRouter` or initial dynamic `push`, register the parent first. If it is absent, the underlying loader registers a root route. Do not rely on that fallback for nested layouts.

## Registration, navigation and cleanup

- `addRouter(to)` registers synchronously without navigating or immediately persisting.
- `push/replace` registers an unknown target name from its template. An existing name navigates directly without reapplying template overrides.
- Successful navigation persists the dynamic definition. Cancellation may leave a registered route that has not been persisted.
- `reloadRoutes(routes)` replaces managed dynamic routes and writes their definitions to the cache. Pass `false` as the second argument to append.
- `clearRoutes()` removes all managed dynamic routes while retaining static routes.
- Clear old routes on logout or account changes before loading the new user's configuration.

Removing a dynamic parent also removes its descendants and aliases, synchronizing their dynamic registration definitions, persisted route definitions and keep-alive names. Unrelated static routes remain registered.

Cleanup of routes with required parameters does not require `params`, and other parameterized routes cannot block cleanup. Normal navigation still requires mandatory parameters. There is no need to make parameters optional or manually clear browser storage. Cleanup does not navigate; for example, explicitly navigate to a retained static login route after logging out:

```ts
router.clearRoutes()
await router.replace({ name: 'login' }) // Register login in the static route table.
```

See [Router API](../api/router.md#route-cleanup) for the full cleanup scope and return types.

Route registration does not establish authorization. The backend must enforce access checks for each business request.
