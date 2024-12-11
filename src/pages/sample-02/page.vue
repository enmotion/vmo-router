<template>
  <div class="flex-col bg-red-500 grow-1">sample-02</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'sample-02',
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
