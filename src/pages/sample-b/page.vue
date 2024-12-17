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
import { ElMessageBox } from 'element-plus'

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
    store.setPreventNavigationMethod((disabled, option) => {
      return disabled
        ? new Promise((resolve, reject) => {
            ElMessageBox(option!)
              .then(res => {
                resolve(false)
              })
              .catch(err => {
                reject(true)
              })
          })
        : false
    })
    const isPrevent = ref(false)
    const text = ref('')
    function input(str: string) {
      isPrevent.value = str == 'mod'
      store.setNavigationDisabled(isPrevent.value)
      // isPrevent.value = str == 'enmotion'
      // store.setNavigationDisabled(isPrevent.value)
    }
    return {
      text,
      isPrevent,
      input
    }
  }
})
</script>
