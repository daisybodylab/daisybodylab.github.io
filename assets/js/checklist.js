/* ==========================================================================
   DAISY BODYLAB — 1분 몸 체크리스트
   --------------------------------------------------------------------------
   - 질문과 보기는 아래 STEPS 에서 고칠 수 있습니다. [한국어, English, 日本語, 中文] 순서입니다.
   - 입력한 내용은 어디에도 저장·전송되지 않습니다.
     결과 요약을 복사해 카카오톡 상담창에 붙여 넣는 방식입니다.
   ========================================================================== */
(function () {
  "use strict";
  var LANGS = ["ko", "en", "ja", "zh"];
  function L(arr) { var i = LANGS.indexOf(window.DAISY_lang || "ko"); return arr[i] || arr[0]; }
  function K(arr) { return arr[0]; } // 결과 요약은 센터가 읽기 쉽도록 항상 한국어

  var STEPS = [
    {
      title: ["운동으로 바라는 변화는 무엇인가요?", "What change do you hope for?", "運動でどんな変化を望みますか？", "您希望通过运动获得什么改变？"],
      hint: ["여러 개 선택할 수 있어요", "Choose all that apply", "複数選択できます", "可多选"],
      groups: [{
        id: "goal", multi: true, required: true, label: ["운동 목표", "Goals", "目標", "目标"],
        options: [
          { v: "posture", t: ["자세·체형 개선", "Better posture", "姿勢・体型の改善", "改善体态"] },
          { v: "comfort", t: ["불편함 없이 일상 움직이기", "Move comfortably every day", "日常を楽に動けるように", "日常活动更轻松"] },
          { v: "surgery", t: ["수술 후 일상 복귀 준비", "Return to daily life after surgery", "術後の日常復帰に向けて", "术后恢复日常生活"] },
          { v: "strength", t: ["근력·체력 키우기", "Build strength & fitness", "筋力・体力アップ", "增强力量与体能"] },
          { v: "sport", t: ["운동 수행 능력 높이기", "Improve sports performance", "競技パフォーマンス向上", "提高运动表现"] }
        ]
      }]
    },
    {
      title: ["요즘 불편하거나 신경 쓰이는 부위가 있나요?", "Any areas that feel uncomfortable lately?", "最近気になる部位はありますか？", "最近有不适或在意的部位吗？"],
      hint: ["여러 개 선택할 수 있어요", "Choose all that apply", "複数選択できます", "可多选"],
      groups: [{
        id: "area", multi: true, required: true, label: ["불편한 부위", "Areas", "気になる部位", "不适部位"],
        options: [
          { v: "neck", t: ["목", "Neck", "首", "颈部"] },
          { v: "shoulder", t: ["어깨", "Shoulder", "肩", "肩部"] },
          { v: "back", t: ["등·허리", "Back", "背中・腰", "背部·腰部"] },
          { v: "hip", t: ["골반·고관절", "Pelvis · Hip", "骨盤・股関節", "骨盆·髋关节"] },
          { v: "knee", t: ["무릎", "Knee", "膝", "膝盖"] },
          { v: "ankle", t: ["발목·발", "Ankle · Foot", "足首・足", "脚踝·足部"] },
          { v: "wrist", t: ["손목·팔꿈치", "Wrist · Elbow", "手首・肘", "手腕·肘部"] },
          { v: "none", t: ["특별히 없어요", "None in particular", "特になし", "没有特别不适"], only: true }
        ]
      }]
    },
    {
      title: ["최근 수술이나 부상 이력이 있나요?", "Any recent surgery or injury?", "最近、手術やケガの経験はありますか？", "最近有手术或受伤经历吗？"],
      hint: ["하나만 선택해 주세요", "Choose one", "1つ選んでください", "请选择一项"],
      groups: [{
        id: "history", multi: false, required: true, label: ["수술·부상 이력", "Surgery / injury", "手術・ケガ", "手术·受伤"],
        options: [
          { v: "none", t: ["없어요", "None", "ありません", "没有"] },
          { v: "surgeryRecent", t: ["수술 후 6개월 이내", "Within 6 months after surgery", "術後6か月以内", "术后6个月以内"] },
          { v: "surgeryPast", t: ["수술 후 6개월 이상 지남", "More than 6 months after surgery", "術後6か月以上", "术后6个月以上"] },
          { v: "injury", t: ["부상 이력 있음 (병원 치료 완료)", "Past injury (medical treatment completed)", "ケガの経験あり（治療終了）", "有受伤经历（已完成治疗）"] }
        ]
      }]
    },
    {
      title: ["평소 어떤 활동을 하나요?", "What activities do you usually do?", "普段どんな活動をしていますか？", "您平时做哪些活动？"],
      hint: ["활동은 여러 개, 운동 횟수는 하나 선택", "Pick activities and one frequency", "活動は複数、回数は1つ選択", "活动可多选，频率选一项"],
      groups: [{
        id: "activity", multi: true, required: false, label: ["즐겨 하는 활동", "Activities", "よくする活動", "常做的活动"],
        options: [
          { v: "walk", t: ["걷기", "Walking", "ウォーキング", "散步"] },
          { v: "hike", t: ["등산", "Hiking", "登山", "登山"] },
          { v: "run", t: ["러닝", "Running", "ランニング", "跑步"] },
          { v: "golf", t: ["골프", "Golf", "ゴルフ", "高尔夫"] },
          { v: "parkgolf", t: ["파크골프", "Park golf", "パークゴルフ", "公园高尔夫"] },
          { v: "racket", t: ["테니스·배드민턴", "Tennis · Badminton", "テニス・バドミントン", "网球·羽毛球"] },
          { v: "soccer", t: ["축구·풋살", "Soccer · Futsal", "サッカー・フットサル", "足球·五人制足球"] },
          { v: "baseball", t: ["야구", "Baseball", "野球", "棒球"] },
          { v: "pilates", t: ["요가·필라테스", "Yoga · Pilates", "ヨガ・ピラティス", "瑜伽·普拉提"] },
          { v: "weight", t: ["웨이트 트레이닝", "Weight training", "ウエイトトレーニング", "力量训练"] },
          { v: "swim", t: ["수영", "Swimming", "水泳", "游泳"] },
          { v: "ball", t: ["기타 구기 종목", "Other ball sports", "その他の球技", "其他球类运动"] },
          { v: "other", input: true, t: ["기타 (직접 입력)", "Other (type in)", "その他（直接入力）", "其他（直接填写）"],
            ph: ["예) 클라이밍, 크로스핏, 볼링", "e.g. climbing, CrossFit, bowling", "例）クライミング、クロスフィット", "例如：攀岩、CrossFit、保龄球"] }
        ]
      }, {
        id: "freq", multi: false, required: true, label: ["운동하는 횟수", "How often", "運動の頻度", "运动频率"],
        options: [
          { v: "rare", t: ["거의 안 해요", "Rarely", "ほとんどしない", "几乎不运动"] },
          { v: "1-2", t: ["주 1~2회", "1–2 times a week", "週1〜2回", "每周1~2次"] },
          { v: "3+", t: ["주 3회 이상", "3+ times a week", "週3回以上", "每周3次以上"] }
        ]
      }]
    },
    {
      title: ["생활 습관과 원하는 시간대를 알려 주세요", "Tell us about your daily habits and preferred time", "生活習慣と希望の時間帯を教えてください", "请告诉我们您的生活习惯和希望的时间段"],
      hint: ["습관은 여러 개, 수면 시간과 시간대는 하나씩 선택", "Pick any habits, then one each for sleep and time", "習慣は複数、睡眠時間と時間帯は1つずつ選択", "习惯可多选，睡眠和时间段各选一项"],
      groups: [{
        id: "habit", multi: true, required: false, label: ["생활 습관", "Daily habits", "生活習慣", "生活习惯"],
        options: [
          { v: "sit", t: ["오래 앉아 있어요", "Sitting for long hours", "長時間座っている", "久坐"] },
          { v: "stand", t: ["오래 서 있어요", "Standing for long hours", "長時間立っている", "久站"] },
          { v: "screen", t: ["스마트폰·PC를 많이 써요", "Lots of phone / PC use", "スマホ・PCをよく使う", "经常使用手机·电脑"] },
          { v: "lift", t: ["무거운 물건을 자주 들어요", "Often lift heavy things", "重い物をよく持つ", "经常搬重物"] }
        ]
      }, {
        id: "sleep", multi: false, required: false, label: ["하루 수면 시간", "Daily sleep", "1日の睡眠時間", "每日睡眠时间"],
        options: [
          { v: "lt5", t: ["5시간 미만", "Under 5 hours", "5時間未満", "不到5小时"] },
          { v: "5-6", t: ["5~6시간", "5–6 hours", "5〜6時間", "5~6小时"] },
          { v: "7-8", t: ["7~8시간", "7–8 hours", "7〜8時間", "7~8小时"] },
          { v: "9+", t: ["9시간 이상", "9 hours or more", "9時間以上", "9小时以上"] }
        ]
      }, {
        id: "time", multi: false, required: true, label: ["희망 시간대", "Preferred time", "希望の時間帯", "希望时间段"],
        options: [
          { v: "am", t: ["평일 오전", "Weekday morning", "平日午前", "工作日上午"] },
          { v: "pm", t: ["평일 오후", "Weekday afternoon", "平日午後", "工作日下午"] },
          { v: "eve", t: ["평일 저녁", "Weekday evening", "平日夜", "工作日晚上"] },
          { v: "weekend", t: ["주말", "Weekend", "週末", "周末"] }
        ]
      }]
    }
  ];

  var PROGRAMS = {
    surgery: { name: ["수술 후 재활운동", "Post-surgery Rehabilitation Exercise", "術後のリハビリ運動", "术后康复运动"],
      why: ["수술 이후 일상 움직임으로 돌아가는 과정을 단계적으로 준비해요. 담당 의료진의 소견을 함께 확인합니다.",
            "Prepare step by step to return to everyday movement. We'll also check your medical team's opinion.",
            "日常の動きに戻る過程を段階的に準備します。担当医療スタッフの所見も一緒に確認します。",
            "循序渐进地为恢复日常活动做准备，并一同确认主治医疗团队的意见。"] },
    posture: { name: ["체형교정 운동", "Posture Correction", "姿勢改善エクササイズ", "体态矫正运动"],
      why: ["자세와 움직임 습관을 체형분석으로 확인하고, 균형 잡힌 움직임을 연습해요.",
            "We check your posture and movement habits, then practice balanced movement.",
            "姿勢分析で姿勢と動きのクセを確認し、バランスの取れた動きを練習します。",
            "通过体态分析了解姿势和动作习惯，并练习平衡的动作。"] },
    strength: { name: ["근력 및 기능 향상", "Strength & Function", "筋力・機能向上", "力量与功能提升"],
      why: ["기초 체력과 일상 기능을 내 몸 상태에 맞는 강도로 키워요.",
            "Build basic fitness and everyday function at an intensity that suits you.",
            "体の状態に合った強度で、基礎体力と日常の機能を高めます。",
            "以适合身体状态的强度提升基础体能和日常功能。"] },
    sport: { name: ["스포츠 퍼포먼스", "Sports Performance", "スポーツパフォーマンス", "运动表现提升"],
      why: ["종목에 필요한 움직임과 효율을 평가하고 수행 능력을 높여요.",
            "We assess the movement your sport needs and work on performance.",
            "競技に必要な動きと効率を評価し、パフォーマンスを高めます。",
            "评估项目所需的动作与效率，提升运动表现。"] }
  };

  var UI = {
    brand: ["DAISY BODYLAB · 몸 체크리스트", "DAISY BODYLAB · Body checklist", "DAISY BODYLAB · カラダチェック", "DAISY BODYLAB · 身体自查"],
    step: ["STEP", "STEP", "STEP", "STEP"],
    prev: ["이전", "Back", "戻る", "上一步"], next: ["다음", "Next", "次へ", "下一步"], done: ["결과 보기", "See result", "結果を見る", "查看结果"],
    need: ["필수 항목을 선택해 주세요", "Please complete the required choice", "必須項目を選んでください", "请完成必选项"],
    resultEyebrow: ["RESULT", "RESULT", "RESULT", "RESULT"],
    resultTitle: ["상담 때 이렇게 시작해요", "Here's how your consultation can start", "相談はここから始めます", "咨询将这样开始"],
    recommend: ["추천 상담 프로그램", "Suggested program", "おすすめプログラム", "推荐课程"],
    areas: ["함께 살펴볼 부위", "Areas we'll look at together", "一緒に確認する部位", "一起查看的部位"],
    noArea: ["특별히 불편한 부위 없음", "No particular discomfort", "特に気になる部位なし", "没有特别不适的部位"],
    send: ["결과 복사하고 카카오톡 상담", "Copy result & chat on KakaoTalk", "結果をコピーしてカカオトーク相談", "复制结果并在KakaoTalk咨询"],
    copied: ["결과가 복사됐어요. 카카오톡 채팅창에 붙여넣기 해 주세요.", "Copied! Paste it into the KakaoTalk chat.", "コピーしました。カカオトークのチャットに貼り付けてください。", "已复制，请粘贴到KakaoTalk聊天窗口。"],
    copyFail: ["아래 내용을 길게 눌러 복사해 주세요.", "Please copy the text below.", "下の内容をコピーしてください。", "请复制下面的内容。"],
    contact: ["상담 예약 안내 보기", "See booking options", "予約方法を見る", "查看预约方式"],
    restart: ["다시 하기", "Start over", "やり直す", "重新开始"],
    note2: ["이 체크리스트는 의학적 진단이 아니며 상담을 위한 참고 자료입니다. 통증이나 질환이 의심되면 먼저 의료기관을 방문해 주세요. '결과 보내기'를 누르기 전에는 입력한 내용이 저장되거나 전송되지 않습니다.",
            "This checklist is not a medical diagnosis — it's a reference for your consultation. Nothing is saved or sent until you press 'Send result'.",
            "このチェックリストは医学的な診断ではなく、相談のための参考資料です。「結果を送る」を押すまで、入力内容は保存・送信されません。",
            "本自查表不是医学诊断，仅供咨询参考。在点击“发送结果”之前，您填写的内容不会被保存或发送。"],
    sendTitle: ["센터에 결과 미리 보내기", "Send your result to the center", "結果をセンターに送る", "将结果发送给中心"],
    sendDesc: ["이름과 연락처를 남기면 담당자가 결과를 미리 확인하고 연락드려요.", "Leave your name and number, and we'll review your result and contact you.", "お名前と連絡先を残すと、担当者が結果を確認してご連絡します。", "留下姓名和联系方式，负责人会提前查看结果并与您联系。"],
    fName: ["이름", "Name", "お名前", "姓名"], fPhone: ["연락처", "Phone", "連絡先", "联系电话"],
    agreePriv: ["[필수] 개인정보 수집·이용에 동의합니다.", "[Required] I agree to the collection and use of personal information.", "［必須］個人情報の収集・利用に同意します。", "［必选］同意收集和使用个人信息。"],
    agreeSens: ["[필수] 건강 관련 정보(민감정보) 처리에 동의합니다.", "[Required] I agree to the processing of health-related (sensitive) information.", "［必須］健康に関する情報（機微情報）の取り扱いに同意します。", "［必选］同意处理健康相关（敏感）信息。"],
    privBody: ["수집 항목: 이름, 연락처 · 목적: 상담 연락 및 예약 안내 · 보유 기간: 수집일로부터 1년 또는 삭제 요청 시까지", "Items: name, phone · Purpose: consultation contact and booking · Retention: 1 year from collection or until you request deletion", "収集項目：氏名、連絡先 · 目的：相談の連絡・予約案内 · 保有期間：収集日から1年、または削除のご依頼まで", "收集项目：姓名、联系电话 · 目的：咨询联系及预约通知 · 保存期限：自收集之日起1年或至申请删除时"],
    sensBody: ["처리 항목: 운동 목표, 불편한 부위, 수술·부상 이력, 활동·생활 습관, 수면 시간 · 목적: 상담 준비 및 운동 방향 설정 · 보유 기간: 위와 같음", "Items: goals, areas of discomfort, surgery/injury history, activities and habits, sleep · Purpose: preparing your consultation and exercise direction · Retention: same as above", "項目：運動の目標、気になる部位、手術・ケガの経験、活動・生活習慣、睡眠時間 · 目的：相談の準備と運動方向の設定 · 保有期間：同上", "项目：运动目标、不适部位、手术·受伤经历、活动·生活习惯、睡眠时间 · 目的：准备咨询及制定运动方向 · 保存期限：同上"],
    refuse: ["동의하지 않아도 되며, 이 경우 위의 카카오톡 보내기로 상담하실 수 있어요.", "You may decline; you can still consult by sending your result via KakaoTalk above.", "同意しなくても構いません。その場合は上のカカオトーク送信でご相談いただけます。", "您可以不同意，此时仍可通过上方的KakaoTalk发送结果进行咨询。"],
    policy: ["개인정보처리방침 보기", "Privacy policy", "個人情報処理方針", "隐私政策"],
    submit: ["결과 보내기", "Send result", "結果を送る", "发送结果"],
    sending: ["보내는 중…", "Sending…", "送信中…", "发送中…"],
    sent: ["결과가 전달됐어요. 확인 후 연락드릴게요.", "Sent! We'll get back to you soon.", "送信しました。確認後ご連絡します。", "已发送，我们确认后会与您联系。"],
    sendFail: ["전송에 실패했어요. 카카오톡 보내기를 이용해 주세요.", "Sending failed. Please use KakaoTalk instead.", "送信に失敗しました。カカオトーク送信をご利用ください。", "发送失败，请改用KakaoTalk发送。"],
    needFields: ["이름, 연락처와 필수 동의를 확인해 주세요.", "Please enter your name, phone and required consents.", "お名前・連絡先と必須の同意をご確認ください。", "请填写姓名、电话并勾选必选同意项。"],
    note: ["이 체크리스트는 의학적 진단이 아니며 상담을 위한 참고 자료입니다. 통증이나 질환이 의심되면 먼저 의료기관을 방문해 주세요. 입력한 내용은 저장되거나 전송되지 않습니다.",
           "This checklist is not a medical diagnosis — it's a reference for your consultation. Your answers are not saved or sent anywhere.",
           "このチェックリストは医学的な診断ではなく、相談のための参考資料です。入力内容は保存・送信されません。",
           "本自查表不是医学诊断，仅供咨询参考。您填写的内容不会被保存或发送。"]
  };

  var root = document.querySelector("[data-checklist]");
  if (!root) return;
  var state = { step: 0, answers: {}, extra: {}, done: false };
  STEPS.forEach(function (s) { s.groups.forEach(function (g) { state.answers[g.id] = []; }); });

  function h(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function stepValid(i) { return STEPS[i].groups.every(function (g) { return !g.required || state.answers[g.id].length; }); }

  function toggle(g, opt) {
    var cur = state.answers[g.id];
    if (!g.multi) { state.answers[g.id] = [opt.v]; }
    else if (cur.indexOf(opt.v) >= 0) { state.answers[g.id] = cur.filter(function (v) { return v !== opt.v; }); }
    else if (opt.only) { state.answers[g.id] = [opt.v]; }
    else {
      var onlyVals = g.options.filter(function (o) { return o.only; }).map(function (o) { return o.v; });
      state.answers[g.id] = cur.filter(function (v) { return onlyVals.indexOf(v) < 0; }).concat(opt.v);
    }
    render(true);
  }

  function recommend() {
    var a = state.answers, list = [];
    if (a.goal.indexOf("surgery") >= 0 || /surgery/.test(a.history[0] || "") || a.history[0] === "injury") list.push("surgery");
    if (a.goal.indexOf("posture") >= 0 || a.goal.indexOf("comfort") >= 0 || a.habit.some(function (v) { return ["sit", "screen", "stand"].indexOf(v) >= 0; })) list.push("posture");
    if (a.goal.indexOf("sport") >= 0 || (a.freq[0] === "3+" && a.activity.some(function (v) { return ["golf", "parkgolf", "racket", "soccer", "baseball", "ball", "run"].indexOf(v) >= 0; }))) list.push("sport");
    if (a.goal.indexOf("strength") >= 0 || a.freq[0] === "rare") list.push("strength");
    if (!list.length) list.push("posture");
    return list.filter(function (v, i) { return list.indexOf(v) === i; }).slice(0, 2);
  }
  function label(gid, v, f) {
    var g; STEPS.forEach(function (s) { s.groups.forEach(function (x) { if (x.id === gid) g = x; }); });
    var o = g.options.filter(function (x) { return x.v === v; })[0];
    if (o && o.input && state.extra[gid]) return f(o.t).replace(/\s*[(（].*[)）]\s*$/, "") + ": " + state.extra[gid];
    return o ? f(o.t) : v;
  }
  function summaryKo() {
    var a = state.answers;
    function list(gid) { return a[gid].length ? a[gid].map(function (v) { return label(gid, v, K); }).join(", ") : "-"; }
    return [
      "[데이지 운동센터 · 몸 체크리스트]",
      "운동 목표: " + list("goal"),
      "불편한 부위: " + list("area"),
      "수술·부상 이력: " + list("history"),
      "즐겨 하는 활동: " + list("activity"),
      "운동 횟수: " + list("freq"),
      "생활 습관: " + list("habit"),
      "수면 시간: " + list("sleep"),
      "희망 시간대: " + list("time"),
      "추천 상담 프로그램: " + recommend().map(function (k) { return K(PROGRAMS[k].name); }).join(", ")
    ].join("\n");
  }

  function payload(name, phone) {
    var a = state.answers;
    function list(gid) { return a[gid].map(function (v) { return label(gid, v, K); }).join(", "); }
    return {
      name: name, phone: phone, lang: window.DAISY_lang || "ko",
      goal: list("goal"), area: list("area"), history: list("history"), activity: list("activity"),
      freq: list("freq"), habit: list("habit"), sleep: list("sleep"), time: list("time"),
      recommend: recommend().map(function (k) { return K(PROGRAMS[k].name); }).join(", "),
      consentPrivacy: true, consentSensitive: true, page: location.href.split("#")[0]
    };
  }
  function sendForm(endpoint) {
    var f = h("form", "cl-send"); f.noValidate = true;
    f.appendChild(h("p", "cl-glabel", L(UI.sendTitle)));
    f.appendChild(h("p", "cl-hint", L(UI.sendDesc)));
    if (state.sent) { var ok = h("p", "cl-msg", L(UI.sent)); f.appendChild(ok); return f; }
    var row = h("div", "cl-send-row");
    function field(id, lab, type, ac) {
      var w = h("div", "pt-field"); var l = h("label", null, L(lab)); l.htmlFor = id;
      var i = h("input"); i.id = id; i.type = type; i.autocomplete = ac; i.required = true;
      if (type === "tel") i.inputMode = "tel";
      w.appendChild(l); w.appendChild(i); row.appendChild(w); return i;
    }
    var iName = field("cl-name", UI.fName, "text", "name");
    var iPhone = field("cl-phone", UI.fPhone, "tel", "tel");
    f.appendChild(row);
    var hp = h("input"); hp.type = "text"; hp.name = "website"; hp.tabIndex = -1; hp.autocomplete = "off"; hp.className = "cl-hp"; hp.setAttribute("aria-hidden", "true");
    f.appendChild(hp);
    function consent(id, lab, body) {
      var w = h("div", "cl-consent");
      var c = h("input"); c.type = "checkbox"; c.id = id; c.required = true;
      var l = h("label", null, L(lab)); l.htmlFor = id;
      var top = h("div", "cl-consent-top"); top.appendChild(c); top.appendChild(l); w.appendChild(top);
      w.appendChild(h("p", "cl-consent-body", L(body)));
      f.appendChild(w); return c;
    }
    var c1 = consent("cl-agree1", UI.agreePriv, UI.privBody);
    var c2 = consent("cl-agree2", UI.agreeSens, UI.sensBody);
    var refuse = h("p", "cl-hint", L(UI.refuse)); f.appendChild(refuse);
    var pol = h("a", "cl-policy", L(UI.policy)); pol.href = "privacy.html"; pol.target = "_blank"; pol.rel = "noopener"; f.appendChild(pol);
    var btn = h("button", "btn btn-primary cl-submit", L(UI.submit)); btn.type = "submit"; f.appendChild(btn);
    var st = h("p", "cl-msg"); st.setAttribute("role", "status"); f.appendChild(st);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (hp.value) return; // 자동 입력 봇 차단
      var name = iName.value.trim(), phone = iPhone.value.trim();
      var okPhone = /[0-9]{2,}.*[0-9]{3,}/.test(phone);
      iName.setAttribute("aria-invalid", name ? "false" : "true");
      iPhone.setAttribute("aria-invalid", okPhone ? "false" : "true");
      if (!name || !okPhone || !c1.checked || !c2.checked) { st.textContent = L(UI.needFields); return; }
      btn.disabled = true; btn.textContent = L(UI.sending); st.textContent = "";
      fetch(endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload(name, phone)) })
        .then(function () { state.sent = true; render(); })
        .catch(function () { btn.disabled = false; btn.textContent = L(UI.submit); st.textContent = L(UI.sendFail); });
    });
    return f;
  }

  function copyText(text, ok, fail) {
    function fallback() {
      try {
        var ta = h("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); var r = document.execCommand("copy"); document.body.removeChild(ta);
        r ? ok() : fail();
      } catch (e) { fail(); }
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  function render(keepFocus) {
    var focusKey = keepFocus && document.activeElement && document.activeElement.getAttribute("data-key");
    root.textContent = "";
    var card = h("div", "cl-card");
    var head = h("div", "cl-head");
    head.appendChild(h("span", "cl-brand", L(UI.brand)));
    if (!state.done) head.appendChild(h("span", "cl-count", (state.step + 1) + " / " + STEPS.length));
    card.appendChild(head);
    var bar = h("div", "cl-bar"); var fill = h("span");
    fill.style.width = (state.done ? 100 : ((state.step + 1) / STEPS.length) * 100) + "%";
    bar.appendChild(fill); bar.setAttribute("aria-hidden", "true"); card.appendChild(bar);

    if (!state.done) {
      var s = STEPS[state.step];
      card.appendChild(h("p", "cl-step", L(UI.step) + " 0" + (state.step + 1)));
      var q = h("h3", "cl-q", L(s.title)); q.id = "cl-q"; card.appendChild(q);
      card.appendChild(h("p", "cl-hint", L(s.hint)));
      s.groups.forEach(function (g) {
        var box = h("div", "cl-group");
        box.setAttribute("role", "group"); box.setAttribute("aria-label", L(g.label));
        if (s.groups.length > 1) box.appendChild(h("p", "cl-glabel", L(g.label) + (g.required ? " *" : "")));
        var wrap = h("div", "cl-options");
        g.options.forEach(function (o) {
          var on = state.answers[g.id].indexOf(o.v) >= 0;
          var b = h("button", "cl-opt" + (on ? " is-on" : ""), L(o.t));
          b.type = "button"; b.setAttribute("aria-pressed", on ? "true" : "false"); b.setAttribute("data-key", g.id + ":" + o.v);
          b.addEventListener("click", function () { toggle(g, o); });
          wrap.appendChild(b);
        });
        box.appendChild(wrap);
        g.options.forEach(function (o) {
          if (!o.input || state.answers[g.id].indexOf(o.v) < 0) return;
          var inp = h("input", "cl-other");
          inp.type = "text"; inp.maxLength = 40; inp.value = state.extra[g.id] || "";
          inp.placeholder = o.ph ? L(o.ph) : ""; inp.setAttribute("aria-label", L(o.t));
          inp.addEventListener("input", function () { state.extra[g.id] = inp.value.trim(); });
          box.appendChild(inp);
          if (keepFocus && !state.extra[g.id]) setTimeout(function () { try { inp.focus(); } catch (e) {} }, 0);
        });
        card.appendChild(box);
      });
      var nav = h("div", "cl-nav");
      var prev = h("button", "btn btn-line cl-prev", L(UI.prev)); prev.type = "button";
      prev.disabled = state.step === 0;
      prev.addEventListener("click", function () { state.step--; render(); });
      var last = state.step === STEPS.length - 1;
      var next = h("button", "btn btn-primary cl-next", L(last ? UI.done : UI.next)); next.type = "button";
      next.disabled = !stepValid(state.step);
      next.addEventListener("click", function () { if (last) state.done = true; else state.step++; render(); root.scrollIntoView({ block: "nearest", behavior: "smooth" }); });
      nav.appendChild(prev); nav.appendChild(next); card.appendChild(nav);
      if (!stepValid(state.step)) card.appendChild(h("p", "cl-need", L(UI.need)));
    } else {
      card.appendChild(h("p", "cl-step", L(UI.resultEyebrow)));
      card.appendChild(h("h3", "cl-q", L(UI.resultTitle)));
      card.appendChild(h("p", "cl-glabel", L(UI.recommend)));
      recommend().forEach(function (k) {
        var r = h("div", "cl-rec");
        r.appendChild(h("strong", null, L(PROGRAMS[k].name)));
        r.appendChild(h("p", null, L(PROGRAMS[k].why)));
        card.appendChild(r);
      });
      card.appendChild(h("p", "cl-glabel", L(UI.areas)));
      var areas = state.answers.area.filter(function (v) { return v !== "none"; });
      var chips = h("div", "cl-options");
      if (areas.length) areas.forEach(function (v) { chips.appendChild(h("span", "cl-tag", label("area", v, L))); });
      else chips.appendChild(h("span", "cl-tag", L(UI.noArea)));
      card.appendChild(chips);

      var acts = h("div", "cl-actions");
      var kakao = (window.DAISY_DATA && window.DAISY_DATA.contact && window.DAISY_DATA.contact.kakaoUrl) || "";
      var msg = h("p", "cl-msg"); msg.setAttribute("role", "status");
      var send = h("a", "btn btn-primary", L(UI.send));
      if (kakao) { send.href = kakao; send.target = "_blank"; send.rel = "noopener noreferrer"; } else { send.href = "#contact"; }
      send.addEventListener("click", function () {
        var text = summaryKo();
        copyText(text, function () { msg.textContent = L(UI.copied); }, function () {
          msg.textContent = L(UI.copyFail);
          var pre = h("textarea", "cl-copybox"); pre.value = text; pre.readOnly = true; pre.rows = 8;
          if (!root.querySelector(".cl-copybox")) card.appendChild(pre);
        });
      });
      var contact = h("a", "btn btn-line", L(UI.contact)); contact.href = "#contact";
      var again = h("button", "cl-restart", L(UI.restart)); again.type = "button";
      again.addEventListener("click", function () { state.step = 0; state.done = false; state.sent = false; Object.keys(state.answers).forEach(function (k) { state.answers[k] = []; }); state.extra = {}; render(); });
      acts.appendChild(send); acts.appendChild(contact);
      card.appendChild(acts); card.appendChild(msg);
      var endpoint = (window.DAISY_DATA && window.DAISY_DATA.contact && window.DAISY_DATA.contact.checklistEndpoint) || "";
      if (endpoint) card.appendChild(sendForm(endpoint));
      card.appendChild(again);
    }
    var hasEndpoint = !!(window.DAISY_DATA && window.DAISY_DATA.contact && window.DAISY_DATA.contact.checklistEndpoint);
    card.appendChild(h("p", "cl-note", L(hasEndpoint ? UI.note2 : UI.note)));
    root.appendChild(card);
    if (focusKey) { var f = root.querySelector('[data-key="' + focusKey + '"]'); if (f) f.focus(); }
  }

  render();
  document.addEventListener("daisy:lang", function () { render(); });
})();
