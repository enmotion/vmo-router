# KeepAlive page caching

## Purpose and implementation

Route configuration caching makes pages reachable after refresh. KeepAlive retains component instances, local state and input when switching pages. Refresh destroys those instances; these caches serve different purposes.

This library manages a component name list; Vue's `<keep-alive>` owns the instances. The list matches component names, not URLs or route parameters.

Lazy template loaders copy top-level component options and set the component name to the outer dynamic route name. A template used for report-monthly and report-yearly can therefore produce different component names. Synchronous components are not automatically renamed; arrange names to match your include list yourself.

Changing params under the same route name does not create a new instance name. Use different route names and distinguishable paths for independently cached business pages. Tab UI and component key policies remain application decisions.

## Integration

Use lazy templates, mark pages with your application's meta.keepAlive convention, insert names after successful navigation, and bind the list to `<keep-alive :include>`. The meta field alone does not enable caching.


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
