/* ============================================================
 * NexHub 源仓库数据 — 动态加载（替代原硬编码的 NEXHUB_SOURCES）
 * ------------------------------------------------------------
 * 源清单来自独立「源库」仓库 nexhub-app/sources 的 index.json，
 * 由该仓库的 GitHub Action 在每次新增/修改源时自动生成。
 *
 * 新增源 = 往 nexhub-app/sources 的 sources/<分类>/ 放一个 JSON，
 * 无需改动本文件，网页下次打开自动出现。
 *
 * 关键点：
 *  - index.json 中每条 id 已含分类路径（如 "manga/manga_goda"），
 *    配合 NEXHUB_REPO_RAW，app.js 里的 RAW_BASE + id + ".json"
 *    会自动拼出正确的原始文件地址，app.js 的导入链接逻辑无需改动。
 *  - 本文件改为异步加载（NEXHUB_SOURCES_PROMISE），app.js 等其完成后再渲染。
 *
 * 国内可达性：raw.githubusercontent.com 在国内常被屏蔽，因此这里优先走
 *   jsDelivr CDN，失败再回退 ghproxy 镜像。不管最终用哪个源，导入链接
 *   (NEXHUB_REPO_RAW) 都会改写为当前真正可达的地址，保证「导入」也能用。
 * ============================================================ */

(function () {
  "use strict";

  var REPO = "nexhub-app/sources";
  var BRANCH = "main";

  // 候选数据源（按优先级）。每条对应一个「根地址」，拼 "index.json" / "sources/<id>.json" 即用。
  var CANDIDATES = [
    "https://cdn.jsdelivr.net/gh/" + REPO + "@" + BRANCH + "/",
    "https://ghproxy.net/https://raw.githubusercontent.com/" + REPO + "/" + BRANCH + "/",
    "https://raw.githubusercontent.com/" + REPO + "/" + BRANCH + "/"
  ];

  // 默认导入链接前缀（jsDelivr）。若最终从其它镜像加载成功，下方会改写为该镜像地址。
  window.NEXHUB_REPO_RAW = CANDIDATES[0] + "sources/";

  function tryLoad(idx) {
    if (idx >= CANDIDATES.length) {
      return Promise.reject(new Error("所有数据源均不可达"));
    }
    var base = CANDIDATES[idx];
    return fetch(base + "index.json")
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        return { base: base, data: data };
      })
      .catch(function (err) {
        console.warn("[sources] 数据源不可达，尝试下一个：" + base, err);
        return tryLoad(idx + 1);
      });
  }

  window.NEXHUB_SOURCES_PROMISE = tryLoad(0)
    .then(function (ok) {
      var base = ok.base;
      window.NEXHUB_REPO_RAW = base + "sources/"; // 让导入链接指向真正可达的镜像

      var list = (ok.data && ok.data.sources) || [];
      var arr = list.map(function (s) {
        return {
          id: s.id,
          name: s.name,
          type: s.type || s.category, // manga / anime / novel（网页筛选标签）
          version: s.version,
          baseUrl: s.baseUrl,
          builtin: true, // 源库中的源均可导入
          format: s.format, // nexhub | legado（仅信息展示用）
          desc: s.desc || {},
          rawUrl: base + "sources/" + s.id + ".json"
        };
      });
      window.NEXHUB_SOURCES = arr;
      return arr;
    })
    .catch(function (err) {
      console.error("[sources] 加载源库失败：", err);
      window.NEXHUB_SOURCES = [];
      return [];
    });
})();
