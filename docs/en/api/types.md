# Types and helpers

## Types

| Export | Purpose |
| --- | --- |
| `Lazy<T>` | `() => Promise<T>` |
| `VmoRouteRecordRaw<META>` | Page template with typed meta |
| `VmoRouteToRaw<META>` | Named destination with optional template configuration |
| `VmoRouteMenuItemRaw<ITEM, META>` | Extended menu fields, destination and recursive children |
| `VmoNavigationGuard` | Return-value guard receiving `to, from`; supports Promises |
| `VmoProxyRouter<META>` | Extended router instance |
| `RouterStore` | Namespace for store, persistence callbacks and state types |

```ts
import type { VmoRouteToRaw } from 'vmo-router'
type Meta = { title?: string; keepAlive?: boolean }
const to: VmoRouteToRaw<Meta> = {
  name: 'report',
  template: { pageKey: 'Report', route: { path: '/reports/:id', meta: { title: 'Report' } } },
  params: { id: '2026' }
}
```

## loadPageTemplateByImport

Accepts a module map and returns a template pool. The file's immediate parent folder becomes a PascalCase key: `sample-a` becomes `SampleA`. Supports default-export modules and eager/default glob imports. Duplicate normalized keys throw.

## validateVmoRouterToRaw

```ts
validateVmoRouterToRaw(to, templates) // boolean
```

Checks the name, template override path and template existence. It does not check name/path collisions with a router, nor replace complete validation of backend configuration.

## addRouterWithVmoRouterToRaw

```ts
addRouterWithVmoRouterToRaw(to, templates, routerInstance?) // void
```

Merges configuration and optionally registers it on the native instance. The name comes from `to.name`. Existing parents cause leading path slashes to be removed; otherwise registration is at the root. Throws when there is no usable component, named view, redirect or children. Does not update the store or return a generated record. Prefer the proxy's `addRouter` for normal application use.

## Vue Router re-exports

`useRoute`, `createMemoryHistory`, `createWebHashHistory`, `createWebHistory`, `createRouterMatcher`, `isNavigationFailure`, `loadRouteLocation`, `onBeforeRouteLeave`, `onBeforeRouteUpdate`, `useLink`, `parseQuery` and `stringifyQuery`.

See [Leave protection](../guide/leave-protection.md) for `usePreventBrowserBeforeunloadBehavior`.
