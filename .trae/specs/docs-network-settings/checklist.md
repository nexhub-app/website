# Checklist

## 页面与导航
- [x] `docs-network.html` 存在，骨架与 `docs-features.html` 一致（`doc-layout` / `doc-nav` / `doc-toc` / `doc-main`）
- [x] 正文容器 id 为 `networkBody`，右侧目录树 id 为 `networkToc`
- [x] 面包屑：NexHub / 文档中心 / 网络设置
- [x] `renderDocsNav()` 的 `sections` 列表中，「网络设置」位于「功能」之后、「常见问题」之前
- [x] `docs.html` 文档中心首页新增「网络设置」入口卡片，点击跳转 `docs-network.html`
- [x] 既有 `docs.html` / `docs-features.html` / `docs-faq.html` / `docs-tutorial.html` 渲染未受影响

## 内容覆盖（七大模块齐全）
- [x] 代理：direct/system/manual 三模式 + HTTP/SOCKS5 两协议 + 主机/端口/用户名/密码字段表
- [x] DNS：system/custom/DoH/DoT 四模式 + DNS 缓存开关 + 清理缓存 + 缓存条目数
- [x] DoH：https 端点 + 预设 Cloudflare/Google/Quad9 + URL 必须 https
- [x] DoT：host + port（默认 853）
- [x] 自定义 Hosts：IP→host 映射 + 每条可启用/禁用 + 优先级高于 DNS
- [x] SNI：默认 SNI 值 + 域名→SNI 映射 + 标注「实验性」并给出根因
- [x] ECH：ECH 配置列表(base64) + 标注「实验性」并给出根因
- [x] 每个模块都有「什么时候该启用 / 什么时候不要启用」建议

## 事实正确性（对齐客户端代码）
- [x] 代理密码走 flutter_secure_storage（key `network_proxy_password`），不入 JSON
- [x] 全局配置持久化 key 为 `network_config_v1`（SharedPreferences）
- [x] 源级覆盖持久化在 Hive box `source_network_overrides`，key=sourceId
- [x] 系统代理模式在桌面基于环境变量（尽力而为），非读取 OS GUI 代理
- [x] SOCKS5 仅 manual 模式有效；代理认证（addProxyCredentials）仅 HTTP 协议路径生效
- [x] DoT 默认端口 853、DNS 缓存默认开启、SNI/ECH 默认关闭
- [x] 自签证书：客户端 `badCertificateCallback` 容忍自签（部分源用非标准 SSL）

## 生效边界（明确告知）
- [x] 文档以表格列出「受影响」流量：封面、下载、云同步、源抓取等所有 dart:io HttpClient 派生流量
- [x] 文档以表格列出「不受影响」流量：WebView、播放器、投屏等走原生栈的组件
- [x] 文档说明源级覆盖仅作用于「经 HttpFetcher 的该源抓取」，封面图/原生组件不受源级覆盖影响
- [x] 文档说明合并优先级：用户 UI 覆盖 > 源文件 network 块 > 全局 > 默认

## 小白友好度
- [x] 开头有「概念铺垫」段，用大白话解释代理 / DNS / TLS 是什么、为什么要改
- [x] 「常见场景操作指引」至少 4 个分步流程：HTTP 代理 / DoH / Hosts / 单源覆盖
- [x] 「常见疑问」至少覆盖：网页视图不走代理 / ECH 不生效 / 密码存哪 / 自签证书 / 重置是否丢源
- [x] 全文无未解释的术语缩写首次出现即给出全称

## 多语言
- [x] `i18n.js` 中 `network.*` 与 `docs.cardNetwork*` 键 zh / en 均存在
- [x] 切换语言后，标题、面包屑、正文、左侧导航、右侧目录全部同步
- [x] `CONTENT.network` 同时提供 zh 与 en，结构一致

## 渲染机制
- [x] `app.js` 新增 `renderDocsNetwork()`，在 `initAll()` 与语言切换回调中被调用
- [x] `renderDocsNetwork()` 依据正文 `h2`/`h3` 自动生成 `#networkToc`
- [x] 本地静态服务下打开页面，左侧导航高亮当前页、右侧目录可跳转、正文正常显示
