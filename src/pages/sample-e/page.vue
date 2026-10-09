<template>
  <div class="flex-col flex text-white p-[20px] text-xs flex-grow">
    <span class="text-base mb-[10px]">sample-c:{{ name }}</span>
    <input v-model="text" class="bg-[#00000055] p-[10px] w-full rounded border border-gray-800 outline-none" />
    <div
      @click="
        router.push({
          name: 'sample-s2',
          template: {
            pageKey: 'Error404',
            parent: 'main',
            route: {
              path: 'test/404'
            }
          }
        })
      "
      class="mt-[10px] bg-red-500 p-[5px] rounded-sm">
      内部跳转配置
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { useRoute, useRouter } from '@lib'
import { template } from 'lodash'

export default defineComponent({
  name: 'sample-c',
  props: {
    name: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props, context) {
    const text = ref('')
    const route = useRoute()
    const router = useRouter()
    return {
      text,
      route,
      router
    }
  }
})
</script>
