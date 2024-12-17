<script setup lang="ts">
import { usePreventBrowserBehavior } from '@lib/lib'
usePreventBrowserBehavior(false)
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"></component>
    </keep-alive>
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
