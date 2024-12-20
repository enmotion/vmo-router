import { mergeAll } from 'ramda'
import { createRouter, createWebHashHistory, useRouterStore } from '../../index'
import type { VmoRouteToRaw } from '../../index'
import PGS from '../pages/index'
import { ElMessageBox } from 'element-plus'

type Meta = {
  keepAlive: boolean
  name: string
}

export function generateRouter() {
  const store = useRouterStore<VmoRouteToRaw<Meta>>()
  store.setMutipleCatch(false)
  store.setCacheMethods({
    setter: routes => sessionStorage.setItem('routes', JSON.stringify(routes)),
    getter: () => JSON.parse(sessionStorage.getItem('routes') ?? '[]') as VmoRouteToRaw<Meta>[]
  })
  store.setConfirmToLeaveMethod(meta => {
    return new Promise((resolve, reject) => {
      ElMessageBox({
        title: '操作提示',
        message: '当前页面未能保存'
      })
        .then(() => resolve(true))
        .catch(() => reject(false))
    })
  })
  const router = createRouter<Meta>(
    {
      history: createWebHashHistory(),
      routes: [mergeAll([PGS.MainPg, { children: [PGS.SampleA, PGS.SampleB] }]), PGS.Error404]
    },
    PGS,
    store
  )
  // store.setMutipleCatch(false)
  router.beforeEach((to, from, next) => {
    console.log(to)
    if (to.meta.keepAlive) {
      store.insertKeepAliveNames(to.name as string)
    }
    if (to.matched.length == 0) {
      next({ name: 'error-404' })
      return
    }
    next()
  })
  return router
}
