---
layout: home
hero:
  name: vmo-router
  text: Organize dynamic routes with templates
  tagline: Manage dynamic pages, reload recovery and KeepAlive on top of Vue Router, with less repeated configuration.
  actions:
    - theme: brand
      text: Why vmo-router
      link: /en/guide/why-vmo-router
    - theme: alt
      text: API reference
      link: /en/api/router
    - theme: alt
      text: GitHub
      link: https://github.com/enmotion/vmo-router
features:
  - title: Page templates
    details: Keep components local and configure route names, paths, parameters and parent relationships.
  - title: Dynamic navigation
    details: Register routes on demand or in batches. Await push and replace to inspect navigation results.
  - title: Reload recovery
    details: Inject persistence callbacks to restore the dynamic route tree when creating the router.
  - title: Page state
    details: Manage KeepAlive names and leave confirmation, with separate handling for route definitions and component state.
---

## Where to start

New users can follow [Getting started](./guide/getting-started.md). Existing integrations should read [Migration and FAQ](./guide/migration.md).

These docs describe the current repository implementation. The published npm package may not yet include the repository fixes; check the release you install.

## Suggested reading order

1. [Why vmo-router](./guide/why-vmo-router.md): value and differences from Vue Router.
2. [Dynamic routes](./guide/dynamic-routes.md), [configuration caching](./guide/caching.md) and [KeepAlive](./guide/keep-alive.md): definitions, recovery and component state.
3. [Scenarios and complete workflow](./guide/scenarios.md): login, page switching, refresh and logout.
4. [Getting started](./guide/getting-started.md) and [leave protection](./guide/leave-protection.md): integration.
5. [Router](./api/router.md), [Store](./api/store.md), [helpers](./api/helpers.md), [types](./api/types.md) and [native APIs](./api/native.md): reference.
