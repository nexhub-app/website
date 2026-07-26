/* ============================================================
 * NexHub 官方网站 — 交互逻辑（多页面版）
 * 职责：注入共享 header/footer、语言/主题切换、按页面渲染对应板块、筛选、菜单、手风琴。
 * 每个页面 <body data-page="home|features|download|docs|sources">，并把对应容器放在 <main> 内。
 * ============================================================ */

(function () {
  "use strict";

  /* GitHub 仓库地址（源导入链接、下载、GitHub 按钮都基于它） */
  var REPO = "https://github.com/nexhub-app/nexhub";
  var RAW_BASE = window.NEXHUB_REPO_RAW || "https://cdn.jsdelivr.net/gh/nexhub-app/sources@main/sources/";

  var I18N = window.I18N;
  var CONTENT = window.CONTENT;
  var SOURCES = window.NEXHUB_SOURCES || [];

  /* 页面 → 文件 映射 */
  var PAGES = [
    { key: "home", href: "index.html" },
    { key: "features", href: "features.html" },
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
      return '<div class="card guide">' +
        '<h3 class="guide-title">' + esc(item.title) + "</h3>" +
        '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.features"]) + '</div><ul class="guide-list">' + feats + "</ul></div>" +
        '<div class="guide-block"><div class="guide-label">' + esc(dict["guide.howto"]) + '</div><ol class="guide-list guide-ol">' + how + "</ol></div>" +
        "</div>";
    }).join("");
  }

  /* ---------- 渲染：文档手风琴 ---------- */
  function renderDocs() {
    var box = document.getElementById("docAccordion");
    if (!box) return;
    var arr = (CONTENT.docs && CONTENT.docs[state.lang]) || CONTENT.docs.zh;
    box.innerHTML = arr.map(function (d, i) {
      return '<div class="acc-item' + (i === 0 ? " open" : "") + '">' +
        '<button class="acc-q" type="button">' + esc(d.q) + '<span class="chev">▾</span></button>' +
        '<div class="acc-a"><div class="inner">' + esc(d.a) + "</div></div></div>";
    }).join("");
    box.querySelectorAll(".acc-item.open .acc-a").forEach(function (a) { a.style.maxHeight = a.scrollHeight + "px"; });
    box.querySelectorAll(".acc-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.parentElement;
        var panel = item.querySelector(".acc-a");
        var isOpen = item.classList.contains("open");
        box.querySelectorAll(".acc-item.open").forEach(function (it) {
          it.classList.remove("open");
          it.querySelector(".acc-a").style.maxHeight = null;
        });
        if (!isOpen) { item.classList.add("open"); panel.style.maxHeight = panel.scrollHeight + "px"; }
      });
    });
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
        copyText((window.NEXHUB_REPO_RAW || RAW_BASE) + id + ".json");
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
    renderHome(); renderFeatures(); renderDownloads(); renderGuide(); renderDocs(); renderSourceFilter(); renderSources();
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
    renderDocs();
    renderSourceFilter();
    renderSources();

    // 源数据来自源库 index.json，异步加载完成后重渲染一次源列表
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
