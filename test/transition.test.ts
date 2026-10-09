import { afterEach, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import Transition from '../src/componets/transition/vmo-transition/component.vue'

afterEach(() => vi.useRealTimers())
it('completes enter animations and releases measurement DOM after page replacement', async () => {
  vi.useFakeTimers()
  const key = ref('first')
  const wrapper = mount(defineComponent({
    setup: () => () => h(Transition, { duration: { enter: 20, leave: 20 } }, {
      default: () => h('div', { key: key.value }, [h('input'), key.value])
    })
  }), { global: { stubs: { transition: false } }, attachTo: document.body })
  try {
    key.value = 'second'
    await nextTick()
    await vi.advanceTimersByTimeAsync(200)
    await nextTick()
    expect(wrapper.findAll('input')).toHaveLength(1)
    expect(wrapper.find('.fade-enter-active').exists()).toBe(false)
    expect(wrapper.text()).toContain('second')
    key.value = 'third'
    await nextTick()
    await vi.advanceTimersByTimeAsync(200)
    await nextTick()
    expect(wrapper.findAll('input')).toHaveLength(1)
    expect(wrapper.text()).toContain('third')
  } finally { wrapper.unmount() }
})
