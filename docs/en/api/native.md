# Native Vue Router APIs

## Preserved instance capabilities

The proxy retains currentRoute, options, install and native addRoute, hasRoute, getRoutes, resolve, afterEach, beforeResolve, onError, isReady, back, forward and go. push, replace, beforeEach, removeRoute and clearRoutes are extended; addRouter and reloadRoutes are new. See [Router API](./router.md).

resolve only resolves a location; push/replace navigate. Named resolution and navigation still require mandatory params. Native addRoute removal callbacks and direct $instance mutations do not automatically synchronize managed caches.

## Re-exported functions

The following functions are exported unchanged from the installed vue-router. Its version determines their parameters, return values and limitations:

| Export | Purpose |
| --- | --- |
| createMemoryHistory | Memory history for tests or SSR |
| createWebHashHistory | Hash history |
| createWebHistory | HTML5 history; configure server fallbacks |
| createRouterMatcher | Low-level matcher, generally unnecessary for ordinary integration |
| useRoute | Current reactive route inside setup |
| useLink | Composable support for custom links |
| isNavigationFailure | Identify navigation failures, optionally by type |
| loadRouteLocation | Load target components; returns a Promise |
| onBeforeRouteLeave / onBeforeRouteUpdate | Component leave or update guards |
| parseQuery / stringifyQuery | Convert query strings and objects |

createRouter/useRouter are library extensions, not unchanged re-exports. Not all Vue Router types are re-exported: import RouterOptions, RouteRecordRaw and NavigationFailure from vue-router. Consult the installed dependency's declarations for exact native signatures rather than maintaining a second copy here.
