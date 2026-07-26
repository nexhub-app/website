/* ============================================================
 * NexHub 源仓库数据
 * 这里列出「内置源」的真实元信息（来自 plugins/builtin/*.json）。
 * 想新增源：往 NEXHUB_SOURCES 里加一项即可。
 *
 * 字段说明：
 *   id        源文件 id（与 plugins/builtin/<id>.json 对应）
 *   type      anime(影视/动漫) | manga(漫画) | novel(小说)
 *   version   源版本号（字符串或数字均可）
 *   baseUrl   源站主域名
 *   builtin   true=随包内置；false=社区源（仅展示，不提供导入链接）
 *   desc      { zh, en } 双语描述
 * ============================================================ */

/* 内置源 raw 地址前缀（与上面的 REPO 对应；仓库根目录下放了 plugins/builtin/） */
window.NEXHUB_REPO_RAW = "https://raw.githubusercontent.com/nexhub-app/website/main/plugins/builtin/";

window.NEXHUB_SOURCES = [
  {
    id: "pms_girigirilove",
    name: "花子动漫",
    type: "anime",
    version: 1,
    baseUrl: "https://ani.girigirilove.com",
    builtin: true,
    desc: {
      zh: "影视 / 动漫聚合源，提供动漫、剧场版、国产、日韩、欧美等分类的浏览与搜索。",
      en: "Anime/video source with categories: anime, movies, domestic, JK/Western — browse & search."
    }
  },
  {
    id: "pms_m233",
    name: "233动漫",
    type: "anime",
    version: 1,
    baseUrl: "https://cn.233dm.com",
    builtin: true,
    desc: {
      zh: "影视 / 动漫聚合源，覆盖动漫、剧场版、国产、日韩、欧美等分区。",
      en: "Anime/video source covering anime, movies, domestic, JK/Western sections."
    }
  },
  {
    id: "pms_dalvdm",
    name: "打驴动漫",
    type: "anime",
    version: 1,
    baseUrl: "https://www.dalvdm.cc",
    builtin: true,
    desc: {
      zh: "影视 / 动漫聚合源，提供多分区番剧与剧场版的检索。",
      en: "Anime/video source offering multi-section anime and movie search."
    }
  },
  {
    id: "manga_goda",
    name: "GoDa漫画",
    type: "manga",
    version: 4,
    baseUrl: "https://godamh.com",
    builtin: true,
    desc: {
      zh: "漫画源（v4），支持韩漫、国漫、日漫、欧美及古风、复仇、奇幻等数十个标签分类。",
      en: "Manga source (v4) with KR/CN/JP/Western sections and dozens of tags like gufeng, revenge, fantasy."
    }
  },
  {
    id: "manga_baozimh",
    name: "Bun漫畫",
    type: "manga",
    version: "1.0.0",
    baseUrl: "https://m.baozimh.one",
    builtin: true,
    desc: {
      zh: "漫画源，支持韩漫、国漫、日漫、欧美等分类，图片经接口加密后客户端解密渲染。",
      en: "Manga source with KR/CN/JP/Western sections; images are decrypted client-side."
    }
  },

  /* ---- 小说（社区/示例源，待接入 plugins/builtin 后可改为内置） ---- */
  {
    id: "novel_81txt",
    name: "八一中文",
    type: "novel",
    version: 1,
    baseUrl: "https://www.81txt.net",
    builtin: false,
    desc: {
      zh: "小说源（社区示例），免费小说站，结构清晰，支持分类浏览与搜索。",
      en: "Novel source (community sample). Free novel site with clean structure, browse & search."
    }
  },
  {
    id: "novel_biquge",
    name: "笔趣阁",
    type: "novel",
    version: 1,
    baseUrl: "https://m.biqubu3.com",
    builtin: false,
    desc: {
      zh: "小说源（社区示例），涵盖玄幻、修真、都市、历史、网游、科幻等分类。",
      en: "Novel source (community sample) with xuanhuan, xiuzhen, urban, history, sci-fi sections."
    }
  },
  {
    id: "novel_ranwen",
    name: "燃文小说",
    type: "novel",
    version: 1,
    baseUrl: "https://www.hzmdgj.com",
    builtin: false,
    desc: {
      zh: "小说源（社区示例），涵盖玄幻魔法、武侠修真、都市言情、历史军事等分类。",
      en: "Novel source (community sample) with fantasy, wuxia, urban, history sections."
    }
  }
];
