# FIRSTORY Landing

**FIRSTORY** 서비스의 랜딩페이지입니다.

> 아이에게 어떤 말을 어떻게 전해야 할지 고민되는 순간, 아이의 경험을 닮은 맞춤형 AI 동화를 통해 부모와 아이가 자연스럽게 대화할 수 있도록 돕는 서비스
>
> 동화 자체를 만드는 것이 목적이 아니라, 부모와 아이의 대화를 시작하고 이어가기 위한 매개체로 동화를 활용한다.

문구를 쓸 때는 "동화 생성"이 아니라 **"부모와 아이의 대화"**가 중심이 되도록 해주세요.

- 대상: 4~6세 자녀를 둔 부모
- 스택: Vite + React (JavaScript)
- 팀: 프론트엔드 박서연, 차민상

## 시작하기

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
npm run lint
```

Node.js 20 이상을 권장합니다.

## 폴더 구조

```
src/
├─ assets/
│  ├─ images/    Figma에서 내려받은 PNG (히어로, 동화 일러스트 등)
│  └─ icons/     Figma에서 내려받은 SVG (화살표, 장식 도형 등)
├─ components/   섹션별 컴포넌트 (JSX + CSS가 한 쌍)
│  ├─ Hero         첫 화면
│  ├─ Problem      "이런 순간, 있으셨죠?"
│  ├─ Steps        이용 방법 3단계
│  ├─ Sample       샘플 동화책 + 대화 가이드
│  ├─ Faq          자주 묻는 질문 (아코디언)
│  ├─ FinalCta     마무리 CTA
│  ├─ Footer
│  └─ Button       공통 버튼 (primary / mint / gradient)
├─ hooks/        useFitScale (고정 폭 장식 영역을 화면 폭에 맞춰 축소), useSectionView (섹션 노출 이벤트)
├─ analytics.js  GA4·Meta Pixel·Mixpanel 로드와 이벤트 전송 (trackEvent)
├─ styles/       global.css (색상·폰트 토큰, 공통 스타일)
├─ config.js     버튼 링크, 푸터 문의처
└─ App.jsx       섹션 조립
```

섹션마다 JSX와 CSS 파일이 분리되어 있어서, 서로 다른 섹션을 맡으면 충돌 없이 작업할 수 있어요.

## 분석 (GA4 / Meta Pixel / Mixpanel)

- 측정 ID는 `src/config.js`의 `GA_MEASUREMENT_ID`예요. 배포 빌드에서만 GA가 켜지고, `npm run dev`에서는 이벤트가 분석 도구로 가지 않고 브라우저 콘솔에 `[GA] 이벤트명 {값}`(GA4), `[MP] 이벤트명 {값}`(Mixpanel)으로만 찍혀요(확인용).
- 이벤트는 `trackEvent('이름', { 파라미터 })`로 보내요. 섹션 노출은 `useSectionView` 훅이 방문당 한 번만 보내요.
- 이벤트 이름·파라미터는 분석 명세(가설 검증용)와 같아야 해요. 이름이나 값을 바꾸기 전에 분석 담당과 먼저 상의해 주세요.
- 화면 문구와 GA 값은 달라요. 예) 가격 의견 "비싸다" → `expensive` (`analytics.js`의 `PRICE_RESPONSE`).
- Mixpanel은 배포 환경변수 `VITE_MIXPANEL_TOKEN`에 Project Token이 있을 때만 켜져요(토큰은 배포 서비스의 환경변수에 넣고, 바꾸면 다시 배포해야 반영돼요). 자동 수집(클릭·페이지뷰·마케팅 파라미터)은 끄고, 세션 리플레이는 배포 환경의 전체 세션에서 켜져요. 리플레이의 모든 입력값과 화면 텍스트는 마스킹하며 콘솔 로그는 수집하지 않아요. 분석 명세의 7개 이벤트만 `trackMixpanel('이름', { 속성 })`으로 보내며, GA4 이벤트(`trackEvent`)는 Mixpanel로 가지 않아요.
  - 이벤트: `landing_viewed`, `section_viewed`(`section_name`: hero/process/sample/faq/bottom_cta), `sample_opened`·`sample_closed`(`sample_type`: story/guide), `faq_opened`(`faq_id`: faq_01…), `cta_clicked`(`cta_position`: hero), `email_submitted`
  - 모든 이벤트의 공통 속성: `session_id`, `page_path`, `utm_source`·`utm_medium`·`utm_campaign`·`utm_content`, `device_type`. UTM은 페이지를 연 주소에서만 읽고(저장하지 않음) 없으면 `none`이에요.
  - `section_viewed`는 섹션이 50% 이상(화면보다 긴 섹션은 화면 높이의 50% 이상) 1초 이상 보일 때 페이지뷰당 한 번만 보내요.
  - 이메일 등 개인정보는 속성으로 보내지 않아요.
  - 로컬에서 실제 전송까지 확인하려면 `.env.example`을 `.env.local`로 복사해 토큰을 넣고 `npm run build && npm run preview`로 확인해요.

## 디자인 / 폰트

- 디자인 원본: Figma `겨울잠_Firstory` → `Desktop - 1` (1440px 기준)
- 폰트: Darumadrop One(로고), **Memoment 꾹꾹체**(제목), **오뮤 다예쁨체**(손글씨 본문), Pretendard(본문), Noto Sans KR(푸터)
  - Darumadrop One / Noto Sans KR / Pretendard는 웹폰트로 불러와요 (`index.html`).
  - **Memoment 꾹꾹체**는 `src/assets/fonts/MemomentKkukkukk.woff2`로 연결되어 있어요. 원본(25MB)에서 페이지에 쓰인 글자만 뽑은 파일(약 230KB)이라,
    문구를 바꾸면 `python scripts/subset-font.py <원본.ttf> src/assets/fonts/MemomentKkukkukk.woff2`로 다시 만들어주세요. (`pip install fonttools brotli` 필요)
    빠진 글자는 Gaegu로 대체돼요.
  - **오뮤 다예쁨체**는 `src/assets/fonts/OmyuPretty.woff2`(약 3.4MB)로 연결되어 있어요. 공식 배포처: https://omyudiary.com/1510339180/?idx=28
    라이선스가 "폰트 수정 금지, 재배포 금지"라 **글자 추출(subset)을 하지 않고** 원본을 woff2로 포맷 변환만 했어요. 원본 ttf는 `fonts-src/`에 두고 git에는 올리지 않아요(`.gitignore`).
    용량이 부담되면 오뮤다이어리에 허락을 받은 뒤 `scripts/subset-font.py`로 줄일 수 있어요.
- 이미지는 Figma 임시 URL이 아니라 `src/assets`에 내려받아 사용합니다. 사진/일러스트는 WebP(품질 84)로 변환해 두었고(약 16MB → 0.75MB), 표시 크기의 약 2배 폭을 넘지 않게 줄였어요. 새 이미지를 추가할 때도 WebP로 변환해서 넣어주세요.

## 협업 규칙

1. `main`에 직접 푸시하지 않고, 브랜치를 만들어 Pull Request로 합칩니다.
2. 브랜치 이름: `feat/섹션이름`, `fix/내용` (예: `feat/hero-illustration`)
3. 커밋 메시지: `feat:`, `fix:`, `style:`, `docs:`, `chore:` 접두사 사용
4. PR은 상대방 리뷰 1회 후 머지합니다.
5. 색상·간격은 `src/styles/global.css`의 CSS 변수(`--coral`, `--ink` 등)를 사용합니다.
6. 작업 전 `git pull origin main`으로 최신 상태를 맞춰주세요.

```bash
git checkout -b feat/hero-illustration
# 작업 후
git add .
git commit -m "feat: 히어로 일러스트 수정"
git push -u origin feat/hero-illustration
# GitHub에서 Pull Request 생성
```

## TODO

- [x] Desktop 디자인(1440px) 구현
- [x] Memoment 꾹꾹체 웹폰트 연결
- [x] 오뮤 다예쁨체 웹폰트 연결 (원본 변환, 3.4MB)
- [ ] 오뮤 폰트 용량 줄이기 (오뮤다이어리 허락 후 subset)
- [ ] 폰트 라이선스 확인 (Memoment 꾹꾹체: 웹 임베딩/수정·재배포 가능 여부, 공개 레포에 파일을 올려도 되는지)
- [x] FAQ 2·3번 답변 문구 반영 (`Faq.jsx`)
- [ ] 버튼 링크 연결 (`src/config.js`: `CTA_URL`, `SAMPLE_BOOK_URL`, `GUIDE_URL`) 및 푸터 문의 이메일
- [x] 이미지 최적화 (PNG → WebP, 크기 조정)
- [ ] 태블릿/모바일 디자인 확정 후 반응형 보완 (현재는 임시 대응)
- [ ] OG 이미지, 서비스 URL 등 메타 태그 보강 (`index.html`)
- [ ] 배포 (Vercel / Netlify / GitHub Pages 중 선택)
