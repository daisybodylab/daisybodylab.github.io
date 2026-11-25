/* DAISY BODYLAB — main.js : data/site-data.js 내용을 화면에 연결합니다. */
(function () {
  "use strict";

  var D = window.DAISY_DATA || {};
  var C = D.contact || {};
  var L = D.location || {};
  var IMG = D.images || {};
  var PENDING = "확인 후 안내 예정";

  /* 다국어: 화면을 바꾸기 전에 한국어 원문을 기억해 둡니다 */
  Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (n) { n.setAttribute("data-i18n-ko", n.innerHTML); });
  var KO_TITLE = document.title;
  var metaDesc = document.querySelector('meta[name="description"]');
  var KO_DESC = metaDesc ? metaDesc.getAttribute("content") : "";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  try {
  /* ---------- 사진: 경로가 있으면 이미지, 없으면 자리표시 ---------- */
  function fillMedia(fig, src, alt) {
    if (!src) return;
    var img = new Image();
    img.src = src;
    img.alt = alt || "";
    img.loading = fig.classList.contains("media-hero") ? "eager" : "lazy";
    img.decoding = "async";
    fig.appendChild(img);
    fig.classList.add("has-img");
  }
  $all("[data-img]").forEach(function (fig) {
    fillMedia(fig, IMG[fig.getAttribute("data-img")], fig.getAttribute("data-alt"));
  });

  /* ---------- 텍스트 ---------- */
  var texts = {
    address: L.address,
    roadAddress: L.roadAddress,
    parking: L.parking,
    parkingDetail: L.parkingDetail,
    instagramHandle: C.instagramHandle,
    kakaoName: C.kakaoName,
    youtubeName: C.youtubeName
  };
  $all("[data-text]").forEach(function (n) {
    var key = n.getAttribute("data-text");
    var v = texts[key];
    if (v) n.textContent = v;
    else if (!n.classList.contains("sub")) n.textContent = PENDING;
  });

  /* ---------- 외부 링크: 값이 없으면 '준비 중' 처리 ---------- */
  var phoneDigits = (C.phone || "").replace(/[^0-9+]/g, "");
  var links = {
    reservation: C.reservationUrl ? { href: C.reservationUrl, external: true } : null,
    phone: phoneDigits ? { href: "tel:" + phoneDigits } : null,
    instagram: C.instagramUrl ? { href: C.instagramUrl, external: true } : null,
    blog: C.blogUrl ? { href: C.blogUrl, external: true } : null,
    kakao: C.kakaoUrl ? { href: C.kakaoUrl, external: true } : null,
    youtube: C.youtubeUrl ? { href: C.youtubeUrl, external: true } : null,
    youtubeVideo: C.youtubeVideoUrl ? { href: C.youtubeVideoUrl, external: true } : null,
    map: C.mapUrl ? { href: C.mapUrl, external: true } : null,
    naverReview: (C.naverReviewUrl || C.mapUrl) ? { href: C.naverReviewUrl || C.mapUrl, external: true } : null
  };
  /* 전화: 평소에는 '전화 문의'만 보이고, 누르면 번호가 나타납니다. 번호를 다시 누르면 전화 연결. */
  function setupPhone(a) {
    var label = a.textContent;
    a.removeAttribute("href");
    a.setAttribute("role", "button");
    a.setAttribute("tabindex", "0");
    a.setAttribute("aria-label", label + " — 눌러서 번호 보기");
    a.classList.add("phone-reveal");
    function reveal(e) {
      if (a.classList.contains("is-revealed")) return; // 이미 열린 뒤에는 tel: 링크로 동작
      e.preventDefault();
      a.textContent = C.phone;
      a.href = "tel:" + phoneDigits;
      a.removeAttribute("role");
      a.setAttribute("aria-label", C.phone + " 전화 걸기");
      a.classList.add("is-revealed");
      $all(".phone-reveal:not(.is-revealed)").forEach(function (o) { o.dispatchEvent(new Event("phone:reveal")); });
    }
    a.addEventListener("click", reveal);
    a.addEventListener("phone:reveal", function () {
      if (a.classList.contains("is-revealed")) return;
      a.textContent = C.phone; a.href = "tel:" + phoneDigits; a.removeAttribute("role");
      a.setAttribute("aria-label", C.phone + " 전화 걸기"); a.classList.add("is-revealed");
    });
    a.addEventListener("keydown", function (e) {
      if (!a.classList.contains("is-revealed") && (e.key === "Enter" || e.key === " ")) reveal(e);
    });
  }

  $all("[data-link]").forEach(function (a) {
    var link = links[a.getAttribute("data-link")];
    if (link && a.getAttribute("data-link") === "phone") {
      setupPhone(a);
    } else if (link) {
      a.href = link.href;
      if (link.external) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    } else {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.classList.add("is-pending");
      a.appendChild(el("span", "pending-tag", "준비 중"));
    }
  });

  /* 모바일 하단 바: 준비 중인 버튼은 숨기고 남은 버튼 수에 맞춰 배치 */
  var bar = document.querySelector(".mobile-bar");
  if (bar) {
    $all(".mobile-bar .is-pending").forEach(function (n) { n.hidden = true; });
    var kakaoBtn = bar.querySelector('[data-link="kakao"]');
    if (!links.reservation && kakaoBtn && links.kakao && bar.querySelector('[data-link="reservation"]')) { kakaoBtn.classList.remove("btn-line"); kakaoBtn.classList.add("btn-primary"); kakaoBtn.setAttribute("data-i18n", "ct.kakao"); kakaoBtn.setAttribute("data-i18n-ko", "카카오톡 상담"); kakaoBtn.textContent = "카카오톡 상담"; }
    var shown = $all(".mobile-bar > a:not([hidden])").length;
    bar.style.gridTemplateColumns = "repeat(" + Math.max(shown, 1) + ", minmax(0, 1fr))";
    if (!shown) bar.hidden = true;
  }

  /* 운영시간 */
  var hoursBox = document.querySelector("[data-hours]");
  if (hoursBox) {
    var hours = D.hours || [];
    if (!hours.length) hoursBox.textContent = PENDING;
    hours.forEach(function (h) {
      var row = el("span", "hours-row");
      row.style.display = "flex";
      row.appendChild(el("span", null, h.day));
      row.appendChild(el("span", null, h.time));
      hoursBox.appendChild(row);
    });
  }

  /* 지도: 카카오 지도가 그려지면 그대로 두고, 아니면 네이버 길찾기 카드로 대체 */
  var map = document.querySelector("[data-map]");
  function showNaverCard() {
    if (!map || !links.map || map.classList.contains("map-card")) return;
    map.textContent = "";
    map.classList.add("map-card");
    var pin = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    pin.setAttribute("viewBox", "0 0 24 24"); pin.setAttribute("aria-hidden", "true"); pin.setAttribute("class", "map-pin");
    pin.innerHTML = '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.5"/>';
    map.appendChild(pin);
    var mn = el("p", "map-name", "데이지 체형&재활 운동센터");
    mn.setAttribute("data-i18n", "ui.mapName"); mn.setAttribute("data-i18n-ko", mn.textContent);
    map.appendChild(mn);
    var ma = el("p", "map-addr", L.address || ""); ma.setAttribute("data-text", "address");
    map.appendChild(ma);
    var ml = el("a", "btn btn-primary", "네이버 지도에서 길찾기");
    ml.setAttribute("data-i18n", "ct.mapNaver"); ml.setAttribute("data-i18n-ko", ml.textContent);
    ml.href = links.map.href; ml.target = "_blank"; ml.rel = "noopener noreferrer";
    map.appendChild(ml);
    var extra = document.querySelector(".map-naver"); if (extra) extra.hidden = true;
    if (window.DAISY_setLang) window.DAISY_setLang(window.DAISY_lang || "ko", true);
  }
  function checkKakao() {
    var k = document.querySelector("[data-kakao-map]");
    if (!k || !k.children.length) showNaverCard();
  }
  if (document.readyState === "complete") setTimeout(checkKakao, 3000);
  else window.addEventListener("load", function () { setTimeout(checkKakao, 3000); });

  /* ---------- 대표 ---------- */
  var dir = D.director || {};
  var dn = document.querySelector("[data-director-name]");
  if (dn && dir.name) dn.textContent = "대표 " + dir.name;
  var cl = document.querySelector("[data-director-credentials]");
  if (cl) (dir.credentials || []).forEach(function (c) { if (c) cl.appendChild(el("li", null, c)); });

  /* ---------- 인스타그램 게시물 (Behold 위젯) ---------- */
  var igBox = document.querySelector("[data-insta-feed]");
  if (igBox) {
    if (C.instagramFeedId) {
      var bw = document.createElement("behold-widget");
      bw.setAttribute("feed-id", C.instagramFeedId);
      igBox.appendChild(bw);
      var bs = document.createElement("script");
      bs.type = "module"; bs.src = "https://w.behold.so/widget.js";
      document.head.appendChild(bs);
    } else {
      var card = el("a", "insta-card");
      card.href = C.instagramUrl || "#"; if (C.instagramUrl) { card.target = "_blank"; card.rel = "noopener noreferrer"; }
      card.appendChild(el("span", "insta-handle", "@daisy_bodylab"));
      card.appendChild(el("span", "insta-desc", "운동 영상, 센터 소식, 회원님들의 운동 모습을 인스타그램에서 만나 보세요."));
      card.appendChild(el("span", "insta-go", "인스타그램 열기 →"));
      igBox.appendChild(card);
    }
  }

  /* ---------- 회원 후기 (네이버 플레이스 리뷰) ---------- */
  var reviews = D.reviews || [];
  var rg = document.querySelector("[data-reviews]");
  var revEmpty = document.querySelector("[data-reviews-empty]");
  if (rg && reviews.length) {
    if (revEmpty) revEmpty.hidden = true;
    reviews.forEach(function (r) {
      if (!r || !r.text) return;
      var li = el("li", "review-card reveal");
      var top = el("div", "review-top");
      top.appendChild(el("span", "review-src", "NAVER 방문자 리뷰"));
      if (r.event) top.appendChild(el("span", "review-event", "리뷰 이벤트 참여"));
      li.appendChild(top);
      li.appendChild(el("p", "review-text", r.text));
      var meta = el("p", "review-meta");
      meta.textContent = [r.author, r.date, r.program].filter(Boolean).join(" · ");
      li.appendChild(meta);
      rg.appendChild(li);
    });
  } else if (rg) { rg.hidden = true; }

  /* ---------- 데이지 저널: 네이버 블로그 새 글 자동 반영 ----------
     1) data/journal.json (호스팅의 자동 갱신 작업이 만든 파일)이 있으면 그것을 사용
     2) 없으면 블로그 RSS를 변환 서비스(rss2json)로 직접 읽어 옴 → 어떤 호스팅이든 자동 반영
     3) 둘 다 실패하면 site-data.js 의 journal 목록 → 그것도 없으면 '준비 중' 안내 */
  var jg = document.querySelector("[data-journal]");
  var je = document.querySelector("[data-journal-empty]");
  var jf = document.querySelector("[data-journal-filter]");
  var jCount = jg ? Number(jg.getAttribute("data-journal-count") || 3) : 3;
  var jAll = [], jCat = "";
  function stripTags(h) { var d = document.createElement("div"); d.innerHTML = h || ""; return (d.textContent || "").replace(/\s+/g, " ").trim(); }
  function fmtDate(raw) {
    var d = new Date(String(raw || "").replace(" ", "T") + (/[zZ]|[+-]\d\d:?\d\d$/.test(raw || "") ? "" : "+09:00"));
    if (isNaN(d)) d = new Date(raw);
    if (isNaN(d)) return "";
    var k = new Date(d.getTime() + 9 * 3600 * 1000);
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return k.getUTCFullYear() + "." + p(k.getUTCMonth() + 1) + "." + p(k.getUTCDate());
  }
  function cleanUrl(u) { try { var x = new URL(u); x.search = ""; return x.toString(); } catch (e) { return u; } }
  function renderJournal(list) {
    if (!jg) return;
    jAll = list || [];
    var posts = jAll.filter(function (p) { return !jCat || p.category === jCat; }).slice(0, jCount);
    jg.textContent = "";
    if (!posts.length) { jg.hidden = true; if (je) je.hidden = false; return; }
    jg.hidden = false; if (je) je.hidden = true;
    posts.forEach(function (p) {
      var li = el("li", "journal-card" + (p.thumbnail ? "" : " no-thumb"));
      var a = el("a");
      if (p.url) { a.href = p.url; a.target = "_blank"; a.rel = "noopener noreferrer"; }
      if (p.thumbnail) {
        var fig = el("figure", "media has-img");
        var img = new Image(); img.alt = ""; img.loading = "lazy"; img.decoding = "async";
        img.referrerPolicy = "no-referrer";           // 네이버 이미지 외부 표시용
        img.onerror = function () { li.classList.add("no-thumb"); fig.remove(); };
        img.src = p.thumbnail; fig.appendChild(img); a.appendChild(fig);
      }
      if (p.category) a.appendChild(el("span", "cat", p.category));
      a.appendChild(el("h3", null, p.title || ""));
      if (p.summary) a.appendChild(el("p", null, p.summary));
      if (p.date) a.appendChild(el("time", null, p.date));
      li.appendChild(a); jg.appendChild(li);
    });
    if (jf) buildFilter();
  }
  function buildFilter() {
    var cats = []; jAll.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
    if (cats.length < 2) { jf.hidden = true; return; }
    jf.hidden = false; jf.textContent = "";
    [""].concat(cats).forEach(function (c) {
      var b = el("button", "cl-opt" + (c === jCat ? " is-on" : ""), c || (window.DAISY_lang && window.DAISY_lang !== "ko" ? "All" : "전체"));
      b.type = "button"; b.setAttribute("aria-pressed", c === jCat ? "true" : "false");
      b.addEventListener("click", function () { jCat = c; renderJournal(jAll); });
      jf.appendChild(b);
    });
  }
  function fromRss2json(j) {
    return (j.items || []).map(function (it) {
      var m = (it.description || "").match(/<img[^>]+src=["']([^"']+)["']/i);
      var text = stripTags(it.description);
      return {
        title: stripTags(it.title), url: cleanUrl(it.link), date: fmtDate(it.pubDate),
        category: (it.categories && it.categories[0]) ? stripTags(it.categories[0]) : "",
        summary: text.length > 80 ? text.slice(0, 80).replace(/\s+\S*$/, "") + "…" : text,
        thumbnail: it.thumbnail || (it.enclosure && it.enclosure.link) || (m ? m[1] : "")
      };
    });
  }
  function loadJournal() {
    if (!jg || !window.fetch) return;
    var rss = C.blogRssUrl, proxy = C.blogFeedProxy;
    var fromFile = location.protocol.indexOf("http") === 0
      ? fetch("data/journal.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { return j && j.posts && j.posts.length ? j.posts : null; }).catch(function () { return null; })
      : Promise.resolve(null);
    fromFile.then(function (posts) {
      if (posts) return posts;
      if (!rss || !proxy) return null;
      return fetch(proxy + encodeURIComponent(rss)).then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { return j && j.status === "ok" ? fromRss2json(j) : null; }).catch(function () { return null; });
    }).then(function (posts) { if (posts && posts.length) renderJournal(posts); });
  }
  renderJournal(D.journal);
  loadJournal();

  /* ---------- 헤더 · 모바일 메뉴 ---------- */
  var header = document.querySelector("[data-header]");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector("[data-menu-toggle]");
  var gnb = document.getElementById("gnb");
  function setMenu(open) {
    if (!toggle || !gnb) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    gnb.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  if (gnb) gnb.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth >= 1024) setMenu(false); });

  } catch (err) {
    if (window.console) console.error("DAISY: 데이터 연결 중 오류", err);
  }

  /* ---------- 스크롤 등장 (1회, 절제된 페이드업) ---------- */
  try {
    var reveals = $all(".reveal");
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      document.documentElement.classList.add("js-ready");
      reveals.forEach(function (r) { io.observe(r); });
    }
  } catch (err) {
    document.documentElement.classList.remove("js-ready");
  }

  /* ---------- 다국어 (한국어 · English · 日本語 · 中文) ---------- */
  (function () {
    var I = window.DAISY_I18N || {};
    var HTML_LANG = { ko: "ko", en: "en", ja: "ja", zh: "zh-CN" };
    var select = document.querySelector("[data-lang-select]");
    function t(lang, key) { return lang !== "ko" && I[lang] && I[lang][key] != null ? I[lang][key] : null; }
    function apply(lang) {
      $all("[data-i18n]").forEach(function (n) {
        if (n.classList.contains("is-revealed")) return;           // 이미 번호가 표시된 전화 버튼
        var ko = n.getAttribute("data-i18n-ko"); if (ko == null) return;
        var html = t(lang, n.getAttribute("data-i18n"));
        n.innerHTML = html != null ? html : ko;
        if (n.classList.contains("is-pending")) n.appendChild(el("span", "pending-tag", t(lang, "ui.pending") || "준비 중"));
        if (n.classList.contains("phone-reveal")) n.setAttribute("aria-label", n.textContent + (t(lang, "ui.callHint") || " — 눌러서 번호 보기"));
      });
      $all("[data-i18n-alt]").forEach(function (f) {
        var img = f.querySelector("img"); if (!img) return;
        img.alt = t(lang, f.getAttribute("data-i18n-alt")) || f.getAttribute("data-alt") || "";
      });
      $all('[data-text="address"]').forEach(function (n) { n.textContent = t(lang, "data.address") || L.address || PENDING; });
      $all('[data-text="parking"]').forEach(function (n) { n.textContent = t(lang, "data.parking") || L.parking || PENDING; });
      var hb = document.querySelector("[data-hours]");
      if (hb && !(D.hours || []).length) hb.textContent = t(lang, "ui.tbd") || PENDING;
      if (hb && (D.hours || []).length) {
        var th = t(lang, "data.hours");
        var rows = th || D.hours.map(function (x) { return [x.day, x.time]; });
        hb.textContent = "";
        rows.forEach(function (r) {
          var row = el("span", "hours-row"); row.style.display = "flex";
          row.appendChild(el("span", null, r[0])); row.appendChild(el("span", null, r[1])); hb.appendChild(row);
        });
      }
      var cl = document.querySelector("[data-director-credentials]");
      if (cl) {
        var creds = t(lang, "data.credentials") || ((D.director || {}).credentials || []);
        cl.textContent = ""; creds.forEach(function (c) { if (c) cl.appendChild(el("li", null, c)); });
      }
      var dn = document.querySelector("[data-director-name]");
      if (dn && (D.director || {}).name) dn.textContent = (t(lang, "dir.name") || "대표") + " " + D.director.name;
      var pageKey = document.documentElement.getAttribute("data-page");
      document.title = t(lang, pageKey ? "meta.title." + pageKey : "meta.title") || KO_TITLE;
      if (metaDesc) metaDesc.setAttribute("content", (pageKey ? null : t(lang, "meta.description")) || KO_DESC);
      document.documentElement.setAttribute("lang", HTML_LANG[lang] || "ko");
      if (jf && jAll.length) buildFilter();
      if (select) select.value = lang;
      var cur = document.querySelector("[data-lang-current]");
      if (cur) cur.textContent = { ko: "한국어", en: "English", ja: "日本語", zh: "中文" }[lang] || "한국어";
    }
    function setLang(lang, silent) {
      if (!HTML_LANG[lang]) lang = "ko";
      window.DAISY_lang = lang;
      apply(lang);
      if (!silent) { try { localStorage.setItem("daisy-lang", lang); } catch (e) {} }
      try { document.dispatchEvent(new CustomEvent("daisy:lang", { detail: lang })); } catch (e) {}
    }
    window.DAISY_setLang = setLang;
    function initial() {
      if (!select) return "ko";   // 언어 선택이 없는 페이지(제휴 페이지 등)는 한국어
      var m = location.search.match(/[?&]lang=(ko|en|ja|zh)/);
      if (m) return m[1];
      try { var saved = localStorage.getItem("daisy-lang"); if (saved) return saved; } catch (e) {}
      var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "ko";
      nav = nav.toLowerCase();
      if (nav.indexOf("ko") === 0) return "ko";
      if (nav.indexOf("ja") === 0) return "ja";
      if (nav.indexOf("zh") === 0) return "zh";
      if (nav.indexOf("en") === 0) return "en";
      return "ko";
    }
    if (select) select.addEventListener("change", function () { setLang(select.value); });
    try { setLang(initial(), true); } catch (e) { if (window.console) console.error("DAISY: 언어 적용 오류", e); }
  })();
})();
