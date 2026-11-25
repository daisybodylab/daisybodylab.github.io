/* ==========================================================================
   DAISY BODYLAB — 운영자 수정 파일
   --------------------------------------------------------------------------
   이 파일만 수정하면 연락처·링크·운영시간·사진·저널·회원 사례가 바뀝니다.
   - 값이 비어 있으면("") 해당 버튼은 '준비 중'으로 표시되고 어디로도 연결되지 않습니다.
   - 따옴표(" ")와 쉼표(,)를 지우지 않도록 주의하세요.
   ========================================================================== */

window.DAISY_DATA = {
  /* ---------- 연락 · 예약 ---------- */
  contact: {
    phone: "010-8244-6107",    // 화면에는 '전화 문의' 버튼을 눌렀을 때만 표시됩니다
    reservationUrl: "https://map.naver.com/p/entry/place/2098746187?placePath=%2Fticket%3Fentry%3Dpll",   // 네이버 신규상담 예약
    blogUrl: "https://blog.naver.com/daisy_bodylab",   // 네이버 블로그
    blogRssUrl: "https://rss.blog.naver.com/daisy_bodylab.xml",          // 블로그 새 글 자동 반영용 RSS
    blogFeedProxy: "https://api.rss2json.com/v1/api.json?rss_url=",       // RSS 변환 서비스 (비우면 자동 반영 끔)
    instagramUrl: "https://www.instagram.com/daisy_bodylab",
    kakaoUrl: "https://pf.kakao.com/_uTxlxbX",   // 카카오톡 채널
    kakaoName: "데이지바디랩",
    checklistEndpoint: "https://script.google.com/macros/s/AKfycbzvuH3KYOwC-9F12GNEJt_WgpHvLkofWsqVR7v4LxC86kMya1mibjf8SMiBhz6gbyAs/exec",     // 체크리스트 결과를 받을 구글 시트 주소(웹 앱 URL). 비워 두면 '결과 보내기'가 숨겨짐 — docs/구글시트_연결_안내.md 참고
    partnershipEndpoint: "",   // 제휴 문의를 받을 구글 시트 주소. 비워 두면 위 checklistEndpoint와 같은 시트(제휴 문의 탭)로 저장됨
    partnerEmail: "",          // 제휴 제안을 받을 이메일 (입력하면 '이메일로 보내기' 버튼이 나타남) [확인 필요]
    instagramHandle: "@daisy_bodylab",
    youtubeUrl: "https://youtu.be/DvLm7MDHyfQ",   // 유튜브 채널 주소를 알게 되면 채널 주소(https://www.youtube.com/@...)로 바꿔 주세요
    youtubeName: "데이지 운동센터",
    youtubeVideoUrl: "https://youtu.be/DvLm7MDHyfQ",  // 메인에 보이는 대표 영상 (EP.01)
    mapUrl: "https://map.naver.com/p/entry/place/2098746187",   // 네이버 지도 플레이스
    naverReviewUrl: "https://m.place.naver.com/place/2098746187/review/visitor",   // 네이버 플레이스 방문자 리뷰 (회원 후기 페이지의 '전체 보기' 버튼)
    instagramFeedId: "",   // 인스타그램 게시물 자동 표시용 Behold 피드 ID (behold.so에서 발급). 비워 두면 인스타그램 바로가기 카드만 보임
    mapEmbedUrl: ""            // 지도 임베드 URL (선택)        [확인 필요]
  },

  /* ---------- 위치 · 주차 ---------- */
  location: {
    address: "광주광역시 광산구 수완동 1443, 4층",
    roadAddress: "",           // 도로명 주소 · 건물명 [확인 필요]
    parking: "주차권 제공 · 쏘카 노블타워주차장 (수완동 1434)",
    parkingDetail: ""          // 제공 시간 · 이용 방법 [확인 필요]
  },

  /* ---------- 운영시간 (비워두면 '확인 후 안내'로 표시) ---------- */
  hours: [
    { day: "평일 (월~금)", time: "10:00 – 22:00" },
    { day: "토요일", time: "09:00 – 14:00" },
    { day: "일요일", time: "휴무" }
  ],

  /* ---------- 대표 소개 ---------- */
  /* 대표 약력은 index.html 의 '대표 및 전문성' 부분에 직접 적혀 있습니다(검색 노출을 위해). */

  /* ---------- 사진 (images 폴더에 넣고 경로 입력, 비우면 자리표시) ---------- */
  images: {
    hero: "images/hero.jpg",               // 체형분석 평가 장면
    philosophy: "images/philosophy.jpg",   // 상담실
    director: "images/director.jpg",       // 대표 프로필 사진 (세로 4:5)
    program1: "images/program1.jpg", program2: "images/program2.jpg", program3: "images/program3.jpg", program4: "images/program4.jpg",   // 프로그램별 사진
    program5: "images/space-cardio.jpg", program6: "images/space-warmup.jpg",   // 다이어트 · 시니어 맞춤 (전용 사진이 생기면 교체)
    motiphysio: "images/motiphysio.jpg",
    moty: "images/moty.jpg",
    space1: "images/space-main.jpg",       // 메인 운동 공간 (큰 칸)
    space2: "images/space-assessment.jpg", // 체형분석 공간
    space3: "images/moty.jpg",             // MOTY
    space4: "images/space-cardio.jpg",     // 파워타워 · 트레드밀
    space5: "images/space-warmup.jpg",     // 몸풀기 · 필라테스 바렐
    space6: "images/space-bed.jpg",        // 기능평가 · 컨디셔닝 베드 (넓은 칸)
    space7: "images/space-wash.jpg"        // 리프레시 존 · 손발 정돈 공간 (넓은 칸)
  },

  /* ---------- 데이지 저널 ----------
     자동 갱신(data/journal.json)이 켜져 있으면 그 내용이 우선 표시됩니다.
     자동 갱신을 쓰지 않을 때만 아래에 직접 글을 등록하세요. */
  journal: [
    // {
    //   category: "체형과 움직임",
    //   title: "글 제목",
    //   summary: "한두 줄 요약",
    //   date: "2026.11.20",
    //   thumbnail: "images/journal-01.jpg",
    //   url: "https://blog.naver.com/..."
    // }
  ],

  /* ---------- 회원 후기 (네이버 플레이스 방문자 리뷰) ----------
     네이버 플레이스에 올라온 리뷰 중 홈페이지에 소개할 것을 골라 아래 형식으로 붙여 넣으세요.
     · author: 닉네임은 일부를 가려 주세요 (예: "수완동 김**", "di***")
     · event: true 로 두면 '리뷰 이벤트 참여' 표시가 붙습니다. 이벤트로 작성된 리뷰는 꼭 true 로 해 주세요.
     · 리뷰 내용은 고치지 말고 그대로 옮기되, 너무 길면 앞부분만 넣고 끝에 … 을 붙여도 됩니다.
     · 운동 효과를 과장하거나 치료된 것처럼 읽히는 리뷰는 올리지 않는 것이 안전합니다. */
  reviews: [
    // {
    //   text: "리뷰 내용을 그대로 붙여 넣으세요.",
    //   author: "김**",
    //   date: "2026.11",
    //   program: "체형교정 운동",   // 선택
    //   event: false
    // },
  ]
};
