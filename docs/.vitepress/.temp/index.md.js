import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"vmo-router","text":"用模板组织动态路由","tagline":"在 Vue Router 上管理动态页面、刷新恢复与 KeepAlive，减少后台系统的重复配置。","actions":[{"theme":"brand","text":"快速开始","link":"/guide/getting-started"},{"theme":"alt","text":"查阅 API","link":"/api/router"},{"theme":"alt","text":"GitHub","link":"https://github.com/enmotion/vmo-router"}]},"features":[{"title":"模板注册","details":"将页面组件留在本地，用配置指定页面名称、路径、参数和父级路由。"},{"title":"动态导航","details":"按需装载或批量注册，push 与 replace 返回可等待的导航结果。"},{"title":"刷新恢复","details":"注入持久化 getter/setter，在创建路由时恢复动态路由树。"},{"title":"页面状态","details":"管理 KeepAlive 名单和离开确认，分别控制路由配置与组件状态。"}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="从哪里开始" tabindex="-1">从哪里开始 <a class="header-anchor" href="#从哪里开始" aria-label="Permalink to &quot;从哪里开始&quot;">​</a></h2><p>第一次使用请阅读<a href="./guide/getting-started.html">快速开始</a>。已接入旧版的项目请先阅读<a href="./guide/migration.html">迁移说明</a>。</p><p>本文档描述当前仓库实现。安装的 npm 版本可能尚未包含仓库中的修复，使用前请核对发布版本。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
