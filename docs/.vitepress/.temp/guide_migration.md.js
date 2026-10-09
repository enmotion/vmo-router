import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"迁移与常见问题","description":"","frontmatter":{},"headers":[],"relativePath":"guide/migration.md","filePath":"guide/migration.md"}');
const _sfc_main = { name: "guide/migration.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="迁移与常见问题" tabindex="-1">迁移与常见问题 <a class="header-anchor" href="#迁移与常见问题" aria-label="Permalink to &quot;迁移与常见问题&quot;">​</a></h1><h2 id="从旧实现迁移" tabindex="-1">从旧实现迁移 <a class="header-anchor" href="#从旧实现迁移" aria-label="Permalink to &quot;从旧实现迁移&quot;">​</a></h2><p>当前仓库已修正导航和缓存行为，但不代表这些改动已经发布到 npm。</p><ul><li><code>push/replace</code> 返回真实 Promise：使用 <code>await</code>，并处理失败结果和拒绝。</li><li><code>addRouter</code> 同步抛出配置错误，不再吞掉错误返回 false。</li><li><code>beforeEach</code> 返回注销函数，支持异步守卫。确认保护不再依赖用户注册 beforeEach。</li><li>取消导航不会写入新动态缓存，也不会关闭离开保护。</li><li><code>reloadRoutes</code> 预检查整个配置和父子依赖；缺少父路由不再在批量装载中静默回退。</li><li>动态路由与持久化清单分离，单缓存模式也能清除所有已注册动态页面。</li><li>Pinia 已显式声明为 peer dependency。</li></ul><p>旧缓存可能含静态路由、旧模板键或失效的父关系。升级时清理旧缓存，或按账号和配置版本迁移。</p><h2 id="页面刷新后-404" tabindex="-1">页面刷新后 404 <a class="header-anchor" href="#页面刷新后-404" aria-label="Permalink to &quot;页面刷新后 404&quot;">​</a></h2><p>检查是否配置持久化，并在创建 router 前设置回调；确认恢复数据中的模板键和父路由有效。单缓存无法自动补足动态父路由树。</p><h2 id="同模板输入没有保留" tabindex="-1">同模板输入没有保留 <a class="header-anchor" href="#同模板输入没有保留" aria-label="Permalink to &quot;同模板输入没有保留&quot;">​</a></h2><p>检查组件是否用懒加载模板、route meta 是否标记 keepAlive、是否在成功导航后维护名单，以及 <code>&lt;keep-alive :include&gt;</code> 是否绑定同一 store。名单匹配的是组件名称。</p><h2 id="路径参数被丢弃" tabindex="-1">路径参数被丢弃 <a class="header-anchor" href="#路径参数被丢弃" aria-label="Permalink to &quot;路径参数被丢弃&quot;">​</a></h2><p><code>params</code> 必须对应路径中的 <code>:参数名</code>。例如 <code>{ params: { id: &#39;1&#39; } }</code> 需要 <code>/report/:id</code>；普通筛选条件请使用 query。</p><h2 id="是否已具备全面生产保证" tabindex="-1">是否已具备全面生产保证 <a class="header-anchor" href="#是否已具备全面生产保证" aria-label="Permalink to &quot;是否已具备全面生产保证&quot;">​</a></h2><p>核心实现有自动化测试与 Chromium 开发环境验证。跨浏览器、生产构建浏览器执行、存储异常、并发导航和关闭标签页行为仍应在具体项目中验证。覆盖率不能替代场景验证。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("guide/migration.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const migration = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  migration as default
};
