# Persistence and KeepAlive

Persistence saves route definitions for reload recovery. KeepAlive retains component instances and their input state. These are separate mechanisms.

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

## KeepAlive

```ts
router.afterEach((to, _from, failure) => {
  if (!failure && to.meta.keepAlive && typeof to.name === 'string') {
    store.insertKeepAliveName(to.name)
  }
})
store.setKeepAliveMax(3)
```

```vue
<router-view v-slot="{ Component }">
  <keep-alive :include="store.getKeepAliveRouteNames">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

`keepAlive` is an application-defined meta convention: register the hook yourself. The name limit trims by insertion order. Reinserting an existing name does not move it, so this is not LRU. `setKeepAliveMax` takes effect on subsequent insertion rather than immediately trimming the list. Reloading discards component memory.

`store.clearDynamicRouters()` clears persisted definitions only. Use `router.clearRoutes()` to remove registered routes as well.
