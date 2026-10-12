# Route management and configuration caching

## Three separate kinds of state

| State | Contents and owner | Lifecycle and purpose |
| --- | --- | --- |
| Dynamic registration list | A Map inside the router closure containing managed definitions | Memory only; tracks all registrations for cache writes and cleanup |
| Route configuration cache | A Pinia definition array connected to storage by getter/setter | Saves definitions and params/query/hash for rebuilding routes after refresh |
| KeepAlive name list | A Pinia array of component name strings | Filters Vue's include; Vue owns the cached component instances |

Registrations and cached definitions must be separate. addRouter may register without navigating, canceled navigation may leave registrations, and single-cache mode only retains the latest written definition. clearRoutes can still remove all managed registrations.

## Registration and recovery lifecycle

```text
Local template + dynamic definition
  → Register in Vue Router and the dynamic list
  → Successful navigation: update cache and call setter
  → Refresh: configure getter/setter first
  → createRouter reads cache and restores routes synchronously
  → Initial navigation uses the current address
```

addRouter does not immediately persist. The internal afterEach updates params, query and hash after successful navigation to a managed named instance; static routes do not write dynamic definitions. reloadRoutes persists definitions during registration without navigation. Recovery during createRouter also writes definitions, so setters must tolerate repeated writes.

Restoring routes does not open every cached page: the current address still determines initial navigation. Definitions do not save component code, form input or API data; applications must restore business state separately.

Removal synchronizes the registration list, cached definitions and KeepAlive names using the names actually removed. It does not resolve locations or need required params. Storage callbacks are synchronous; applications must handle exceptions, and external storage failures do not guarantee rollback.

## Configure persistence

Set cache callbacks before calling `createRouter`:

```ts
store.setCacheMethods({
  getter: () => {
    try {
      const routes = JSON.parse(sessionStorage.getItem('vmo:routes') ?? '[]')
      return Array.isArray(routes) ? routes : []
    } catch {
      return []
    }
  },
  setter: routes => {
    try {
      sessionStorage.setItem('vmo:routes', JSON.stringify(routes))
    } catch (error) {
      console.warn('Failed to persist routes', error)
    }
  }
})
```

Validate restored definitions against the current templates, account and configuration version. Checking for an array only validates its outer shape. Invalid definitions may cause `createRouter` to throw synchronously.

Router creation restores definitions synchronously so the initial navigation can resolve them. `sessionStorage` supports reloads in the same tab. `localStorage` persists across sessions; isolate accounts and clear stale data yourself. Callbacks support synchronous reads and writes only.

## Single and multiple route caches

```ts
store.setMutipleCatch(true) // Default: retain multiple dynamic definitions.
store.setMutipleCatch(false) // The next write retains one definition.
```

Single-cache mode affects persistence, not other routes already registered. Updating a cached name replaces its previous params, query and hash. Static navigation does not write dynamic definitions.

Persisting only a child definition cannot restore its dynamic parent tree. For nested dynamic routes, use multiple-cache mode or define the parent statically.


For component instance retention, read [KeepAlive page caching](./keep-alive.md).
