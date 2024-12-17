<script setup lang="ts">
import VmoTransition from './componets/transition/vmo-transition/index.cp'
import { usePreventBrowserBeforeunloadBehavior } from '@lib/lib'
usePreventBrowserBeforeunloadBehavior(true)
</script>

<template>
  <router-view v-slot="{ Component }">
    <vmo-transition
      name="zoomin"
      mode="out-in"
      class="flex-grow flex-col overflow-hidden"
      :duration="{ enter: 300, leave: 200 }"
      :timing="{ enter: 'ease-out', leave: 'ease-in' }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </vmo-transition>
  </router-view>
</template>

<style>
html,
body {
  height: 100%;
  display: flex;
  flex-grow: 1;
}
</style>
