# Leave protection

## Navigation within the SPA

Configure confirmation and enable protection when a page has unsaved changes:

```ts
store.setConfirmToLeaveMethod(async (_meta) => {
  return window.confirm('This page has unsaved changes. Leave anyway?')
})
store.setRouteToLeaveDisabled(true)
```

The callback receives the departing page's meta and returns a boolean or `Promise<boolean>`. The default callback returns `true`; enabling the flag alone does not display a dialog.

The internal guard runs independently of user-defined `beforeEach` hooks. Protection remains enabled when confirmation returns `false`, throws, or a later guard cancels navigation. Successful navigation resets the flag. After saving without navigating, clear the flag from the page.

## Browser reload and close

Register the lifecycle listener in the root component:

```vue
<script setup lang="ts">
import { usePreventBrowserBeforeunloadBehavior } from 'vmo-router'
usePreventBrowserBeforeunloadBehavior(false)
</script>
```

```ts
store.setBrowserBeforeunloadDisabled(true)
```

Either protection flag being true activates `beforeunload` handling. Call the composable inside component setup; it removes the listener when the component unmounts.

The browser controls whether it displays a native prompt. It usually requires prior user interaction and uses its own message. Closing cannot always be prevented, and a custom asynchronous dialog cannot be awaited here. Route guards handle back/forward navigation within the SPA.
