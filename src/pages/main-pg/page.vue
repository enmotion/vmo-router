<template>
  <div class="flex flex-col flex-grow">
    <div class="flex-col h-[50px] bg-gray-900 border-b border-gray-800"></div>
    <div class="flex flex-row flex-grow">
      <div class="flex flex-col w-[200px] bg-gray-900 text-xs border-r border-gray-800 text-white">
        <!-- {{ computedAllRouters }} -->
        <span
          v-for="(router, index) in computedAllRouters"
          :key="index"
          class="h-[40px] flex hover:bg-red-500 flex-row items-center px-[20px] border-b border-gray-800 text-white">
          {{ router.name }}
        </span>
      </div>
      <div class="flex flex-col flex-grow">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import type { PropType } from 'vue'

export default defineComponent({
  name: 'main-pg',
  setup(props, context) {
    const router = useRouter()
    const computedAllRouters = computed(() => {
      return router?.getRoutes?.() ?? []
    })
    return {
      computedAllRouters
    }
  }
})
</script>
