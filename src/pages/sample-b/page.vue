<template>
  <div class="flex-col flex text-white p-[20px] text-xs flex-grow">
    <span class="text-base mb-[10px]">sample-b:{{ name }}</span>
    <input v-model="text" class="bg-[#00000055] p-[10px] w-full rounded border border-gray-800 outline-none" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { usePreventBrowserBehavior } from '@lib/lib'

export default defineComponent({
  name: 'sample-b',
  props: {
    name: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props, context) {
    const { isPrevent } = usePreventBrowserBehavior({
      title: '测试',
      message: 'AAA'
    })
    isPrevent.value = true
    const text = ref('')
    return {
      text
    }
  }
})
</script>
