# Development and GitHub Pages

## Read and build locally

Run from the repository root:

```sh
npm ci
npm run docs:dev
```

Open the URL printed in the terminal. To build and preview the production site:

```sh
npm run docs:build
npm run docs:preview
```

Documentation sources are in `docs/`, and generated static files are in `docs/.vitepress/dist/`. They are separate from the npm library's dist package.

## Publish to GitHub

The repository's GitHub remote is `https://github.com/enmotion/vmo-router`. The English documentation URL is:

**https://enmotion.github.io/vmo-router/en/**

The Chinese site is at **https://enmotion.github.io/vmo-router/**. Use the language menu to switch between matching pages.

These URLs may return 404 until the first successful deployment. A repository administrator must:

1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Commit and push the changes to the GitHub `main` branch.
4. Check the **Documentation** workflow under **Actions** and confirm deployment succeeds.
5. Optionally set **About → Website** to the documentation URL for another entry point.

The GitHub remote is named `github`; `origin` points to Gitee. Check the destination before pushing.

The workflow builds and deploys on main pushes. Pull requests build only; manual runs are also supported. Upload and deployment use GitHub's GITHUB_TOKEN, without requiring a separate personal access token.

## Base path and entry points

VitePress `base` is `/vmo-router/` for GitHub Pages project hosting. Do not repeat that prefix in internal navigation links. If you rename the repository or use a custom domain, update base, README links and package.json homepage together.

Chinese sources remain at `docs/`; English pages mirror their paths under `docs/en/`. Add or update both language versions when changing an API or guide.

GitHub repository pages do not run VitePress directly. Readers enter GitHub Pages through README links; GitHub also renders the Markdown sources.

Opening generated HTML from the filesystem is not the full interactive documentation experience. Use `docs:dev` or `docs:preview` to serve it over HTTP.
