import type {
  RouteRecordRaw,
  Router,
  RouteComponent,
  RouteLocationNamedRaw,
  RouteLocationRaw,
  RouteLocationAsRelativeGeneric,
  RouteLocationAsPathGeneric
} from 'vue-router'
/* types   ---------- ---------- ---------- ---------- ---------- ----------*/
export declare type Lazy<T> = () => Promise<T>
/**
 * 路由对象类型约束 继承自 RouteRecordRaw
 * T 是 meta 可扩展的情况 如下:
 * {
 *  pageName: string // 页面标题
 *  tokenRequire?: boolean // 登录约束，如果为false 或者
 *  powerRequire?: string[] // 前端权限，当路由被后端管理时，不做约束
 *  avoidTabMenu?: boolean // 不添加至标签菜单 true 不允许添加到菜单
 *  unConfigurable?: boolean // 该页面是否允许进入动态配置 true 不允许
 *  keepAlive?: boolean // 是否存入缓存，true存入 false 免于存入
 * }
 */
export declare type VmoRouteRecordRaw<META extends Record<string, any>> = Omit<RouteRecordRaw, 'meta' | 'component'> & {
  meta?: META
  component?: RouteComponent | Lazy<RouteComponent>
}

export declare type VmoRouteLocationRow = RouteLocationAsRelativeGeneric

/**
 * 路由跳转方式所需的 to 对象类型声明
 * 1. 由 vue-router RouteLocationRaw 类型扩展 push,replace 方法使用
 * 2. template: 路由池化后，动态加载所需数据,
 *    template.pageKey:对应路由池化名称，一般就是路由的文件夹父名称强转位驼峰命名
 *    template.parent?:非必填的父级路由，装填时，未必路由会直接加载，而是指定父路由装载
 *    template.router:路由池化的配置，需要为新的配置覆盖，但是唯独去掉了 name, 因为 name, 将由外层 RouteLocationRaw.name 决定
 * 3. strict: 严苛模式，默认false, true,当我们指定的父路由{template.parent}匹配路由不存在时，不允许将当前路由装载到根目录下，但是父路由不存在的情况不在此约束管控，
 */
export declare type VmoRouteToRaw<META extends Record<string, any>> = RouteLocationAsRelativeGeneric & {
  template?: {
    pageKey: string
    parent?: string
    route: Omit<VmoRouteRecordRaw<META>, 'name'>
  }
  strict?: boolean
}

/**
 * V2 路由菜单结构
 * ITEM 范型，可扩展为用户习惯的菜单形式, 但是其 to, template, strict 必须符合类型约束
 * META 范型，可以自由扩展成用户习惯的模式，但是必须为一个 Record<string,any> 类型的扩展
 * to: 路由实际跳转时需要依赖的配置
 */
export declare type VmoRouteMenuItemRaw<ITEM extends Record<string, any>, META extends Record<string, any>> = Omit<
  ITEM,
  'to' | 'children'
> & {
  to: VmoRouteToRaw<META>
  children?: VmoRouteMenuItemRaw<ITEM, META>[] // 是否有子菜单,树状递归结构
}

// /**
//  * V1 路由菜单结构
//  * 路由菜单配置数据
//  * 该类型主要用于后端存储，或前端配置来实现菜单呈现
//  * 该类型数据包括了菜单所需的 label, icon , 模版所需的 template ，路由所需的其 name,path,query,params 等
//  */
// export declare type VmoRouteLocationNamedRaw = {
//   label?: string // 菜单标题
//   icon?: string // 菜单图标
//   template?: {
//     // 菜单模版信息
//     templateKey: string // 模版主键名称，对应 PGS 内的对象属性名称；
//     parent?: string // 父路由情况
//     route?: Omit<VmoxRouteRecordRaw, 'name'> // 生成的路由配置
//   }
//   children?: VmoRouteLocationNamedRaw[] // 是否有子对象
// } & RouteLocationNamedRaw
