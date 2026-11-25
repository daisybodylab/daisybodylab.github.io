/* DAISY BODYLAB — 제휴 제안 양식
   · data/site-data.js 에 구글 시트 주소(partnershipEndpoint, 없으면 checklistEndpoint)가 있으면
     '제안 보내기'를 누를 때 구글 시트 '제휴 문의' 탭에 한 줄씩 저장됩니다. (개인정보 수집 동의 필수)
   · 주소가 비어 있으면 요약을 복사한 뒤 카카오톡 채널로 직접 보내는 방식으로 동작합니다. */
(function () {
  "use strict";
  var form = document.querySelector("[data-partner-form]");
  if (!form) return;
  var C = (window.DAISY_DATA && window.DAISY_DATA.contact) || {};
  var TYPES = { sports: "스포츠 팀·클럽", corporate: "기업·기관", event: "행사·대회", etc: "기타" };
  var chips = Array.prototype.slice.call(form.querySelectorAll('[data-field="type"] .cl-opt'));
  var errBox = form.querySelector("[data-form-error]");
  var msgBox = form.querySelector("[data-form-msg]");
  var selected = "";
  var ENDPOINT = C.partnershipEndpoint || C.checklistEndpoint || "";
  var consent = null, honey = null, sending = false;

  /* ---------- 구글 시트 연결 시: 동의 칸 · 버튼 문구 ---------- */
  if (ENDPOINT) {
    var wrap = document.createElement("div");
    wrap.className = "cl-consent pt-full";
    wrap.innerHTML =
      '<div class="cl-consent-top"><input type="checkbox" id="pf-consent" name="consent">' +
      '<label for="pf-consent">(필수) 개인정보 수집·이용에 동의합니다</label></div>' +
      '<p class="cl-consent-body">수집 항목: 담당자 이름, 연락처, 이메일(선택) · 목적: 제휴 제안 검토 및 회신 · ' +
      '보유 기간: 접수일로부터 1년 (요청 시 즉시 삭제) · 동의하지 않으셔도 카카오톡으로 문의하실 수 있어요. ' +
      '<a href="privacy.html">개인정보처리방침</a></p>';
    errBox.parentNode.insertBefore(wrap, errBox);
    consent = wrap.querySelector("input");

    honey = document.createElement("input");           // 자동 등록 방지(사람에게는 보이지 않음)
    honey.type = "text"; honey.name = "website"; honey.tabIndex = -1; honey.autocomplete = "off";
    honey.setAttribute("aria-hidden", "true");
    honey.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0";
    form.appendChild(honey);

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = "제휴 제안 보내기";
    var kakaoLink = document.createElement("a");
    kakaoLink.className = "btn btn-line";
    kakaoLink.textContent = "카카오톡으로 문의";
    kakaoLink.href = C.kakaoUrl || "#";
    kakaoLink.target = "_blank"; kakaoLink.rel = "noopener";
    if (!C.kakaoUrl) kakaoLink.hidden = true;
    submitBtn.after(kakaoLink);
    var note = form.querySelector(".cl-note");
    if (note) note.textContent = "보내 주신 내용은 센터 담당자만 확인하며, 검토 후 남겨 주신 연락처로 회신드립니다.";
  }

  function pick(v) {
    selected = v;
    chips.forEach(function (c) {
      var on = c.getAttribute("data-value") === v;
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  chips.forEach(function (c) { c.addEventListener("click", function () { pick(c.getAttribute("data-value")); }); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-preset]"), function (a) {
    a.addEventListener("click", function () { pick(a.getAttribute("data-preset")); });
  });

  function val(name) { var el = form.elements[name]; return el ? String(el.value || "").trim() : ""; }
  function summary() {
    var lines = [
      "[데이지 운동센터 · 제휴 제안]",
      "제휴 분야: " + (TYPES[selected] || "-"),
      "단체·회사명: " + val("org"),
      "담당자: " + val("name"),
      "연락처: " + val("phone")
    ];
    if (val("email")) lines.push("이메일: " + val("email"));
    if (val("size")) lines.push("예상 인원: " + val("size"));
    if (val("place")) lines.push("진행 장소: " + val("place"));
    if (val("when")) lines.push("희망 시기: " + val("when"));
    if (val("msg")) lines.push("제안 내용:\n" + val("msg"));
    return lines.join("\n");
  }
  function validate() {
    var missing = [];
    if (!selected) missing.push("제휴 분야");
    if (!val("org")) missing.push("단체·회사명");
    if (!val("name")) missing.push("담당자 이름");
    if (!/[0-9]{2,}.*[0-9]{3,}/.test(val("phone"))) missing.push("연락처");
    ["org", "name", "phone"].forEach(function (n) {
      var el = form.elements[n];
      var bad = (n === "phone") ? missing.indexOf("연락처") >= 0 : !val(n);
      el.setAttribute("aria-invalid", bad ? "true" : "false");
    });
    var msg = missing.length ? missing.join(", ") + " 항목을 입력해 주세요." : "";
    if (!missing.length && consent && !consent.checked) msg = "개인정보 수집·이용에 동의해 주세요.";
    errBox.textContent = msg;
    if (!missing.length && consent && !consent.checked) { consent.focus(); return false; }
    if (missing.length) {
      var first = !selected ? chips[0] : form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
    }
    return !missing.length;
  }
  function copyText(text, ok, fail) {
    function fallback() {
      try {
        var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", "");
        ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
        var r = document.execCommand("copy"); document.body.removeChild(ta); r ? ok() : fail();
      } catch (e) { fail(); }
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  function sendToSheet() {
    if (sending) return;
    sending = true;
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = "보내는 중…";
    var data = {
      kind: "partnership", type: TYPES[selected] || "", org: val("org"), name: val("name"), phone: val("phone"),
      email: val("email"), size: val("size"), place: val("place"), when: val("when"), msg: val("msg"),
      consentPrivacy: true, website: honey ? honey.value : ""
    };
    function done(ok) {
      sending = false;
      btn.disabled = false; btn.textContent = "제휴 제안 보내기";
      if (ok) {
        msgBox.textContent = "제안이 접수됐어요. 내용을 확인한 뒤 남겨 주신 연락처로 회신드릴게요.";
        form.reset(); pick(""); if (consent) consent.checked = false;
      } else {
        msgBox.textContent = "전송하지 못했어요. 잠시 후 다시 시도하시거나 카카오톡으로 문의해 주세요.";
      }
    }
    try {
      fetch(ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data) })
        .then(function () { done(true); }, function () { done(false); });
    } catch (err) { done(false); }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    msgBox.textContent = "";
    if (!validate()) return;
    if (ENDPOINT) { sendToSheet(); return; }
    var text = summary();
    copyText(text, function () {
      msgBox.textContent = "제안 내용이 복사됐어요. 열린 카카오톡 채팅창에 붙여넣어 보내 주세요.";
    }, function () {
      msgBox.textContent = "아래 내용을 복사해 카카오톡 채팅창에 붙여넣어 주세요.";
      var box = form.querySelector(".cl-copybox");
      if (!box) { box = document.createElement("textarea"); box.className = "cl-copybox pt-full"; box.rows = 8; box.readOnly = true; msgBox.after(box); }
      box.value = text;
    });
    // 복사를 먼저 시작한 뒤 같은 클릭 안에서 카카오톡 채널을 엽니다(팝업 차단 방지)
    if (C.kakaoUrl) { try { window.open(C.kakaoUrl, "_blank", "noopener"); } catch (err) {} }
  });

  var mail = form.querySelector("[data-partner-mail]");
  if (mail && C.partnerEmail) {
    mail.hidden = false;
    mail.href = "mailto:" + C.partnerEmail;
    mail.addEventListener("click", function (e) {
      if (!validate()) { e.preventDefault(); return; }
      mail.href = "mailto:" + C.partnerEmail + "?subject=" + encodeURIComponent("[제휴 제안] " + val("org")) + "&body=" + encodeURIComponent(summary());
    });
  }
})();
