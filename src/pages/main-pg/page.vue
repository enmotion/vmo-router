<template>
  <div class="flex flex-col flex-grow">
    <div
      class="flex-row flex items-center px-[20px] uppercase italic h-[50px] bg-gray-900 border-b border-gray-800 text-white">
      router 0.0.1
    </div>
    <div class="flex flex-row flex-grow">
      <div class="flex flex-col w-[200px] bg-gray-900 text-xs border-r border-gray-800 text-white">
        <!-- {{ computedAllRouters }} -->
        <span
          v-for="(item, index) in menu"
          :key="index"
          class="h-[40px] flex hover:bg-red-500 flex-row items-center px-[20px] border-b border-gray-800 text-white cursor-pointer duration-300 transition-all"
          @click="routerTo(item)">
          {{ item.label }}
        </span>
      </div>
      <div class="flex flex-col flex-grow bg-gray-950">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </div>
      <div class="flex flex-col w-[200px] bg-gray-900 text-xs border-l border-gray-800 text-white">
        <!-- {{ computedAllRouters }} -->
        <span
          v-for="(router, index) in computedAllRouters"
          :key="index"
          class="h-[40px] flex hover:bg-red-500 flex-row items-center px-[20px] border-b border-gray-800 text-white cursor-pointer duration-300 transition-all">
          {{ router.name }}
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { VmoRouteMenuItemRaw } from '@type'
import { useRouter } from '@lib'
// import type { PropType } from 'vue'

export default defineComponent({
  name: 'main-pg',
  setup(props, context) {
    const router = useRouter()
    const menu: VmoRouteMenuItemRaw<{ label: string }, Record<string, any>>[] = [
      {
        label: 'sample-a:sample-a1',
        to: {
          name: 'sample-a1',
          params: {
            name: 'enmotion'
          },
          template: {
            pageKey: 'SampleA',
            parent: 'main',
            route: {
              path: 'sample-a1/test/:name',
              props: true
            }
          }
        }
      },
      {
        label: 'sample-a:sample-a2',
        to: {
          name: 'sample-a2',
          params: {
            name: 'enmotion2'
          },
          template: {
            pageKey: 'SampleA',
            parent: 'main',
            route: {
              path: 'sample-a2/:name/test',
              props: true
            }
          }
        }
      },
      {
        label: 'sample-b:sample-b1',
        to: {
          name: 'sample-b1',
          template: {
            pageKey: 'SampleB',
            parent: 'main',
            route: {
              path: 'sample-b1'
            }
          }
        }
      }
    ]
    const computedAllRouters = computed(() => {
      return router?.getRoutes?.() ?? []
    })
    function routerTo(item: VmoRouteMenuItemRaw<{ label: string }, Record<string, any>>) {
      router.push(item.to, true)
      console.log(router?.getRoutes?.())
    }
    return {
      computedAllRouters,
      menu,
      routerTo
    }
  }
})
</script>
