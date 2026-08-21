/* ============================================================
 * NexHub 官方网站 — 交互逻辑（多页面版）
 * 职责：注入共享 header/footer、语言/主题切换、按页面渲染对应板块、筛选、菜单、手风琴。
 * 每个页面 <body data-page="home|features|download|docs|sources">，并把对应容器放在 <main> 内。
 * ============================================================ */

(function () {
  "use strict";

  /* GitHub 仓库地址（源导入链接、下载、GitHub 按钮都基于它） */
  var REPO = "https://github.com/nexhub-app/nexhub";
  var RAW_BASE = window.NEXHUB_REPO_RAW || (REPO + "/raw/main/plugins/builtin/");

  var I18N = window.I18N;
  var CONTENT = window.CONTENT;
  var SOURCES = window.NEXHUB_SOURCES || [];

  /* 页面 → 文件 映射 */
  var PAGES = [
    { key: "home", href: "index.html" },
    { key: "download", href: "download.html" },
    { key: "docs", href: "docs.html" },
    { key: "sources", href: "sources.html" }
  ];

  /* ---------- 状态 ---------- */
  function getLang() {
    var s = localStorage.getItem("nexhub_lang");
    if (s === "zh" || s === "en") return s;
    var nav = (navigator.language || "zh").toLowerCase();
    return nav.indexOf("zh") === 0 ? "zh" : "en";
  }
  function getTheme() {
    var s = localStorage.getItem("nexhub_theme");
    if (s === "light" || s === "dark") return s;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var state = { lang: getLang(), theme: getTheme(), filter: "all" };
  var page = (document.body && document.body.getAttribute("data-page")) || "home";

  /* ---------- 文案应用 ---------- */
  function applyI18n() {
    var dict = I18N[state.lang] || I18N.zh;
    document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] == null) return;
      if (el.tagName === "META") el.setAttribute("content", dict[key]);
      else el.textContent = dict[key];
    });

    if (dict["pageTitle." + page]) document.title = dict["pageTitle." + page];

    var tBtn = document.getElementById("themeToggle");
    if (tBtn) {
      tBtn.querySelector(".theme-icon").textContent = state.theme === "dark" ? "☀️" : "🌙";
      tBtn.title = state.theme === "dark" ? dict["theme.toLight"] : dict["theme.toDark"];
    }

    ["githubLink", "heroGithub"].forEach(function (id) {
      var a = document.getElementById(id);
      if (a) a.href = REPO;
    });

    var yr = document.getElementById("footerCopyright");
    if (yr) yr.textContent = "© " + new Date().getFullYear() + " NexHub · " + dict["footer.rights"];

    var dh = document.getElementById("downloadHint");
    if (dh) dh.textContent = dict["download.hint"];
  }

  /* ---------- 注入 header / footer ---------- */
  function renderHeader() {
    var el = document.getElementById("siteHeader");
    if (!el) return;
    var dict = I18N[state.lang] || I18N.zh;
    var links = PAGES.map(function (p) {
      var active = p.key === page ? " active" : "";
      return '<a href="' + p.href + '" class="' + active.trim() + '" data-i18n="nav.' + p.key + '">' + esc(dict["nav." + p.key]) + "</a>";
    }).join("");
    el.innerHTML =
      '<div class="container nav">' +
        '<a class="brand" href="index.html" aria-label="NexHub">' +
          '<img src="./assets/app-icon.svg" alt="" width="30" height="30" /><span>NexHub</span></a>' +
        '<nav class="nav-links" id="navLinks">' + links + "</nav>" +
        '<div class="nav-actions">' +
          '<button class="icon-btn" id="langToggle" title="语言 / Language" aria-label="切换语言">中 / EN</button>' +
          '<button class="icon-btn" id="themeToggle" title="主题" aria-label="切换主题"><span class="theme-icon">🌙</span></button>' +
          '<a class="icon-btn ghost" id="githubLink" href="' + REPO + '" target="_blank" rel="noopener">GitHub</a>' +
          '<button class="icon-btn menu-btn" id="menuToggle" aria-label="菜单" aria-expanded="false">☰</button>' +
        "</div>" +
      "</div>";
  }

  function renderFooter() {
    var el = document.getElementById("siteFooter");
    if (!el) return;
    var dict = I18N[state.lang] || I18N.zh;
    el.innerHTML =
      '<div class="container footer-inner">' +
        '<div class="footer-brand"><img src="./assets/app-icon.svg" alt="" width="26" height="26" /><span>NexHub</span></div>' +
        '<p class="disclaimer" data-i18n="footer.disclaimer">' + esc(dict["footer.disclaimer"]) + "</p>" +
        '<p class="copyright" id="footerCopyright"></p>' +
      "</div>";
  }

  /* ---------- 渲染：首页亮点 ---------- */
  function renderHome() {
    var box = document.getElementById("homeGrid");
    if (!box) return;
    var arr = (CONTENT.home && CONTENT.home[state.lang]) || CONTENT.home.zh;
    box.innerHTML = arr.map(function (f) {
      return '<div class="card feature"><div class="f-icon">' + f.icon + "</div><h3>" + esc(f.title) + "</h3><p>" + esc(f.desc) + "</p></div>";
    }).join("");
  }

  /* ---------- 渲染：功能 ---------- */
  function renderFeatures() {
    var box = document.getElementById("featureGrid");
    if (!box) return;
    var arr = (CONTENT.features && CONTENT.features[state.lang]) || CONTENT.features.zh;
    box.innerHTML = arr.map(function (f) {
      return '<div class="card feature"><div class="f-icon">' + f.icon + "</div><h3>" + esc(f.title) + "</h3><p>" + esc(f.desc) + "</p></div>";
    }).join("");
  }

  /* ---------- 渲染：下载 ---------- */
  function renderDownloads() {
    var box = document.getElementById("downloadGrid");
    if (!box) return;
    var arr = (CONTENT.downloads && CONTENT.downloads[state.lang]) || CONTENT.downloads.zh;
    box.innerHTML = arr.map(function (d) {
      return '<div class="card dl">' +
        '<div class="dl-head"><span class="icon">' + d.icon + '</span><span class="name">' + esc(d.name) + "</span></div>" +
        '<div class="desc">' + esc(d.desc) + "</div>" +
        '<a class="btn btn-primary" href="' + REPO + '/releases/latest" target="_blank" rel="noopener">' + esc(d.btn) + "</a>" +
        '<div class="note">' + esc(d.note) + "</div></div>";
    }).join("");
  }

  /* ---------- 渲染：使用指南（小说 / 视频 / 漫画） ---------- */
  function renderGuide() {
    var box = document.getElementById("guideGrid");
    if (!box) return;
    var dict = I18N[state.lang] || I18N.zh;
    var g = (CONTENT.guide && CONTENT.guide[state.lang]) || CONTENT.guide.zh;
    var order = ["novel", "video", "manga"];
    box.innerHTML = order.map(function (k) {
      var item = g[k];
      var feats = item.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
      var how = item.howto.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
      var ctrls = (item.controls || []).map(function (c) {
        return '<li class="ctrl-item"><span class="ctrl-key">' + esc(c.key) + '</span><span class="ctrl-desc">' + esc(c.desc) + '</span></li>';
      }).join("");
      var sets = (item.settings || []).map(function (s) {
        return '<li class="ctrl-item"><span class="ctrl-key">' + esc(s.key) + '</span><span class="ctrl-desc">' + esc(s.desc) + '</span></li>';
      }).join("");
      return '<div class="card guide">' +
        '<h3 class="guide-title">' + esc(item.title) + "</h3>" +
        '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.features"]) + '</div><ul class="guide-list">' + feats + "</ul></div>" +
        '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.howto"]) + '</div><ol class="guide-list guide-ol">' + how + "</ol></div>" +
        (ctrls ? '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.controls"]) + '</div><ul class="guide-list guide-ctrls">' + ctrls + "</ul></div>" : "") +
        (sets ? '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.settings"]) + '</div><ul class="guide-list guide-ctrls">' + sets + "</ul></div>" : "") +
        "</div>";
    }).join("");
  }

  /* ---------- 渲染：文档中心统一导航（左侧板块） ---------- */
  function renderDocsNav() {
    var tree = document.getElementById("docNavTree");
    if (!tree) return;
    var dict = I18N[state.lang] || I18N.zh;
    var sections = [
      { id: "intro", href: "docs.html", titleKey: "docs.centerTitle" },
      { id: "features", href: "docs-features.html", titleKey: "features.title" },
      { id: "network", href: "docs-network.html", titleKey: "network.title" },
      { id: "faq", href: "docs-faq.html", titleKey: "docs.faqTitle" },
      { id: "tutorial", href: "docs-tutorial.html", titleKey: "docs.tutorialTitle" }
    ];
    var currentPage = window.location.pathname.split("/").pop() || "docs.html";
    if (!currentPage || currentPage === "index.html") currentPage = "docs.html";

    tree.innerHTML = '<div class="doc-nav-group">' +
      '<div class="doc-nav-group-title">文档</div>' +
      sections.map(function (s) {
        var active = currentPage === s.href ? " active" : "";
        return '<a class="doc-nav-link' + active + '" href="' + esc(s.href) + '">' + esc(dict[s.titleKey] || s.id) + '</a>';
      }).join("") +
      '</div>';
  }

  /* ---------- 渲染：文档首页 ---------- */
  function renderDocsIntro() {
    var body = document.getElementById("docsBody");
    var toc = document.getElementById("docsToc");
    if (!body) return;
    var dict = I18N[state.lang] || I18N.zh;

    body.innerHTML = '<section class="doc-section" id="docs-welcome">' +
      '<h2 class="doc-h2">' + esc(dict["docs.centerTitle"] || "文档中心") + '<a class="doc-anchor" href="#docs-welcome" aria-hidden="true">#</a></h2>' +
      '<div class="doc-section-body"><p>' + esc(dict["docs.centerSubtitle"]) + '</p></div>' +
      '<div class="grid doc-cards">' +
        '<a class="card doc-card" href="docs-features.html"><div class="f-icon">✨</div><h3>' + esc(dict["docs.cardFeaturesTitle"]) + '</h3><p>' + esc(dict["docs.cardFeaturesDesc"]) + '</p><span class="card-link" aria-hidden="true">→</span></a>' +
        '<a class="card doc-card" href="docs-network.html"><div class="f-icon">🌐</div><h3>' + esc(dict["docs.cardNetworkTitle"]) + '</h3><p>' + esc(dict["docs.cardNetworkDesc"]) + '</p><span class="card-link" aria-hidden="true">→</span></a>' +
        '<a class="card doc-card" href="docs-faq.html"><div class="f-icon">❓</div><h3>' + esc(dict["docs.cardFaqTitle"]) + '</h3><p>' + esc(dict["docs.cardFaqDesc"]) + '</p><span class="card-link" aria-hidden="true">→</span></a>' +
        '<a class="card doc-card" href="docs-tutorial.html"><div class="f-icon">📝</div><h3>' + esc(dict["docs.cardTutTitle"]) + '</h3><p>' + esc(dict["docs.cardTutDesc"]) + '</p><span class="card-link" aria-hidden="true">→</span></a>' +
      '</div></section>';

    if (toc) {
      toc.innerHTML = '<a class="doc-toc-link" href="#docs-welcome">' + esc(dict["docs.centerTitle"]) + '</a>';
    }

    initDocScrollSpy(["docs-welcome"]);
  }

  /* ---------- 渲染：功能文档页 ---------- */
  function renderDocsFeatures() {
    var body = document.getElementById("featuresBody");
    var toc = document.getElementById("featuresToc");
    if (!body || !toc) return;
    var dict = I18N[state.lang] || I18N.zh;
    var features = (CONTENT.features && CONTENT.features[state.lang]) || CONTENT.features.zh;
    var guide = (CONTENT.guide && CONTENT.guide[state.lang]) || CONTENT.guide.zh;
    var order = ["novel", "video", "manga"];

    // 核心功能
    var core = '<section class="doc-section" id="features-core">' +
      '<h2 class="doc-h2">' + esc(dict["features.title"] || "核心功能") + '<a class="doc-anchor" href="#features-core" aria-hidden="true">#</a></h2>' +
      '<div class="doc-grid-2">' + features.map(function (f) {
        return '<div class="doc-card"><div class="doc-card-icon">' + f.icon + '</div><h3>' + esc(f.title) + '</h3><p>' + esc(f.desc) + '</p></div>';
      }).join("") + '</div></section>';

    // 使用指南（各阅读器）
    var guides = order.map(function (k) {
      var item = guide[k];
      var feats = item.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
      var how = item.howto.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
      var ctrls = (item.controls || []).map(function (c) {
        return '<li class="ctrl-item"><span class="ctrl-key">' + esc(c.key) + '</span><span class="ctrl-desc">' + esc(c.desc) + '</span></li>';
      }).join("");
      var sets = (item.settings || []).map(function (s) {
        return '<li class="ctrl-item"><span class="ctrl-key">' + esc(s.key) + '</span><span class="ctrl-desc">' + esc(s.desc) + '</span></li>';
      }).join("");
      return '<section class="doc-section" id="guide-' + k + '">' +
        '<h2 class="doc-h2">' + esc(item.title) + '<a class="doc-anchor" href="#guide-' + k + '" aria-hidden="true">#</a></h2>' +
        '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.features"]) + '</div><ul class="guide-list">' + feats + '</ul></div>' +
        '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.howto"]) + '</div><ol class="guide-list guide-ol">' + how + '</ol></div>' +
        (ctrls ? '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.controls"]) + '</div><ul class="guide-list guide-ctrls">' + ctrls + '</ul></div>' : "") +
        (sets ? '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.settings"]) + '</div><ul class="guide-list guide-ctrls">' + sets + '</ul></div>' : "") +
        '</section>';
    }).join("");

    body.innerHTML = core + guides;

    // 右侧大纲
    toc.innerHTML = '<a class="doc-toc-link" href="#features-core">' + esc(dict["features.title"] || "核心功能") + '</a>' +
      order.map(function (k) {
        return '<a class="doc-toc-link" href="#guide-' + k + '">' + esc(guide[k].title) + '</a>';
      }).join("");

    initDocScrollSpy(["features-core"].concat(order.map(function (k) { return "guide-" + k; })));
  }

  /* ---------- 渲染：网络设置文档页 ---------- */
  function renderDocsNetwork() {
    var body = document.getElementById("networkBody");
    var toc = document.getElementById("networkToc");
    if (!body || !toc) return;
    var dict = I18N[state.lang] || I18N.zh;
    var data = (CONTENT.network && CONTENT.network[state.lang]) || CONTENT.network.zh;
    if (!data || !data.sections) { body.innerHTML = ""; toc.innerHTML = ""; return; }

    function renderBlock(b) {
      if (b.type === "p") {
        // 支持 \n\n 分段与 \n 单换行
        return (b.text || "").split("\n").map(function (line) {
          return '<p>' + esc(line) + '</p>';
        }).join("");
      }
      if (b.type === "table") {
        var rows = (b.rows || []).map(function (r) {
          return '<tr><td class="doc-table-k">' + esc(r.k) + '</td><td class="doc-table-v">' + esc(r.v) + '</td></tr>';
        }).join("");
        return '<div class="doc-table-wrap"><table class="doc-table"><tbody>' + rows + '</tbody></table></div>';
      }
      if (b.type === "callout") {
        var cls = b.variant === "warn" ? "doc-callout warn" : "doc-callout info";
        var icon = b.variant === "warn" ? "⚠️" : "💡";
        return '<div class="' + cls + '"><span class="doc-callout-icon" aria-hidden="true">' + icon + '</span><span>' + esc(b.text || "") + '</span></div>';
      }
      if (b.type === "steps") {
        var title = b.title ? '<div class="guide-label">' + esc(b.title) + '</div>' : '';
        var items = (b.items || []).map(function (it) { return '<li>' + esc(it) + '</li>'; }).join("");
        return '<div class="guide-block">' + title + '<ol class="guide-list guide-ol">' + items + '</ol></div>';
      }
      return "";
    }

    body.innerHTML = data.sections.map(function (s) {
      var blocksHtml = (s.blocks || []).map(renderBlock).join("");
      return '<section class="doc-section" id="' + esc(s.id) + '">' +
        '<h2 class="doc-h2">' + esc(s.title) + '<a class="doc-anchor" href="#' + esc(s.id) + '" aria-hidden="true">#</a></h2>' +
        '<div class="doc-section-body">' + blocksHtml + '</div></section>';
    }).join("");

    toc.innerHTML = data.sections.map(function (s) {
      return '<a class="doc-toc-link" href="#' + esc(s.id) + '">' + esc(s.title) + '</a>';
    }).join("");

    initDocScrollSpy(data.sections.map(function (s) { return s.id; }));
  }

  /* ---------- 渲染：常见问题文档页 ---------- */
  function renderDocsFaq() {
    var body = document.getElementById("faqBody");
    var toc = document.getElementById("faqToc");
    if (!body || !toc) return;
    var arr = (CONTENT.docs && CONTENT.docs[state.lang]) || CONTENT.docs.zh;

    body.innerHTML = arr.map(function (d, i) {
      return '<section class="doc-section" id="faq-' + i + '">' +
        '<h2 class="doc-h2">' + esc(d.q) + '<a class="doc-anchor" href="#faq-' + i + '" aria-hidden="true">#</a></h2>' +
        '<div class="doc-section-body"><p>' + esc(d.a) + '</p></div></section>';
    }).join("");

    toc.innerHTML = arr.map(function (d, i) {
      return '<a class="doc-toc-link" href="#faq-' + i + '">' + esc(d.q) + '</a>';
    }).join("");

    initDocScrollSpy(arr.map(function (_, i) { return "faq-" + i; }));
  }

  /* ---------- 渲染：源编写教程（右侧章节） ---------- */
  function renderTutorial() {
    var body = document.getElementById("tutorialBody");
    var tocTree = document.getElementById("docTocTree");
    if (!body || !tocTree) return;

    var arr = (CONTENT.tutorial && CONTENT.tutorial[state.lang]) || CONTENT.tutorial.zh;
    var dict = I18N[state.lang] || I18N.zh;

    // 按 group 分组（右侧大纲）
    var groupOrder = ["basic", "intermediate", "advanced"];
    var groups = {};
    groupOrder.forEach(function (g) { groups[g] = []; });
    arr.forEach(function (m) {
      var g = m.group || "basic";
      if (!groups[g]) groups[g] = [];
      groups[g].push(m);
    });

    tocTree.innerHTML = groupOrder.map(function (g) {
      var items = groups[g];
      if (!items || !items.length) return "";
      return '<div class="doc-toc-group">' +
        '<div class="doc-toc-group-title">' + esc(dict["tutorial.group." + g] || g) + '</div>' +
        items.map(function (m) {
          return '<a class="doc-toc-link" href="#tut-' + esc(m.id) + '">' + esc(m.title) + '</a>';
        }).join("") +
        '</div>';
    }).join("");

    // 中间正文
    body.innerHTML = arr.map(function (m) {
      var fields = "";
      if (m.fields && m.fields.length) {
        fields = '<div class="doc-table-wrap"><table class="doc-table"><tbody>' +
          m.fields.map(function (f) {
            return '<tr><td class="doc-table-k">' + esc(f.k) + '</td><td class="doc-table-v">' + esc(f.v) + '</td></tr>';
          }).join("") +
          '</tbody></table></div>';
      }
      var code = m.code ? '<pre class="doc-code"><code>' + esc(m.code) + '</code></pre>' : '';
      var paragraphs = (m.body || "").split("\n").map(function (p) {
        return '<p>' + esc(p) + '</p>';
      }).join("");
      return '<section class="doc-section" id="tut-' + esc(m.id) + '">' +
        '<h2 class="doc-h2">' + esc(m.title) + '<a class="doc-anchor" href="#tut-' + esc(m.id) + '" aria-hidden="true">#</a></h2>' +
        '<div class="doc-section-body">' + paragraphs + '</div>' + fields + code + '</section>';
    }).join("");

    initDocScrollSpy(arr.map(function (m) { return "tut-" + m.id; }));
  }

  function initDocNav() {
    var toggle = document.getElementById("docNavToggle");
    var nav = document.getElementById("docNav");
    if (!toggle || !nav) return;

    var backdrop = document.createElement("div");
    backdrop.className = "doc-nav-backdrop";
    document.body.appendChild(backdrop);

    function setNav(open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      backdrop.classList.toggle("show", open);
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setNav(!nav.classList.contains("open"));
    });
    backdrop.addEventListener("click", function () { setNav(false); });
    nav.querySelectorAll(".doc-nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 900) setNav(false);
      });
    });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(e.target)) return;
      setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) setNav(false);
    });
  }

  function initDocScrollSpy(sections) {
    var links = document.querySelectorAll(".doc-toc-link");
    var secEls = sections.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    function onScroll() {
      var scrollPos = window.scrollY + 120;
      var activeId = null;
      for (var i = secEls.length - 1; i >= 0; i--) {
        var sec = secEls[i];
        if (sec && sec.offsetTop <= scrollPos) { activeId = sec.id; break; }
      }
      if (!activeId && secEls.length) activeId = secEls[0].id;
      links.forEach(function (link) {
        var href = link.getAttribute("href");
        link.classList.toggle("active", href === "#" + activeId);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 渲染：源筛选 + 列表 ---------- */
  function renderSourceFilter() {
    var dict = I18N[state.lang] || I18N.zh;
    var types = [];
    SOURCES.forEach(function (s) { if (types.indexOf(s.type) === -1) types.push(s.type); });
    var box = document.getElementById("sourceFilter");
    if (!box) return;
    var html = '<button class="chip' + (state.filter === "all" ? " active" : "") + '" data-type="all">' + esc(dict["sources.all"]) + "</button>";
    html += types.map(function (t) {
      return '<button class="chip' + (state.filter === t ? " active" : "") + '" data-type="' + t + '">' + esc(dict["sources.type." + t] || t) + "</button>";
    }).join("");
    box.innerHTML = html;
    box.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        state.filter = c.getAttribute("data-type");
        renderSourceFilter();
        renderSources();
      });
    });
  }

  function renderSources() {
    var dict = I18N[state.lang] || I18N.zh;
    var box = document.getElementById("sourceGrid");
    if (!box) return;
    var list = SOURCES.filter(function (s) { return state.filter === "all" || s.type === state.filter; });
    if (!list.length) { box.innerHTML = ""; return; }
    box.innerHTML = list.map(function (s) {
      var ver = (typeof s.version === "number") ? String(s.version) : s.version;
      var desc = (s.desc && s.desc[state.lang]) || (s.desc && s.desc.zh) || "";
      var typeLabel = dict["sources.type." + s.type] || s.type;
      var badge = s.builtin
        ? '<span class="tag tag-builtin">' + esc(dict["sources.builtin"]) + "</span>"
        : '<span class="tag tag-community">' + esc(dict["sources.community"]) + "</span>";
      var action = s.builtin
        ? '<button class="btn btn-outline" type="button" data-import="' + esc(s.id) + '">' + esc(dict["sources.import"]) + "</button>"
        : '<span class="btn btn-outline disabled" style="cursor:default;text-align:center">' + esc(dict["sources.soon"]) + "</span>";
      return '<div class="card src">' +
        '<div class="src-top"><span class="src-name">' + esc(s.name) + "</span>" +
        '<div class="src-badges"><span class="tag tag-type">' + esc(typeLabel) + "</span>" + badge +
        '<span class="tag tag-ver">v' + esc(ver) + "</span></div></div>" +
        '<div class="desc">' + esc(desc) + "</div>" +
        '<div class="url">' + esc(s.baseUrl) + "</div>" + action + "</div>";
    }).join("");

    box.querySelectorAll("[data-import]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-import");
        copyText(RAW_BASE + id + ".json");
        showToast(dict["copied"]);
      });
    });
  }

  /* ---------- 工具 ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {});
    } else {
      var ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
    }
  }
  var toastTimer;
  function showToast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- 语言 / 主题切换 ---------- */
  function setLang(lang) {
    state.lang = lang;
    localStorage.setItem("nexhub_lang", lang);
    applyI18n();
    renderHome(); renderFeatures(); renderDownloads(); renderGuide();
    renderDocsNav(); renderDocsIntro(); renderDocsFeatures(); renderDocsNetwork(); renderDocsFaq(); renderTutorial();
    renderSourceFilter(); renderSources();
    if (window.NEXHUB_SOURCES_PROMISE) {
      window.NEXHUB_SOURCES_PROMISE.then(function () {
        SOURCES = window.NEXHUB_SOURCES || [];
        renderSourceFilter();
        renderSources();
      });
    }
  }
  function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem("nexhub_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    var tBtn = document.getElementById("themeToggle");
    if (tBtn) {
      tBtn.querySelector(".theme-icon").textContent = theme === "dark" ? "☀️" : "🌙";
      tBtn.title = theme === "dark" ? I18N[state.lang]["theme.toLight"] : I18N[state.lang]["theme.toDark"];
    }
  }

  /* ---------- 初始化 ---------- */
  function init() {
    document.documentElement.setAttribute("data-theme", state.theme);
    renderHeader();
    renderFooter();
    applyI18n();
    renderHome();
    renderFeatures();
    renderDownloads();
    renderGuide();
    renderDocsNav();
    renderDocsIntro();
    renderDocsFeatures();
    renderDocsNetwork();
    renderDocsFaq();
    renderTutorial();
    initDocNav();
    renderSourceFilter();
    renderSources();

    if (window.NEXHUB_SOURCES_PROMISE) {
      window.NEXHUB_SOURCES_PROMISE.then(function () {
        SOURCES = window.NEXHUB_SOURCES || [];
        renderSourceFilter();
        renderSources();
      });
    }

    var langBtn = document.getElementById("langToggle");
    if (langBtn) langBtn.addEventListener("click", function () { setLang(state.lang === "zh" ? "en" : "zh"); });

    var themeBtn = document.getElementById("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", function () { setTheme(state.theme === "dark" ? "light" : "dark"); });

    var menuBtn = document.getElementById("menuToggle");
    var navLinks = document.getElementById("navLinks");
    if (menuBtn && navLinks) {
      menuBtn.addEventListener("click", function () {
        var open = navLinks.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      navLinks.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); });
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
