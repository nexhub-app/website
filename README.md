# NexHub 官方网站

NexHub 的官方站点（产品介绍 + 下载 + 文档 + 源仓库），**纯静态、零构建**，可直接托管到 GitHub Pages。

- 技术：HTML + CSS + 原生 JavaScript（无框架、无打包步骤）
- 双语：中文 / English 一键切换（记忆上次选择）
- 主题：**跟随系统 / 浅色 / 深色** 三态（默认跟随系统并记忆；选「跟随系统」时随系统深浅色实时切换）
- 视觉：青色科技主色 + Material 3 色调角色 + **M3E（Material 3 Expressive）** 表达性形状与弹性动效；大标题用衬线体、强调色克制（Claude 式层级）
- 数据驱动：源仓库、功能、下载、文档均由 JS 数据渲染，改文案/加源很方便

## 目录结构

多页面站点，共享同一套 CSS / JS，header 与 footer 由 JS 注入（改一处全局生效）。

```
website/                         ← 整个静态站（也是 GitHub Pages 的源目录，文件位于仓库根目录）
├── index.html              # 首页（Hero + 软件图标 + 亮点 + 跳转）
├── download.html           # 下载
├── docs.html               # 文档中心（首页：功能 / 网络 / 常见问题 / 源编写教程 入口）
├── docs-features.html      # 文档：功能 + 使用指南（小说/视频/漫画）
├── docs-faq.html           # 文档：常见问题
├── docs-tutorial.html      # 文档：源编写教程
├── docs-network.html       # 文档：网络设置（SNI / ECH / Hosts）
├── sources.html            # 源仓库（影视/动漫 · 漫画 · 小说 栏目）
├── assets/
│   ├── app-icon.svg        # 软件图标（品牌 / 首页大图 / 浏览器 tab 共用）
│   ├── css/style.css       # 样式（青色主色 + MD3 色调角色 + M3E 形状/动效 + 明暗主题 + 响应式）
│   └── js/
│       ├── i18n.js         # 双语文案 + 功能/下载/文档/首页亮点/使用指南
│       ├── sources.js      # 源仓库加载器（fetch nexhub-app/sources 的 index.json，含 CDN 回退）
│       └── app.js          # 注入 header/footer、语言/主题切换、渲染、交互
├── push-website.cmd        # 本地一键推送脚本（可选）
├── .github/workflows/      # Deploy to GitHub Pages 工作流
├── LICENSE
├── .nojekyll
└── README.md
```

> 每个页面在 `<body data-page="home|download|docs|sources">` 上标明身份（5 个文档页共用 `docs`），
> app.js 据此高亮当前导航、设置页面标题，并只渲染该页存在的容器。

## 视觉与设计系统

- **配色**：青色科技主色 `--primary #159cb5` / `--primary-2 #3ec4dd` / `--accent #06b6d4`；暗色主题主色提亮为 `#2fb6cf` 以保证对比。
- **MD3 色调角色**：`--primary-container` / `--on-primary-container` / `--secondary-container` / `--surface-variant` / `--outline` / `--outline-variant`。组件优先用 `*-container` 着色（MD3 state layer），而不是加粗描边。
- **M3E（Material 3 Expressive）**：大圆角（`--radius` 20 / 卡片 24 / `--radius-lg` 32）、非对称「饼干」圆角（Hero 图标 `30px 30px 30px 10px`）、弹性缓动 `--ease-spring`（卡片悬停回弹、按钮按下回缩）、Hero 图标轻微浮动。
- **Claude 式克制**：`.hero-title` / `.section-head h2` / `.doc-title` / `.doc-h2` 等大标题使用衬线体（`--font-serif`）600 字重，强调色只落在关键元素上。
- **Hero 流动渐变**：`.hero-bg` 用 `@keyframes heroFlow` 做缓慢流动的青色系粉彩渐变（背景尺寸 300%、22s 循环）。
- **无障碍**：`@media (prefers-reduced-motion: reduce)` 会关闭浮动、回弹与渐变动画。
- **避免深色白闪**：每个 HTML 的 `<head>` 里都有一段同步内联脚本，在首屏绘制前读取 `localStorage.nexhub_theme` 与 `prefers-color-scheme` 设好 `data-theme`。
- **文档侧栏**：电脑端为三栏布局（左导航 · 正文 · 右侧「本页内容」固定栏）；平板/手机改为右下角悬浮按钮点开目录。
- **页脚**：含 QQ 开发交流群入口（群号 1132306726）。

## 部署到 GitHub Pages

本仓库地址：`https://github.com/nexhub-app/website`（源导入链接与下载按钮已预设此地址，无需再改占位符）。

仓库内已包含：站点文件（`index.html` 等，位于仓库根目录）、`LICENSE`、`.nojekyll`、`.github/workflows/`（自动部署）。源数据不再存于本仓库，改由 [nexhub-app/sources](https://github.com/nexhub-app/sources) 仓库的 `index.json` 动态提供。

### 方式一：GitHub Actions 自动部署（推荐）

把仓库推到 `main` 分支后，到 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**，以后每次 push 自动上线。

### 方式二：分支部署（最简单）

1. 仓库 → **Settings → Pages**
2. **Source** 选 `Deploy from a branch`
3. **Branch** 选 `main` + 目录 `/ (root)`（站点文件位于仓库根目录）
4. 保存后等待 1–2 分钟，访问 `https://nexhub-app.github.io/website/` 即可。

> 页面使用**相对路径**，放在子路径下也能正常显示，无需改 base。

## 本地预览

直接用浏览器打开 `index.html` 即可（双击文件，或拖进浏览器）。
若想用本地服务器（更接近线上行为）：

```bash
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 日常维护

- **改文案 / 加功能卡 / 加下载平台 / 加文档 / 加首页亮点**：编辑 `assets/js/i18n.js`（中英两版都改）。
- **加 / 改源**：源统一在 [nexhub-app/sources](https://github.com/nexhub-app/sources) 仓库管理。往 `sources/<分类>/` 放一个 JSON，GitHub Action 会自动重建 `index.json`，网站下次打开即出现，**无需改本仓库代码**。
  - 网站 `assets/js/sources.js` 只负责从 `index.json` 拉取并渲染，通常不用改（仅切换数据源地址时才动）。
  - 所有源 `builtin` 均为 `true`，网页显示「导入」按钮（复制可直接导入的链接）。
- **换主题色**：编辑 `assets/css/style.css` 顶部 `:root` 的 `--primary` / `--primary-2` / `--accent`，以及配套的 `--primary-container` 等色调角色；暗色主题在 `[data-theme="dark"]` 里覆盖。
- **调形状 / 动效**：`--radius*` 控制圆角，`--ease-spring` / `--ease-emph` 控制弹性缓动；M3E 相关规则集中在 `style.css` 末尾的「M3E 表达性收口」段落。
- **主题三态**：逻辑在 `assets/js/app.js` 的 `getThemePref()` / `resolveTheme()` / `setTheme()`，`localStorage` 键为 `nexhub_theme`（`auto|light|dark`）。**新增页面时务必同步 `<head>` 内的首屏主题脚本**，否则会出现深色白闪。
- **改品牌名 / Logo**：改各页面里的 `NexHub` 文字与 `assets/app-icon.svg`。
- **增删页面**：新建 `xxx.html`（复制任一页面骨架，保留 `<head>` 首屏主题脚本，改 `<body data-page="xxx">` 与内部容器），并在 `assets/js/app.js` 的 `PAGES` 数组里加一项。
