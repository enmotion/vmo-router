# Type reference

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

## VmoRouteToRaw fields

| Field | Type and requirement | Purpose |
| --- | --- | --- |
| name | string/symbol; required for new registrations | Global route name; use strings for persistence |
| params | Native named-navigation params, optional | Path placeholders; supply required values for navigation |
| query / hash | Optional native navigation fields | Query and fragment, not template selection |
| template | Required for new registrations; optional for existing names | Local template selection and overrides |
| template.pageKey | Required string | Template key, such as Report |
| template.parent | Optional string | Parent route name, not path |
| template.route | Required `Omit<VmoRouteRecordRaw<META>, 'name'>` | Deep overrides; new registrations need nonempty path |

The type extends native relative navigation. Optional name/template in the type does not mean any object can register a route. New registrations must pass runtime checks; existing names only need normal navigation fields.

## Template and menu types

`VmoRouteRecordRaw<META>` is based on RouteRecordRaw with meta and component replaced. META constrains meta; component accepts RouteComponent or `Lazy<RouteComponent>`. Other record fields such as path, children, props, redirect and components remain.

`VmoRouteMenuItemRaw<ITEM, META>` preserves business fields from ITEM while replacing to and children. Both are optional; children recursively uses the same generics. The type does not render menus, register routes or implement authorization.

```ts
import type { VmoRouteMenuItemRaw } from 'vmo-router'
type Menu = VmoRouteMenuItemRaw<{ title: string }, { keepAlive?: boolean }>
const menu: Menu = { title: 'Reports', children: [{
  title: 'Monthly', to: { name: 'report-monthly', params: { id: '2026-10' } }
}] }
```

## Instance, guard and store types

`VmoProxyRouter<META>` retains native Router fields, replaces extended methods and adds $instance: Router. VmoNavigationGuard receives native RouteLocationNormalized to/from and returns NavigationGuardReturn or its Promise, without next.

`RouterStore.CacherMethods<RouteToRaw>` defines getter: () => RouteToRaw[] and setter: (routes: RouteToRaw[]) => void. RouterStore.State describes state; RouterStore.PiniaStore is the useRouterStore return type; RouterStore.ExtractRouteInfoType extracts the definition's meta generic. Callbacks are synchronous.

Types only provide compile-time checks; validate runtime inputs. See [helpers](./helpers.md) and [native APIs](./native.md).
