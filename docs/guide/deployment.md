# 开发与 GitHub Pages

## 本地阅读与构建

在项目根目录执行：

```sh
npm ci
npm run docs:dev
```

根据终端地址打开文档。生产构建与预览：

```sh
npm run docs:build
npm run docs:preview
```

文档位于 `docs/`，静态产物位于 `docs/.vitepress/dist/`，不进入 npm 库的 dist 包。

## 发布到 GitHub

当前仓库 GitHub 远程是 `https://github.com/enmotion/vmo-router`，部署目标是：

**https://enmotion.github.io/vmo-router/**

英文版地址为 **https://enmotion.github.io/vmo-router/en/**，可通过语言菜单切换到对应页面。中文源文件位于 `docs/`，英文源文件保持相同目录结构，位于 `docs/en/`；修改 API 或指南时请同步更新两种语言。

该地址在首次成功部署前可能返回 404。首次发布需要仓库管理员完成：

1. 打开仓库 **Settings → Pages**。
2. 将 **Build and deployment → Source** 设为 **GitHub Actions**。
3. 将本地改动提交并推送到 GitHub 的 `main` 分支。
4. 在 **Actions** 中查看 **Documentation** 工作流，确认部署成功。
5. 可在仓库 **About → Website** 中填写文档地址，作为第二个入口。

本项目 GitHub 远程名称为 `github`，`origin` 指向 Gitee。推送前请核对目的仓库。

工作流在 main 推送时构建和部署，PR 只构建检查，也可以手动触发。上传和部署使用 GitHub 自带的 GITHUB_TOKEN，无需单独保存个人访问令牌。

## 子路径与站点入口

VitePress `base` 设置为 `/vmo-router/`，适配 GitHub Pages 项目路径。站内导航不要手动重复这一前缀。更名仓库或改用自定义域名时，需要同时更新 base、README 和 package.json 的 homepage。

GitHub 仓库页不会直接运行 VitePress；用户从 README 的“在线文档”链接进入 GitHub Pages。GitHub 也能直接渲染 `docs/` 下的 Markdown。

本地双击生成的 HTML 不能作为完整的交互文档体验；使用 `docs:dev` 或 `docs:preview` 提供 HTTP 服务。
