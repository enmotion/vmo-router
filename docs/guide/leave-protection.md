# 离开保护

## SPA 内部导航

配置确认方法，在页面未保存时启用保护：

```ts
store.setConfirmToLeaveMethod(async (_meta) => {
  return window.confirm('当前页面尚未保存，确认离开？')
})
store.setRouteToLeaveDisabled(true)
```

确认函数接收离开页面的 meta，可返回布尔值或 `Promise<boolean>`。默认确认方法返回 `true`，因此仅设置开关不会自动出现弹窗。

内部守卫独立于用户的 `beforeEach`。返回 `false`、确认函数抛错或后续守卫取消时仍保留保护。成功导航后重置开关。完成保存而无需导航时，由页面主动关闭开关。

## 浏览器刷新与关闭

在根组件中注册生命周期监听：

```vue
<script setup lang="ts">
import { usePreventBrowserBeforeunloadBehavior } from 'vmo-router'
usePreventBrowserBeforeunloadBehavior(false)
</script>
```

```ts
store.setBrowserBeforeunloadDisabled(true)
```

任一个保护开关为 true 都会触发 `beforeunload` 处理。该函数需要在组件 setup 中使用，并在组件卸载时移除监听。

浏览器决定是否展示原生提示，通常要求先有用户交互，并使用浏览器自己的提示文本。不能保证关闭总能阻止，也不能在此阶段等待自定义异步弹窗。SPA 的前进后退由路由守卫处理。
