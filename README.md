# NexHub 官方网站

NexHub 的官方站点（产品介绍 + 下载 + 文档 + 源仓库），**纯静态、零构建**，可直接托管到 GitHub Pages。

- 技术：HTML + CSS + 原生 JavaScript（无框架、无打包步骤）
- 双语：中文 / English 一键切换（记忆上次选择）
- 主题：浅色 / 深色，跟随系统并记忆
- 数据驱动：源仓库、功能、下载、文档均由 JS 数据渲染，改文案/加源很方便

## 目录结构

多页面站点，共享同一套 CSS / JS，header 与 footer 由 JS 注入（改一处全局生效）。

```
website/                         ← 整个静态站（也是 GitHub Pages 的源目录）
├── index.html              # 首页（Hero + 软件图标 + 亮点 + 跳转）
├── download.html           # 下载
├── docs.html               # 文档中心（首页：功能 / 常见问题 / 源编写教程 入口）
├── docs-features.html      # 文档：功能 + 使用指南（小说/视频/漫画）
├── docs-faq.html           # 文档：常见问题
├── docs-tutorial.html      # 文档：源编写教程
├── sources.html            # 源仓库（影视/动漫 · 漫画 · 小说 栏目）
├── assets/
│   ├── app-icon.svg        # 软件图标（品牌 / 首页大图 / 浏览器 tab 共用）
│   ├── css/style.css       # 样式（天青色主色、明暗主题、响应式）
│   └── js/
│       ├── i18n.js         # 双语文案 + 功能/下载/文档/首页亮点/使用指南
│       ├── sources.js      # 源仓库数据（增删源改这里）
│       └── app.js          # 注入 header/footer、语言/主题切换、渲染、交互
├── plugins/builtin/        # 内置源 JSON（供「导入源」直接拉取）
├── .github/workflows/      # Deploy to GitHub Pages 工作流
├── LICENSE
├── .nojekyll
└── README.md
```

> 每个页面在 `<body data-page="home|features|download|docs|sources">` 上标明身份，
> app.js 据此高亮当前导航、设置页面标题，并只渲染该页存在的容器。

## 部署到 GitHub Pages

本仓库地址：`https://github.com/nexhub-app/website`（源导入链接与下载按钮已预设此地址，无需再改占位符）。

仓库内已包含：站点文件（`index.html` 等）、`plugins/builtin/` 内置源 JSON（供「导入源」直接拉取）、`LICENSE`、`.nojekyll`、`.github/workflows/deploy.yml`（自动部署）。

### 方式一：GitHub Actions 自动部署（推荐）

把仓库推到 `main` 分支后，到 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**，以后每次 push 自动上线。

### 方式二：分支部署（最简单）

1. 仓库 → **Settings → Pages**
2. **Source** 选 `Deploy from a branch`
3. **Branch** 选 `main` + 目录 `/website`（站点文件在 `website/` 子目录）
4. 保存后等待 1–2 分钟，访问 `https://nexhub-app.github.io/website/` 即可。

> 页面使用**相对路径**，放在子路径下也能正常显示，无需改 base。若想让地址变成 `https://nexhub-app.github.io/`（不带 `/website`），把 `website/` 里的文件移到仓库根目录，并在 Pages 选 `/root` 即可。

## 本地预览

直接用浏览器打开 `index.html` 即可（双击文件，或拖进浏览器）。
若想用本地服务器（更接近线上行为）：

```bash
cd website
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 日常维护

- **改文案 / 加功能卡 / 加下载平台 / 加文档 / 加首页亮点**：编辑 `assets/js/i18n.js`（中英两版都改）。
- **加 / 改源**：编辑 `assets/js/sources.js` 的 `NEXHUB_SOURCES` 数组。
  - `builtin: true` 的源显示「导入」按钮（复制 raw 链接）；`builtin: false` 作为社区/示例源显示「敬请期待」。
  - 小说源目前为社区示例，待真正接入 `plugins/builtin/` 后把 `builtin` 改为 `true` 即可变为内置可导入。
- **换主题色**：编辑 `assets/css/style.css` 顶部 `:root` 里的 `--primary` 等变量（当前为天青色）。
- **改品牌名 / Logo**：改各页面里的 `NexHub` 文字与 `assets/app-icon.svg`。
- **增删页面**：新建 `xxx.html`（复制任一页面骨架，改 `<body data-page="xxx">` 与内部容器），并在 `assets/js/app.js` 的 `PAGES` 数组里加一项。
