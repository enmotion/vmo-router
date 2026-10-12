# Helper functions

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

## Signatures and side effects

### loadPageTemplateByImport(templates)

```ts
loadPageTemplateByImport(templates: Record<string, unknown>): Record<string, RouteRecordRaw>
```

Synchronously returns a template pool without registration, store writes or navigation. Input paths must identify a direct parent folder, converted to PascalCase for the key. Values can be default-export wrappers or records. Duplicate keys throw; individual templates are not fully validated. Lazy component loading depends on component; eager glob loads template declarations only.

```ts
const templates = loadPageTemplateByImport(
  import.meta.glob('./**/*.pg.ts', { eager: true, import: 'default' })
)
```

### validateVmoRouterToRaw(to, templates)

```ts
validateVmoRouterToRaw<META>(
  to: VmoRouteToRaw<META>,
  templates: Record<string, Partial<RouteRecordRaw>>
): boolean
```

Returns whether basic fields pass nonempty checks. It does not register, navigate or mutate caches. true does not guarantee registration: authorization, duplicate paths, parents, complete data shape and usable components are not checked. Validate external definitions before application use.

### addRouterWithVmoRouterToRaw(to, templates, routerInstance?)

```ts
addRouterWithVmoRouterToRaw<META>(
  to: VmoRouteToRaw<META>,
  templates: Record<string, RouteRecordRaw>,
  routerInstance?: Router
): void
```

Synchronously merges templates and overrides and assigns the outer name. Calls native addRoute when routerInstance is supplied. Without it, processes and checks definitions but returns no generated object. Invalid definitions or absence of components, named views, redirect and children throw. It does not track managed registrations, persist or manage KeepAlive. Prefer addRouter for normal use.

### usePreventBrowserBeforeunloadBehavior(disabled = true, message = '')

```ts
usePreventBrowserBeforeunloadBehavior(disabled?: boolean, message?: string): void
```

Call inside component setup; returns void. Immediately sets store.browserBeforeunloadDisabled. Despite the parameter name, true enables protection. Installs beforeunload on mount and removes it on unmount. Either the browser or SPA protection flag enables event cancellation and returnValue. Outside setup it only sets the flag, without installing a listener; missing Pinia throws. Browsers may replace message with fixed text. It cannot await asynchronous confirmation or guarantee a prompt. It changes no routes or caches.

```ts
// Install in root component setup, initially without browser protection.
usePreventBrowserBeforeunloadBehavior(false)
// During editing: store.setBrowserBeforeunloadDisabled(true)
```

See [leave protection](../guide/leave-protection.md) for SPA confirmation.
