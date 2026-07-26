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
 *    配合下面的 NEXHUB_REPO_RAW，app.js 里的 RAW_BASE + id + ".json"
 *    会自动拼出正确的原始文件地址，app.js 的导入链接逻辑无需改动。
 *  - 本文件改为异步加载。app.js 需要等 NEXHUB_SOURCES_PROMISE 完成后再渲染
 *    一次源列表（见同目录 APPJS_CHANGE.md 的一次性改动说明）。
 * ============================================================ */

(function () {
  "use strict";

  var INDEX_URL =
    "https://raw.githubusercontent.com/nexhub-app/sources/main/index.json";

  // 导入链接前缀。index.json 的 id 形如 "manga/manga_goda"，
  // 故 RAW_BASE + id + ".json" => .../main/sources/manga/manga_goda.json
  window.NEXHUB_REPO_RAW =
    "https://raw.githubusercontent.com/nexhub-app/sources/main/sources/";

  window.NEXHUB_SOURCES_PROMISE = fetch(INDEX_URL)
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      var list = (data && data.sources) || [];
      var arr = list.map(function (s) {
        return {
          id: s.id,
          name: s.name,
          type: s.type || s.category, // manga / anime / novel（网页筛选标签）
          version: s.version,
          baseUrl: s.baseUrl,
          builtin: true, // 源库中的源均可导入
          format: s.format, // nexhub | legado（仅信息展示用）
          desc: s.desc || {}
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
