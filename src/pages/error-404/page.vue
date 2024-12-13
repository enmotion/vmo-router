<template>
  <div class="flex-col flex items-center justify-center bg-gray-900 text-white p-[20px] text-xs flex-grow">
    <div class="p-[20px] border" @click="router.push({ name: 'main' })">Error404</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from '@lib'
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
    const router = useRouter()
    return {
      text,
      router
    }
  }
})
</script>
