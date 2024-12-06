import type { RouteRecordRaw, Router, RouteComponent, RouteLocationNamedRaw } from 'vue-router'
/* types   ---------- ---------- ---------- ---------- ---------- ----------*/
export declare type Lazy<T> = () => Promise<T>
/**
 * 路由对象类型约束 继承自 RouteRecordRaw
 */
export declare type VmoRouteRecordRaw<T extends Record<string, any>> = Omit<
  RouteRecordRaw,
  'meta' | 'children' | 'component'
> & {
  meta?: Omit<T, 'keepAlive'> & { keepAlive: boolean }
  // {
  //   pageName: string // 页面标题
  //   tokenRequire?: boolean // 登录约束，如果为false 或者
  //   powerRequire?: string[] // 前端权限，当路由被后端管理时，不做约束
  //   avoidTabMenu?: boolean // 不添加至标签菜单 true 不允许添加到菜单
  //   unConfigurable?: boolean // 该页面是否允许进入动态配置 true 不允许
  //   keepAlive?: boolean // 是否存入缓存，true存入 false 免于存入
  // }
  children?: VmoRouteRecordRaw<T>[]
  component?: RouteComponent | Lazy<RouteComponent>
}
/**
 * 路由菜单配置数据
 * 该类型主要用于后端存储，或前端配置来实现菜单呈现
 * 该类型数据包括了菜单所需的 label, icon , 模版所需的 template ，路由所需的其 name,path,query,params 等
 */
export declare type VmoxRouteLocationNamedRaw = {
  label?: string // 菜单标题
  icon?: string // 菜单图标
  template?: {
    // 菜单模版信息
    pageKey: string // 模版主键名称，对应 PGS 内的对象属性名称；
    parent?: string // 父路由情况
    route?: Omit<VmoxRouteRecordRaw, 'name'> // 生成的路由配置
  }
  children?: VmoxRouteLocationNamedRaw[] // 是否有子对象
} & RouteLocationNamedRaw
