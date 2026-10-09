import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"vmo-router","text":"Organize dynamic routes with templates","tagline":"Manage dynamic pages, reload recovery and KeepAlive on top of Vue Router, with less repeated configuration.","actions":[{"theme":"brand","text":"Get started","link":"/en/guide/getting-started"},{"theme":"alt","text":"API reference","link":"/en/api/router"},{"theme":"alt","text":"GitHub","link":"https://github.com/enmotion/vmo-router"}]},"features":[{"title":"Page templates","details":"Keep components local and configure route names, paths, parameters and parent relationships."},{"title":"Dynamic navigation","details":"Register routes on demand or in batches. Await push and replace to inspect navigation results."},{"title":"Reload recovery","details":"Inject persistence callbacks to restore the dynamic route tree when creating the router."},{"title":"Page state","details":"Manage KeepAlive names and leave confirmation, with separate handling for route definitions and component state."}]},"headers":[],"relativePath":"en/index.md","filePath":"en/index.md"}');
const _sfc_main = { name: "en/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="where-to-start" tabindex="-1">Where to start <a class="header-anchor" href="#where-to-start" aria-label="Permalink to &quot;Where to start&quot;">​</a></h2><p>New users can follow <a href="./guide/getting-started.html">Getting started</a>. Existing integrations should read <a href="./guide/migration.html">Migration and FAQ</a>.</p><p>These docs describe the current repository implementation. The published npm package may not yet include the repository fixes; check the release you install.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
