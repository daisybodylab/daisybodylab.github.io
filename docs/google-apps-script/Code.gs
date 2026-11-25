/**
 * 데이지 운동센터 — 홈페이지 접수 자동 정리 (Google Apps Script)
 * ---------------------------------------------------------------
 * 하나의 시트에 두 개의 탭이 자동으로 만들어집니다.
 *   · '체크리스트 응답' : 몸 체크리스트 '결과 보내기'
 *   · '제휴 문의'       : 제휴 페이지의 제안 양식
 * 설정 방법은 docs/구글시트_연결_안내.md 를 참고하세요.
 */

var RETENTION_DAYS = 365; // 보관 기간(일). 개인정보처리방침과 같게 맞춰 주세요.

/** 새 접수 알림 메일을 받을 주소. 비워 두면 메일을 보내지 않습니다. */
var NOTIFY_EMAIL = 'daisy.bodylab@gmail.com';

var SHEETS = {
  checklist: {
    name: '체크리스트 응답',
    headers: [
      '접수 시각', '이름', '연락처', '운동 목표', '불편한 부위', '수술·부상 이력',
      '즐겨 하는 활동', '운동 횟수', '생활 습관', '수면 시간', '희망 시간대', '추천 상담 프로그램',
      '화면 언어', '개인정보 동의', '민감정보 동의', '상담 상태', '메모', '보관 기한'
    ],
    statusCol: '상담 상태',
    statuses: ['새 접수', '연락 완료', '상담 예약', '등록', '보류']
  },
  partnership: {
    name: '제휴 문의',
    headers: [
      '접수 시각', '제휴 분야', '단체·회사명', '담당자', '연락처', '이메일',
      '예상 인원', '진행 장소', '희망 시기', '제안 내용', '개인정보 동의',
      '진행 상태', '메모', '보관 기한'
    ],
    statusCol: '진행 상태',
    statuses: ['새 접수', '연락 완료', '미팅 예정', '진행 중', '완료', '보류']
  }
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return json_({ ok: true }); // 자동 등록 방지용 숨은 칸이 채워진 경우 무시

    var kind = d.kind === 'partnership' ? 'partnership' : 'checklist';

    // 필수값·동의 확인 (동의 없는 데이터는 저장하지 않음)
    if (!d.name || !d.phone || d.consentPrivacy !== true) return json_({ ok: false, error: 'missing' });
    if (kind === 'checklist' && d.consentSensitive !== true) return json_({ ok: false, error: 'missing' });
    if (kind === 'partnership' && !d.org) return json_({ ok: false, error: 'missing' });

    // 같은 연락처로 1분 안에 반복 접수되는 것 방지
    var cache = CacheService.getScriptCache();
    var key = kind + '_' + String(d.phone).replace(/\D/g, '');
    if (cache.get(key)) return json_({ ok: true, duplicate: true });
    cache.put(key, '1', 60);

    var sheet = getSheet_(kind);
    var now = new Date();
    var expire = new Date(now.getTime() + RETENTION_DAYS * 24 * 3600 * 1000);

    if (kind === 'partnership') {
      sheet.appendRow([
        now, clip_(d.type, 30), clip_(d.org, 60), clip_(d.name, 30), clip_(d.phone, 20), clip_(d.email, 80),
        clip_(d.size, 20), clip_(d.place, 30), clip_(d.when, 100), clip_(d.msg, 2000), '동의',
        '새 접수', '', expire
      ]);
      if (NOTIFY_EMAIL) {
        MailApp.sendEmail(NOTIFY_EMAIL, '[데이지] 새 제휴 문의 — ' + clip_(d.org, 60),
          '새 제휴 문의가 접수되었습니다.\n단체·회사명: ' + clip_(d.org, 60) + '\n제휴 분야: ' + clip_(d.type, 30) +
          '\n시트에서 확인하세요: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
      }
    } else {
      sheet.appendRow([
        now, clip_(d.name, 30), clip_(d.phone, 20), clip_(d.goal), clip_(d.area), clip_(d.history),
        clip_(d.activity), clip_(d.freq), clip_(d.habit), clip_(d.sleep, 30), clip_(d.time), clip_(d.recommend),
        clip_(d.lang, 5), '동의', '동의', '새 접수', '', expire
      ]);
      if (NOTIFY_EMAIL) {
        // 건강 정보는 메일에 넣지 않고, 접수 사실과 시트 링크만 보냅니다.
        MailApp.sendEmail(NOTIFY_EMAIL, '[데이지] 새 체크리스트 접수',
          '새 체크리스트 응답이 접수되었습니다.\n시트에서 확인하세요: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
      }
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

/** 보관 기한이 지난 접수를 두 탭 모두에서 지웁니다. 트리거로 매일 1회 실행하도록 설정하세요. */
function deleteExpired() {
  var today = new Date();
  Object.keys(SHEETS).forEach(function (kind) {
    var sheet = getSheet_(kind);
    var last = sheet.getLastRow();
    if (last < 2) return;
    var col = SHEETS[kind].headers.indexOf('보관 기한') + 1;
    var values = sheet.getRange(2, col, last - 1, 1).getValues();
    for (var i = values.length - 1; i >= 0; i--) {
      var v = values[i][0];
      if (v instanceof Date && v < today) sheet.deleteRow(i + 2);
    }
  });
}

function getSheet_(kind) {
  var cfg = SHEETS[kind];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(cfg.name) || ss.insertSheet(cfg.name);
  if (sheet.getLastRow() === 0) {
    var n = cfg.headers.length;
    sheet.appendRow(cfg.headers);
    sheet.getRange(1, 1, 1, n).setFontWeight('bold').setBackground('#183B32').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.getRange(2, n, sheet.getMaxRows() - 1, 1).setNumberFormat('yyyy-mm-dd');
    sheet.setColumnWidths(1, n, 140);
    var sc = cfg.headers.indexOf(cfg.statusCol) + 1;
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(cfg.statuses, true).build();
    sheet.getRange(2, sc, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  }
  ensureColumns_(sheet, cfg);
  ensureHighlight_(sheet, cfg);
  return sheet;
}

/** 새 항목(예: 수면 시간)이 추가되면, 이미 만들어진 시트에도 같은 위치에 칸을 끼워 넣습니다. */
function ensureColumns_(sheet, cfg) {
  var have = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  for (var i = 0; i < cfg.headers.length; i++) {
    if (have[i] === cfg.headers[i]) continue;
    sheet.insertColumnBefore(i + 1);
    sheet.getRange(1, i + 1).setValue(cfg.headers[i]).setFontWeight('bold').setBackground('#183B32').setFontColor('#FFFFFF');
    have.splice(i, 0, cfg.headers[i]);
  }
}

/** 상태별로 줄 색을 칠합니다. 상태 칸에서 다른 항목을 고르면 색이 자동으로 바뀝니다. (색을 바꾸려면 STATUS_COLORS만 고치세요) */
var STATUS_COLORS = {
  '새 접수':   { bg: '#FFF4C2', bold: true },        // 노랑 + 굵게 — 아직 연락 안 함
  '연락 완료': { bg: '#E3EEFB' },                    // 하늘 — 연락했음
  '상담 예약': { bg: '#E6F4EA' },                    // 연두 — 상담 날짜 잡힘
  '미팅 예정': { bg: '#EFE7F8' },                    // 연보라 — 제휴 미팅 예정
  '진행 중':   { bg: '#E6F4EA' },                    // 연두 — 제휴 진행 중
  '등록':      { bg: '#FDF1F5' },                    // 연분홍 — 회원 등록 완료
  '완료':      { bg: '#FDF1F5' },                    // 연분홍 — 제휴 완료
  '보류':      { bg: '#F1F1F1', font: '#9A9A9A' }    // 회색 — 보류
};
function ensureHighlight_(sheet, cfg) {
  var col = columnLetter_(cfg.headers.indexOf(cfg.statusCol) + 1);
  var mine = cfg.statuses.map(function (st) { return '=$' + col + '2="' + st + '"'; });
  var rules = sheet.getConditionalFormatRules();
  var others = rules.filter(function (r) {
    var c = r.getBooleanCondition();
    var f = c ? String(c.getCriteriaValues()[0] || '') : '';
    return !cfg.statuses.some(function (st) { return f.indexOf('"' + st + '"') >= 0; });
  });
  var current = rules.length - others.length;
  var upToDate = current === mine.length && rules.every(function (r) {
    var c = r.getBooleanCondition(); var f = c ? String(c.getCriteriaValues()[0] || '') : '';
    return !cfg.statuses.some(function (st) { return f.indexOf('"' + st + '"') >= 0; }) || mine.indexOf(f) >= 0;
  });
  if (upToDate) return;
  var range = sheet.getRange(2, 1, sheet.getMaxRows() - 1, cfg.headers.length);
  cfg.statuses.forEach(function (st, i) {
    var c = STATUS_COLORS[st]; if (!c) return;
    var b = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(mine[i]).setBackground(c.bg).setRanges([range]);
    if (c.font) b.setFontColor(c.font);
    if (c.bold) b.setBold(true);
    others.push(b.build());
  });
  sheet.setConditionalFormatRules(others);
}
function columnLetter_(n) { var s = ''; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
function clip_(v, n) { v = (v == null ? '' : String(v)); v = v.replace(/^[=+\-@]/, "'$&"); return v.slice(0, n || 300); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/** 설정 후 이 함수를 한 번 실행하면 두 탭의 머리글이 만들어지는지 확인할 수 있습니다. */
function setupTest() { getSheet_('checklist'); getSheet_('partnership'); }
