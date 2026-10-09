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
