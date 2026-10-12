# Scenarios and complete workflow

## A configuration-driven administration app

The backend supplies serializable page definitions; the local template pool holds components and loaders. Validate template keys, paths, names and account ownership before registration. Applications render menus themselves; VmoRouteMenuItemRaw only describes their data.

Place the following code in an application service module after completing getting started. router and store are your initialized singletons, and Report is a local lazy template. This local array represents validated server definitions:

```ts
import type { VmoRouteToRaw } from 'vmo-router'

type Meta = { title?: string; keepAlive?: boolean }
const definitions: VmoRouteToRaw<Meta>[] = [
  { name: 'report-monthly', template: { pageKey: 'Report', route: {
    path: '/reports/monthly/:id', props: true,
    meta: { title: 'Monthly', keepAlive: true }
  } } },
  { name: 'report-yearly', template: { pageKey: 'Report', route: {
    path: '/reports/yearly/:id', props: true,
    meta: { title: 'Yearly', keepAlive: true }
  } } }
]

async function loadAccountPages() {
  await router.reloadRoutes(definitions)
  await router.replace({ name: 'report-monthly', params: { id: '2026-10' } })
}

async function openYearlyReport() {
  await router.push({ name: 'report-yearly', params: { id: '2026' } })
}

async function logout() {
  store.setRouteToLeaveDisabled(false)
  router.clearRoutes()
  await router.replace({ name: 'login' })
}
```

Register login as a static route. If logout needs an unsaved-data confirmation, finish it before disabling leave protection and clearing routes; the example assumes confirmation is complete. The application manages authentication credentials.

## Multiple pages from one template

Two different route names reuse Report without copying page code. With [KeepAlive integration](./keep-alive.md), local input can remain when switching back. Changing id under one name does not create another component name; pages handle data loading and parameter changes themselves.

## Refresh recovery

Configure [synchronous persistence callbacks](./caching.md) before createRouter so definitions are restored before initial navigation. Refreshing /reports/yearly/2026 opens the page selected by the address, not every cached definition. Isolate storage by account and configuration version, and validate identity and definitions before recovery.

## Account switching

Clear the previous account's routes and cache first, switch the storage context, then obtain and reload the next account's definitions. Unrelated static routes remain. clearRoutes(true) also removes login and is unsuitable for normal logout cleanup.

## Unsaved forms

Enable leave protection during editing and disable it after saving. SPA navigation uses the confirmation callback; refresh and close use beforeunload. [Leave protection](./leave-protection.md) covers integration and browser limits. Keeping an instance alive does not save its data.

## Boundaries

The library supplies no menu or tab components, persists no business forms, and does not replace server authorization. Route meta is application-defined data and only affects behavior when the application integrates it.
