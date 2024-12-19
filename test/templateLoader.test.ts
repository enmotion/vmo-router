// routerStore.test.ts
import { describe, it, expect } from 'vitest'
import { loadPageTemplateByImport } from '../use.lib/lib'

describe('loadPageTemplateByImport', () => {
  it('should correctly load and transform page templates', () => {
    const templates = {
      './pages/parent-page/child-page.pg.ts': { default: {} },
      './pages/big-page/big-child-page.pg.ts': { default: { component: 'BigChildPageComponent' } }
    }
    const expectedPages = {
      ParentPage: {},
      BigPage: { component: 'BigChildPageComponent' }
    }
    const result = loadPageTemplateByImport(templates)
    expect(result).toEqual(expectedPages)
  })

  it('should handle undefined content', () => {
    const templates = {
      './pages/undefined-page/child-page.pg.ts': {}
    }
    const expectedPages = {
      UndefinedPage: {}
    }
    const result = loadPageTemplateByImport(templates)
    expect(result).toEqual(expectedPages)
  })
})
