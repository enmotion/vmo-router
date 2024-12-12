# vmo-router

`vmo-router` 是基于 `vmo-router` 的再次封装，其设计的目的是为了解决在实际开发中面对动态路由管控配置繁琐，功能一致性差，缺乏系统级思考而做的补充完善,其设计理念是低侵入式的，最为重要的是扩展 vue-router 的路由创建过程，以及路由跳转的加载过程。核心思路是将传统 页面模版池化，由静态模式转变为动态调度模式，再结合缓存机制，完成持久化。

#### 功能特点：

1. 所有页面模版化，支持在工程内部构件一个自动加载所有页面的自动装载方法，先将页面装载成 template，全部支持懒加载 (方法是否通用待验证)
2. 基础页面预实例，部分基础页面，如登录，首页，异常报错页面，预先装载。成为系统的基础路由。
3.
4. 菜单指定路由装载，当用户登录后，我们可以通过后端返回的 JSON 来实际装填所有的 template ，构成真正的路由表。在这个过程中，需要考虑对每个模版实例单独设置 name ，path，keepAlive ,title, params，以及页面的父子路由关系。
5. 菜单装载路由的缓存处理，当用户登录后，菜单装载的路由需要缓存化，即用户刷新页面时，也会装载全部的菜单指定路由表。避免刷新丢失页面
6. 动态路由装载，用户在实际使用中，考虑到低代码的情况，我们需要考虑用户可能装载页面时，存在部分路由未能完全加载，而是用户点击跳转时，判断是否装载，如未能装载则动态装载，并且也要添加入缓存
7. 页面返回禁止，比如部分页面再为保存时，不可直接离开或者返回需要得到用户的再次确认。
8. 权限控制，支持简单的权限点匹配控制方式
9. 路由动画，此处 配合 transition 组件一起使用

#### 如何安装:

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
   介于个人开发习惯的差异，请先了解其功能特点，再决定是否引用。
