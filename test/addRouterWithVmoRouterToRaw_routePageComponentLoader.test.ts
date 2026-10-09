import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { createRouter, createMemoryHistory } from '../use.lib/index'
import { addRouterWithVmoRouterToRaw, loadPageTemplateByImport } from '../use.lib/lib'

const location = (name: string) => ({ name, template: { pageKey: 'Page', route: { path: name } } })
describe('template component behavior', () => {
  it.each([true, false])('loads independent names without modifying shared component (module=%s)', async module => {
    const source = { name: 'Original', render: () => h('div') }
    const router = createRouter({ history: createMemoryHistory(), routes: [] }, {
      Page: { path: '/template', component: async () => module ? { default: source } : source }
    })
    await router.push(location('first'))
    const first = router.currentRoute.value.matched[0].components!.default
    await router.push(location('second'))
    const second = router.currentRoute.value.matched[0].components!.default
    expect(first.name).toBe('first')
    expect(second.name).toBe('second')
    expect(first).not.toBe(second)
    expect(source.name).toBe('Original')
  })
  it('propagates lazy import failure', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [] }, {
      Page: { path: '/template', component: async () => { throw new Error('import failed') } }
    })
    router.onError(() => {})
    await expect(router.push(location('bad'))).rejects.toThrow('import failed')
  })
  it('rejects a template without renderable content', () => {
    expect(() => addRouterWithVmoRouterToRaw(location('bad'), { Page: { path: '/template' } } as any)).toThrow('requires')
  })
  it('accepts named views, redirects and layout records without a default component', () => {
    for (const record of [ { components: { default: { render: () => h('div') } } }, { redirect: '/' }, { children: [] } ]) {
      expect(() => addRouterWithVmoRouterToRaw(location('a'), { Page: { path: '/template', ...record } } as any)).not.toThrow()
    }
  })
  it('preserves functional component metadata', () => {
    const functional = () => h('div')
    functional.props = ['title']
    expect(() => addRouterWithVmoRouterToRaw(location('a'), { Page: { path: '/template', component: functional } })).not.toThrow()
    const displayed = () => h('div')
    displayed.displayName = 'Functional'
    expect(() => addRouterWithVmoRouterToRaw(location('a'), { Page: { path: '/template', component: displayed } })).not.toThrow()
  })
  it('rejects colliding normalized template keys', () => {
    expect(() => loadPageTemplateByImport({ './one/my-page/index.pg.ts': {}, './two/myPage/index.pg.ts': {} })).toThrow('duplicate')
  })
})
