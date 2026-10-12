# Store API

## useRouterStore

```ts
const store = useRouterStore<VmoRouteToRaw<Meta>>()
```

Call after installing Pinia. The store ID is `router`; state is shared within the same Pinia instance. Avoid using that ID for another application store.

## Getters

| Getter | Meaning |
| --- | --- |
| `getCachedRoutes` | In-memory definitions first, otherwise the injected getter; defaults to an empty array |
| `getKeepAliveRouteNames` | KeepAlive name list |
| `getMutipleCatch` | Whether to persist multiple dynamic routes; defaults to true |
| `getBrowserBeforeunloadDisabled` | Reload/close protection; defaults to false |
| `getRouteToLeaveDisabled` | SPA leave protection; defaults to false |
| `getKeepAliveMax` | Name limit; unset or 0 means unlimited |
| `getCacheMethod` | Current persistence callbacks |
| `getConfirmToLeaveMethod` | Current confirmation callback |

## Actions

| Action | Behavior |
| --- | --- |
| `insertCachedRoute(to)` | Insert or update by name and invoke the setter |
| `removeCachedRoute(name)` | Remove the definition and invoke the setter; string/symbol names supported |
| `clearDynamicRouters()` | Clear definitions and invoke the setter without removing registered routes |
| `setCacheMethods({ getter, setter })` | Set synchronous persistence callbacks |
| `setMutipleCatch(boolean)` | Change persistence mode for the next write |
| `setKeepAliveName(string \| string[])` | Replace the name list |
| `insertKeepAliveName(string \| string[])` | Insert unique names and trim to the limit |
| `removeKeepAliveName(string \| string[])` | Remove names from the list |
| `setKeepAliveMax(number = 0)` | Round the absolute value; trim on subsequent insertion |
| `setBrowserBeforeunloadDisabled(boolean)` | Set reload/close protection |
| `setRouteToLeaveDisabled(boolean)` | Set SPA leave protection |
| `setConfirmToLeaveMethod(fn)` | Set the confirmation callback receiving the departing page's meta |

Use string route names for serializable cache definitions. Multiple routers sharing this store share name lists and protection flags; the primary usage is one router per application.

## Default state

| State | Default | Meaning |
| --- | --- | --- |
| cachedRoutes | null | Falls back to storage getter or []; after writing, the memory array takes priority |
| cacheMethods | undefined | No default localStorage/sessionStorage choice |
| mutipleCatch | true | Retain multiple definitions; false retains only the current write |
| keepAliveRouteNames | [] | Component include list, not instances |
| keepAliveMax | undefined | Unset or 0 means unlimited |
| routeToLeaveDisabled | false | true enables SPA leave confirmation |
| browserBeforeunloadDisabled | false | true enables refresh/close protection |
| confirmToLeaveMethod | async () => true | Allows leaving by default; no automatic dialog |

All actions synchronously return void; the registered confirmation callback may itself return a Promise. Getters only read state and never register routes.

| Action | Parameter / default | Side effects and limits |
| --- | --- | --- |
| insertCachedRoute | to: RouteToRaw | Update/append by name in multi mode; replace the array in single mode; always call setter |
| removeCachedRoute | name: string or symbol | Filter definitions and call setter even for missing names |
| clearDynamicRouters | None | Set cachedRoutes=[] and call setter; do not clear registrations or KeepAlive |
| setCacheMethods | Synchronous getter/setter | Set callbacks only; no immediate read, write or restore; existing memory arrays take priority |
| setMutipleCatch | boolean | Change future writes without trimming current definitions |
| setKeepAliveName | string or string[] | Replace directly without deduplication or max trimming |
| insertKeepAliveName | string or string[] | Deduplicate then retain the last max names in insertion order; duplicates do not move |
| removeKeepAliveName | string or string[] | Remove names only, not routes or persisted definitions |
| setKeepAliveMax | number=0 | Math.round(Math.abs(max)); applies on later inserts |
| setRouteToLeaveDisabled | boolean | Set SPA flag; successful navigation resets it to false |
| setBrowserBeforeunloadDisabled | boolean | Set browser flag; lifecycle listener must also be installed |
| setConfirmToLeaveMethod | (meta) => boolean or `Promise<boolean>` | Replace callback; receives the departing page's meta |

Setters should synchronously handle storage errors. Actions do not catch them and may throw after memory state changes. An empty array prevents getter fallback; account switching normally clears routes and explicitly loads new definitions. Replacing the getter alone does not automatically restore routes.

```ts
store.setKeepAliveMax(5)
store.insertKeepAliveName(['report-monthly', 'report-yearly'])
store.setConfirmToLeaveMethod(async () => window.confirm('Discard unsaved changes?'))
store.setRouteToLeaveDisabled(true)
// After saving:
store.setRouteToLeaveDisabled(false)
```

router.removeRoute/clearRoutes synchronize multiple states. Individual store actions affect their own state only; clearDynamicRouters is not a substitute for removing registered routes.

## Getter return types

getCachedRoutes returns RouteToRaw[]; getKeepAliveRouteNames returns string[]; getMutipleCatch, getBrowserBeforeunloadDisabled and getRouteToLeaveDisabled return boolean; getKeepAliveMax returns number | undefined; getCacheMethod returns `CacherMethods<RouteToRaw>` | undefined; getConfirmToLeaveMethod returns the confirmation callback or undefined.
