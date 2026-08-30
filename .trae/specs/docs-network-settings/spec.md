# 网络设置文档页 Spec

## Why
NexHub 客户端的「网络设置」包含代理 / DNS / DoH / DoT / Hosts / SNI / ECH 七大模块，以及「全局 ↔ 源级覆盖」两层生效模型，概念密度高，新手难以判断「我该选哪个、改了之后到底影响什么」。当前网站文档中心（`docs.html`）下只有 FAQ / Tutorial / Features 三页，缺少专门解释网络设置的页面。需要新增一页面向小白用户的详尽文档，把每一个开关、每一个字段讲清楚，并明确「生效边界」与「实验性」标注的真正含义。

## What Changes
- 新增文档页 `docs-network.html`，挂在文档中心 `docs.html` 的导航树中。
- 文档页内容来自 `E:\nexhub` 客户端真实代码（`lib/core/network/**` 与 `lib/features/settings/presentation/settings_network_screen.dart`、`lib/features/sources/presentation/source_network_override_screen.dart`），不杜撰未实现的能力。
- 文档采用「概念铺垫 → 模块详解 → 生效边界 → 小白操作指引 → 常见疑问」的递进结构，每个模块配字段表与「什么时候用」建议。
- 与现有文档页（`docs-features.html` 等）保持同一套布局：`doc-layout` + 左侧 `doc-nav` + 右侧 `doc-toc` + `doc-content` 容器，由 `app.js` 注入正文与目录。
- **BREAKING**：无（纯新增页面，不改既有页面行为）。

## Impact
- Affected specs: 无既有 spec；本 spec 为新增。
- Affected code:
  - 新增 `docs-network.html`（网站根目录）。
  - `assets/js/app.js`：新增 `renderDocsNetwork()` 渲染函数；在 `initAll()` / 语言切换处调用；在 `renderDocsNav()` 的 `sections` 列表中登记新页。
  - `assets/js/i18n.js`：新增 `network.*` 文案键（zh + en），以及文档中心卡片入口文案。
  - 不改动 NexHub 客户端（`E:\nexhub`）任何代码，仅以它为事实来源撰写文档。

## ADDED Requirements

### Requirement: 网络设置文档页
系统 SHALL 在 NexHub 官网文档中心新增一页 `docs-network.html`，面向无网络背景的用户，完整解释客户端「网络设置」中所有可见开关与字段。

#### Scenario: 文档可被访问
- **WHEN** 用户进入 `docs.html` 文档中心
- **THEN** 导航树中出现「网络设置」条目，点击后跳转 `docs-network.html`

#### Scenario: 文档覆盖全部七大模块
- **GIVEN** 客户端网络设置页存在「代理 / DNS / DoH / DoT / 自定义 Hosts / SNI / ECH」七个模块
- **WHEN** 用户阅读 `docs-network.html`
- **THEN** 文档为每个模块各设一节，每节包含：用途一句话、字段表（字段名 / 含义 / 是否必填 / 取值约束）、什么时候该启用、什么时候不要启用

#### Scenario: 明确生效边界
- **WHEN** 用户阅读「生效边界」一节
- **THEN** 文档以表格列清「受全局网络设置影响」与「不受影响（走原生栈）」两类流量，并标注源级覆盖仅作用于该源的抓取流量

#### Scenario: 标注实验性功能
- **GIVEN** 客户端代码中 SNI 与 ECH 标注「实验性」
- **WHEN** 文档介绍 SNI / ECH
- **THEN** 文档显式复述「实验性：受 Dart TLS 栈限制，可能无法在所有路径生效」并解释根因（Dart TLS 用请求 host 作 SNI；BoringSSL 不暴露 ECH API）

#### Scenario: 提供小白操作指引
- **WHEN** 用户阅读「常见场景操作指引」一节
- **THEN** 文档给出至少 4 个分步流程：① 配置 HTTP 代理；② 切换到 DoH；③ 加一条 Hosts 把某域名指向固定 IP；④ 给单个源单独覆盖代理

#### Scenario: 多语言
- **GIVEN** 网站已支持 zh / en 双语
- **WHEN** 用户切换语言
- **THEN** `docs-network.html` 的标题、正文、目录、面包屑同步切换；正文内容由 `CONTENT.network[state.lang]` 提供

## MODIFIED Requirements

### Requirement: 文档中心导航
`renderDocsNav()` 的 `sections` 列表 SHALL 在现有「文档中心 / 功能 / 常见问题 / 源编写教程」之外，新增「网络设置」条目，指向 `docs-network.html`。

#### Scenario: 导航顺序
- **WHEN** 渲染左侧文档导航树
- **THEN** 「网络设置」条目位于「功能」之后、「常见问题」之前

### Requirement: 文档中心首页卡片
`docs.html` 的 `docsBody` SHALL 新增一张「网络设置」入口卡片，与现有 FAQ / Tutorial / Features 卡片同款样式，点击跳转 `docs-network.html`。

## REMOVED Requirements
无。
