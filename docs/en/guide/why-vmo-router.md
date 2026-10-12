# Why vmo-router

## The problem it solves

An administration application often receives menu or page definitions after login. Report components live locally, while configuration determines available pages, paths and titles. One component may serve several business pages. The application also needs to restore dynamic routes after refresh, retain input while switching pages, and remove the previous account's routes on logout.

Vue Router already provides matching, dynamic registration, navigation and guards. vmo-router connects local templates, dynamic definitions, recovery and cleanup into one workflow, reducing repeated application code.

## Compared with native Vue Router

| Requirement | Native Vue Router | vmo-router |
| --- | --- | --- |
| Map server configuration to local components | Build a mapping and RouteRecordRaw objects | Select a template key and deep-merge instance overrides |
| Navigate to an unregistered name | Call addRoute before push | Include a template in push/replace to register on demand |
| Restore dynamic routes after refresh | Save definitions and rebuild routes yourself | Supply synchronous getter/setter callbacks; restore during createRouter |
| Clean up on logout | Track registrations and synchronize caches yourself | Track dynamic registrations independently and clean descendants and caches |
| Cache different pages from one template | Arrange component names and include yourself | Name lazy components after route instances and manage an include list |
| Confirm leaving unsaved pages | Implement guards and refresh listeners | Use confirmation callbacks, switches and lifecycle listeners |

Dynamic registration and lazy loading come from Vue Router; component instance caching comes from Vue. This library organizes configuration and synchronizes state around those capabilities.

## When it fits

It fits Vue 3 administration applications driven by menu configuration, multiple business pages sharing templates, and dynamic pages that must survive refresh. Components remain local, definitions can be serialized, and registration, navigation, recovery and cleanup use the same definition.

Simple applications with fixed pages can use Vue Router directly. Menu rendering, tab UI, backend authorization, account isolation and business data persistence remain application responsibilities. The library does not execute arbitrary server-provided component code, or automatically implement authorization and KeepAlive from meta fields.

Read [dynamic routes](./dynamic-routes.md), [route configuration caching](./caching.md) and [KeepAlive](./keep-alive.md), or run the minimal [getting started](./getting-started.md) example.
