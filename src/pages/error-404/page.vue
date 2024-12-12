<template>
  <div class="flex-col bg-gray-900 text-white p-[20px] text-xs flex-grow">Error404</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'error-404',
  props: {
    name: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props, context) {
    const text = ref('')
    return {
      text
    }
  }
})
</script>
