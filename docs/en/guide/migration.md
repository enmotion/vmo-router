# Migration and FAQ

## Migrating from the earlier implementation

The repository fixes navigation and caching behavior. These changes may not yet be published to npm.

- `push/replace` returns the actual Promise: await it and handle navigation failures and rejections.
- `addRouter` throws configuration errors synchronously instead of swallowing them and returning false.
- `beforeEach` returns an unregister function and supports async guards. Leave confirmation no longer requires a user-defined beforeEach.
- Cancelled navigation neither persists the new dynamic definition nor disables leave protection.
- `reloadRoutes` prevalidates every definition and parent dependency. Missing parents no longer silently become root routes in batch loading.
- Dynamic registrations and persistence are tracked separately, allowing single-cache mode to clear all registered dynamic pages.
- Pinia is explicitly declared as a peer dependency.

Old caches may contain static routes, outdated template keys or invalid parent relationships. Clear them on upgrade, or migrate by account and configuration version.

## The page returns 404 after reloading

Configure persistence before creating the router. Check restored template keys and parent routes. Single-cache mode cannot automatically restore a dynamic parent tree.

## Input state is not retained between template instances

Check that the component uses a lazy template, its route meta enables keepAlive, the name list is updated after successful navigation, and `<keep-alive :include>` uses the same store. The list matches component names.

## Route parameters are discarded

`params` must match `:parameter` segments in the path. `{ params: { id: '1' } }` requires a path such as `/report/:id`. Use query for ordinary filters.

## Is production reliability fully established?

The core has automated tests and Chromium development-environment checks. Validate other browsers, production browser execution, storage failures, concurrent navigation and tab closing in your application. Coverage does not replace scenario testing.
