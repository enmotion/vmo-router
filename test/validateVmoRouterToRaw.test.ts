import { describe, it, expect } from 'vitest'
import { validateVmoRouterToRaw } from '../use.lib/lib'
import { RouteRecordRaw } from 'vue-router'
import { isNil, isEmpty } from 'ramda'

describe('validateVmoRouterToRaw', () => {
  it('should return true when all required fields are present', () => {
    const routeLocationNamedRaw = {
      name: 'TestRoute',
      template: {
        pageKey: 'ParentPage',
        route: { path: '/test' }
      }
    }
    const pageTemplates = {
      ParentPage: { path: '/parent' }
    }
    const result = validateVmoRouterToRaw(routeLocationNamedRaw, pageTemplates)
    expect(result).toBe(true)
  })

  it('should return false when name is missing', () => {
    const routeLocationNamedRaw = {
      template: {
        pageKey: 'ParentPage',
        route: { path: '/test' }
      }
    }
    const pageTemplates = {
      ParentPage: { path: '/parent' }
    }
    const result = validateVmoRouterToRaw(routeLocationNamedRaw, pageTemplates)
    expect(result).toBe(false)
  })

  it('should return false when template is missing', () => {
    const routeLocationNamedRaw = {
      name: 'TestRoute'
    }
    const pageTemplates = {
      ParentPage: { path: '/parent' }
    }
    const result = validateVmoRouterToRaw(routeLocationNamedRaw, pageTemplates)
    expect(result).toBe(false)
  })

  it('should return false when pageKey is missing', () => {
    const routeLocationNamedRaw = {
      name: 'TestRoute',
      template: {
        route: { path: '/test' }
      }
    }
    const pageTemplates = {
      ParentPage: { path: '/parent' }
    }
    const result = validateVmoRouterToRaw(routeLocationNamedRaw, pageTemplates)
    expect(result).toBe(false)
  })

  it('should return false when path is missing', () => {
    const routeLocationNamedRaw = {
      name: 'TestRoute',
      template: {
        pageKey: 'ParentPage'
      }
    }
    const pageTemplates = {
      ParentPage: { path: '/parent' }
    }
    const result = validateVmoRouterToRaw(routeLocationNamedRaw, pageTemplates)
    expect(result).toBe(false)
  })

  it('should return false when pageKey does not exist in pageTemplates', () => {
    const routeLocationNamedRaw = {
      name: 'TestRoute',
      template: {
        pageKey: 'NonExistentPage',
        route: { path: '/test' }
      }
    }
    const pageTemplates = {
      ParentPage: { path: '/parent' }
    }
    const result = validateVmoRouterToRaw(routeLocationNamedRaw, pageTemplates)
    expect(result).toBe(false)
  })
})
