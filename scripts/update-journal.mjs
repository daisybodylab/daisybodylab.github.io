/* ==========================================================================
   데이지 저널 자동 갱신 스크립트
   --------------------------------------------------------------------------
   네이버 블로그 RSS를 읽어 최신 글을 data/journal.json 으로 저장합니다.
   대표 이미지는 images/journal/ 폴더에 내려받아 홈페이지에서 직접 보여 줍니다.
   (네이버 이미지는 외부 사이트에서 바로 띄우면 보이지 않는 경우가 많기 때문)

   실행: node scripts/update-journal.mjs
   옵션(환경변수):
     BLOG_ID      네이버 블로그 아이디        (기본: daisy_bodylab)
     POST_COUNT   홈페이지에 보여 줄 글 수     (기본: 3)
     CATEGORIES   보여 줄 카테고리, 쉼표 구분  (기본: 전체)  예) "체형과 움직임,재활운동 가이드"
     RSS_FILE     테스트용 로컬 RSS 파일 경로   (지정 시 인터넷 대신 이 파일을 읽음)
   ========================================================================== */
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_ID = process.env.BLOG_ID || "daisy_bodylab";
const POST_COUNT = Number(process.env.POST_COUNT || 3);
const CATEGORIES = (process.env.CATEGORIES || "").split(",").map((s) => s.trim()).filter(Boolean);
const RSS_URL = `https://rss.blog.naver.com/${BLOG_ID}.xml`;
const IMG_DIR = path.join(ROOT, "images", "journal");
const OUT_FILE = path.join(ROOT, "data", "journal.json");
const UA = "Mozilla/5.0 (compatible; DaisyJournalBot/1.0; +https://blog.naver.com/" + BLOG_ID + ")";

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}
function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
  if (!m) return "";
  return m[1].replace(/^\s*<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "").trim();
}
function plain(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
function summarize(text, max = 80) {
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
}
function formatDate(raw) {
  const d = new Date(raw);
  if (isNaN(d)) return "";
  const kst = new Date(d.getTime() + 9 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, "0");
  return `${kst.getUTCFullYear()}.${p(kst.getUTCMonth() + 1)}.${p(kst.getUTCDate())}`;
}
function cleanLink(link) {
  // https://blog.naver.com/아이디/글번호?fromRss=true&trackingCode=rss → 추적값 제거
  try { const u = new URL(link); u.search = ""; return u.toString(); } catch { return link; }
}
function postId(link) {
  const m = link.match(/(\d{6,})/g);
  return m ? m[m.length - 1] : String(Math.abs([...link].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)));
}

async function getRss() {
  if (process.env.RSS_FILE) return readFile(process.env.RSS_FILE, "utf8");
  const res = await fetch(RSS_URL, { headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml" } });
  if (!res.ok) throw new Error(`RSS 요청 실패: HTTP ${res.status}`);
  return res.text();
}

async function downloadImage(url, id) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://blog.naver.com/" } });
    if (!res.ok) return "";
    const type = res.headers.get("content-type") || "";
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : type.includes("gif") ? "gif" : "jpg";
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) return "";
    const file = `${id}.${ext}`;
    await writeFile(path.join(IMG_DIR, file), buf);
    return `images/journal/${file}`;
  } catch {
    return "";
  }
}

async function main() {
  const xml = await getRss();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
  if (!items.length) throw new Error("RSS에서 글을 찾지 못했습니다. 블로그 아이디와 '외부 보내기 허용' 설정을 확인하세요.");

  let posts = items.map((it) => {
    const descHtml = decodeEntities(tag(it, "description"));
    const img = (descHtml.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || "";
    const link = cleanLink(tag(it, "link"));
    return {
      id: postId(link),
      category: plain(tag(it, "category")),
      title: plain(tag(it, "title")),
      summary: summarize(plain(descHtml)),
      date: formatDate(tag(it, "pubDate")),
      url: link,
      _img: img ? decodeEntities(img) : ""
    };
  });
  if (CATEGORIES.length) posts = posts.filter((p) => CATEGORIES.includes(p.category));
  posts = posts.slice(0, POST_COUNT);

  await mkdir(IMG_DIR, { recursive: true });
  for (const p of posts) {
    p.thumbnail = p._img ? await downloadImage(p._img, p.id) : "";
    delete p._img;
  }
  // 더 이상 쓰지 않는 썸네일 정리
  const keep = new Set(posts.map((p) => path.basename(p.thumbnail)).filter(Boolean));
  for (const f of await readdir(IMG_DIR)) if (!keep.has(f) && f !== ".gitkeep") await unlink(path.join(IMG_DIR, f));

  const out = { source: RSS_URL, updated: new Date().toISOString(), posts };
  let prev = "";
  try { prev = await readFile(OUT_FILE, "utf8"); } catch {}
  const same = prev && JSON.stringify(JSON.parse(prev).posts) === JSON.stringify(posts);
  if (same) { console.log("변경 없음 — 저장하지 않습니다."); return; }
  await writeFile(OUT_FILE, JSON.stringify(out, null, 2) + "\n");
  console.log(`저장 완료: 글 ${posts.length}개 → data/journal.json`);
  posts.forEach((p) => console.log(` - [${p.category}] ${p.title} (${p.date}) ${p.thumbnail ? "썸네일 O" : "썸네일 X"}`));
}

main().catch((e) => { console.error("저널 갱신 실패:", e.message); process.exit(1); });
