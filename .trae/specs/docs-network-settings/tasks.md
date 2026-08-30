# Tasks

- [x] Task 1: 新增 `docs-network.html` 页面骨架
  - [ ] SubTask 1.1: 复制 `docs-features.html` 的骨架（`doc-layout` + 左侧 `doc-nav` + 右侧 `doc-toc` + 中间 `doc-main`）
  - [ ] SubTask 1.2: 把面包屑第二段改为「网络设置」并 `data-i18n="network.title"`；正文容器 id 设为 `networkBody`，目录树 id 设为 `networkToc`
  - [ ] SubTask 1.3: 保留对 `i18n.js` / `sources.js` / `app.js` 的引用与 `data-page="docs"`

- [x] Task 2: 在 `assets/js/i18n.js` 新增 `network.*` 文案键（zh + en）
  - [ ] SubTask 2.1: 页面级键：`network.title` / `network.subtitle` / `network.breadcrumb`
  - [ ] SubTask 2.2: 文档中心入口卡片键：`docs.cardNetworkTitle` / `docs.cardNetworkDesc`
  - [ ] SubTask 2.3: 七大模块小标题与「什么时候用」标签键（`network.proxy.*` / `network.dns.*` / `network.doh.*` / `network.dot.*` / `network.hosts.*` / `network.sni.*` / `network.ech.*`）
  - [ ] SubTask 2.4: 生效边界 / 操作指引 / 常见疑问 三节的小标题键

- [x] Task 3: 在 `assets/js/sources.js`（或既有 `CONTENT` 数据源所在文件）新增 `CONTENT.network` 数据对象
  - [ ] SubTask 3.1: zh 内容：概念铺垫段 + 七模块字段表 + 生效边界表 + 4 个操作指引 + 常见疑问
  - [ ] SubTask 3.2: en 内容：与 zh 同结构翻译
  - [ ] SubTask 3.3: 字段表数据严格对齐客户端 `lib/core/network/model/network_config.dart` 的字段名与默认值（如 DoT 默认端口 853、DNS 缓存默认开启、SNI/ECH 默认关闭）

- [x] Task 4: 在 `assets/js/app.js` 新增 `renderDocsNetwork()` 渲染函数
  - [ ] SubTask 4.1: 读取 `CONTENT.network[state.lang]`，注入到 `#networkBody`
  - [ ] SubTask 4.2: 根据 `h2`/`h3` 自动生成右侧 `#networkToc` 目录
  - [ ] SubTask 4.3: 在 `initAll()` 与语言切换回调中调用 `renderDocsNetwork()`

- [x] Task 5: 把「网络设置」登记进文档中心导航
  - [ ] SubTask 5.1: 在 `renderDocsNav()` 的 `sections` 列表中，于「功能」之后、「常见问题」之前插入 `{ id: "network", href: "docs-network.html", titleKey: "network.title" }`
  - [ ] SubTask 5.2: 在 `renderDocsIntro()` 的 `docsBody` 卡片列表中新增「网络设置」卡片，链接 `docs-network.html`

- [x] Task 6: 撰写七大模块正文（基于 `E:\nexhub` 真实代码）
  - [ ] SubTask 6.1: 概念铺垫：什么是代理 / DNS / TLS，为什么要改它们；全局 vs 源级两层模型示意
  - [ ] SubTask 6.2: 代理模块：direct/system/manual 三模式 + HTTP/SOCKS5 两协议；密码走安全存储不入 JSON；系统模式桌面读环境变量（尽力而为）；「测试代理」按钮
  - [ ] SubTask 6.3: DNS 模块：system/custom(UDP :53)/DoH/DoT 四模式；DNS 缓存开关、清理缓存、缓存条目数；「测试 DNS 解析」按钮
  - [ ] SubTask 6.4: DoH 模块：https 端点；预设 Cloudflare/Google/Quad9；URL 必须 https；「测试 DoH」按钮
  - [ ] SubTask 6.5: DoT 模块：host + port(默认 853)，TLS 加密
  - [ ] SubTask 6.6: 自定义 Hosts：IP→host 映射；每条可启用/禁用；优先级高于 DNS，命中即返回不进 DNS 不缓存
  - [ ] SubTask 6.7: SNI 模块（实验性）：默认 SNI 值 + 域名→SNI 映射；根因：Dart TLS 用请求 host 作 SNI，域前置无法经标准路径生效
  - [ ] SubTask 6.8: ECH 模块（实验性）：ECH 配置列表(base64)；根因：BoringSSL 不暴露 ECH API 且无插件，UI+持久化完整但运行时暂不生效

- [x] Task 7: 撰写「生效边界」「操作指引」「常见疑问」三节
  - [ ] SubTask 7.1: 生效边界表：受影响（封面/下载/同步/抓取等所有 dart:io HttpClient 流量）vs 不受影响（WebView/播放器/投屏等原生栈）；源级覆盖仅作用于该源的抓取
  - [ ] SubTask 7.2: 操作指引 ① 配置 HTTP 代理 ② 切换到 DoH ③ 加一条 Hosts ④ 给单个源单独覆盖代理
  - [ ] SubTask 7.3: 常见疑问：为什么改了代理网页视图还是不走代理 / ECH 开了为什么不生效 / 密码存哪了 / 自签证书怎么办 / 重置会不会丢源

- [x] Task 8: 自测与回归
  - [ ] SubTask 8.1: 本地起静态服务打开 `docs-network.html`，确认左侧导航、右侧目录、正文、面包屑、语言切换均正常
  - [ ] SubTask 8.2: 确认点击文档中心卡片与导航条目都能进入新页
  - [ ] SubTask 8.3: 确认既有 `docs.html` / `docs-features.html` / `docs-faq.html` / `docs-tutorial.html` 未受影响

# Task Dependencies
- Task 2、Task 3 互相独立，可并行
- Task 4 依赖 Task 3（需要 `CONTENT.network` 存在）
- Task 5 依赖 Task 2（需要 `network.title` 等键存在）
- Task 6、Task 7 依赖 Task 3（写入正文内容）
- Task 8 依赖 Task 1–7 全部完成
