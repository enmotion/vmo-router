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
        <div class="text-xs text-white flex-row flex">
          <span
            v-for="(item, index) in store.getKeepAliveRouteNames"
            :key="item + index"
            class="h-[30px] px-[20px] flex flex-row items-center border cursor-pointer hover:bg-red-600"
            @click="store.removeKeepAliveNames(item)">
            {{ item }}
          </span>
        </div>
        <router-view v-slot="{ Component }">
          <vmo-transition
            name="falling"
            mode="out-in"
            class="flex-grow flex-col overflow-hidden"
            :duration="{ enter: 300, leave: 200 }"
            :timing="{ enter: 'ease-out', leave: 'ease-in' }">
            <keep-alive :include="store.getKeepAliveRouteNames">
              <component :is="Component"></component>
            </keep-alive>
          </vmo-transition>
        </router-view>
      </div>
      <div class="flex flex-col w-[200px] bg-gray-900 text-xs border-l border-gray-800 text-white">
        <!-- {{ computedAllRouters }} -->

        <span
          v-for="(router, index) in routers"
          :key="index"
          class="h-[40px] flex hover:bg-red-500 flex-row items-center px-[20px] border-b border-gray-800 text-white cursor-pointer duration-300 transition-all">
          {{ router.name }}
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { RouteRecord } from 'vue-router'
import { defineComponent, computed, ref, KeepAlive } from 'vue'
import { VmoRouteMenuItemRaw } from '@type'
import { useRouter, useRoute } from '@lib'
import { useRouterStore } from '@lib/store'
import VmoTransition from '../../componets/transition/vmo-transition/index.cp'

// import type { PropType } from 'vue'

export default defineComponent({
  name: 'main-pg',
  components: { VmoTransition },
  setup(props, context) {
    const router = useRouter()
    const store = useRouterStore()
    store.setKeepAliveMax(3)
    const routers = ref(router?.getRoutes?.() ?? ([] as RouteRecord[]))
    const menu: VmoRouteMenuItemRaw<{ label: string }, Record<string, any>>[] = [
      {
        label: 'unknow',
        to: {
          name: 'main'
        }
      },
      {
        label: 'sample-a',
        to: {
          name: 'sample-a'
        }
      },
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
              props: true,
              meta: {
                keepAlive: false
              }
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
      },
      {
        label: 'sample-c:sample-c1',
        to: {
          name: 'sample-c1',
          template: {
            pageKey: 'SampleC',
            parent: 'main',
            route: {
              path: 'sample-c1'
            }
          }
        }
      }
    ]
    function routerTo(item: VmoRouteMenuItemRaw<{ label: string }, Record<string, any>>) {
      console.log(item.to)
      router.push(item.to)
      routers.value = router?.getRoutes?.() ?? []
      // router.back()
      console.log(router?.getRoutes?.())
    }
    return {
      routers,
      store,
      menu,
      routerTo
    }
  }
})
</script>
