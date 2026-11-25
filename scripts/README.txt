[데이지 저널 — 네이버 블로그 새 글 자동 반영]

블로그(blog.naver.com/daisy_bodylab)에 새 글을 올리면 홈페이지 메인 하단과 '저널' 메뉴에 자동으로 나타납니다.
따로 할 일은 없습니다. 아래 두 가지 방식이 자동으로 함께 동작합니다.

1) 기본 방식 (설정 필요 없음)
   방문자가 홈페이지를 열 때 블로그 RSS를 변환 서비스(rss2json.com)를 통해 읽어 와서 최신 글을 보여 줍니다.
   - 설정 위치: data/site-data.js 의 blogRssUrl, blogFeedProxy
   - 무료 서비스라 갱신이 최대 1시간 정도 늦을 수 있고, 하루 요청 수 제한이 있습니다.
   - 블로그 글 이미지가 보이지 않으면 글 제목 카드로 대신 표시됩니다.

2) 더 안정적인 방식 (호스팅을 GitHub에 올린 경우 자동 동작)
   .github/workflows/update-journal.yml 이 하루 3번(09시·15시·21시) 블로그를 읽어
   data/journal.json 과 대표 이미지(images/journal)를 저장합니다. 이 파일이 있으면 1)보다 먼저 사용합니다.
   다른 호스팅이라면 컴퓨터에서  node scripts/update-journal.mjs  실행 후 두 파일을 함께 업로드하세요.

※ 글이 안 나오면 네이버 블로그 글 설정의 '외부 보내기 허용'을 켜 주세요.
※ 특정 카테고리만 보이게 하려면 workflow 파일의 CATEGORIES 를 설정하세요.
