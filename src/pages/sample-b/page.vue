<template>
  <div class="flex-col flex text-white p-[20px] text-xs flex-grow">
    <span class="text-base mb-[10px]">sample-b:{{ name }} {{ text }}</span>
    {{ isPrevent }}
    <input
      v-model="text"
      class="bg-[#00000055] p-[10px] w-full rounded border border-gray-800 outline-none"
      @input="input(text)" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { useRouterStore } from '@lib/store'

export default defineComponent({
  name: 'sample-b',
  props: {
    name: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props, context) {
    const store = useRouterStore()
    const isPrevent = ref(false)
    const text = ref('')
    function input(str: string) {
      isPrevent.value = str == 'mod'
      store.setRouteToLeaveDisabled(isPrevent.value)
    }
    return {
      text,
      isPrevent,
      input
    }
  }
})
</script>
