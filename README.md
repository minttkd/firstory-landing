# FIRSTORY Landing

아이가 처음 겪는 경험을 AI와 함께 맞춤 동화로 만들고, 부모와 아이가 이야기를 나눌 수 있게 돕는 **FIRSTORY** 서비스의 랜딩페이지입니다.

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
├─ hooks/        useFitScale (고정 폭 장식 영역을 화면 폭에 맞춰 축소)
├─ styles/       global.css (색상·폰트 토큰, 공통 스타일)
├─ config.js     버튼 링크, 푸터 문의처
└─ App.jsx       섹션 조립
```

섹션마다 JSX와 CSS 파일이 분리되어 있어서, 서로 다른 섹션을 맡으면 충돌 없이 작업할 수 있어요.

## 디자인 / 폰트

- 디자인 원본: Figma `겨울잠_Firstory` → `Desktop - 1` (1440px 기준)
- 폰트: Darumadrop One(로고), **Memoment 꾹꾹체**(제목), **오뮤 다예쁨체**(손글씨 본문), Pretendard(본문), Noto Sans KR(푸터)
  - Darumadrop One / Noto Sans KR / Pretendard는 웹폰트로 불러와요 (`index.html`).
  - Memoment 꾹꾹체와 오뮤 다예쁨체는 웹폰트 주소를 확정하지 못해서, PC에 설치된 폰트를 쓰고 없으면 Gaegu로 대체돼요.
    배포 전에 폰트 파일(woff2)을 `src/assets/fonts/`에 넣고 `global.css`에 `@font-face`를 추가해주세요.
- 이미지는 Figma 임시 URL이 아니라 `src/assets`에 내려받아 사용합니다. PNG 용량이 커서 배포 전 압축/WebP 변환을 권장해요.

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
- [ ] Memoment 꾹꾹체 / 오뮤 다예쁨체 웹폰트 연결
- [ ] FAQ 2·3번 답변 문구 확정 (`Faq.jsx`, 현재 임시 문구)
- [ ] 버튼 링크 연결 (`src/config.js`: `CTA_URL`, `SAMPLE_BOOK_URL`, `GUIDE_URL`) 및 푸터 문의 이메일
- [ ] 이미지 최적화 (PNG → WebP, 크기 조정)
- [ ] 태블릿/모바일 디자인 확정 후 반응형 보완 (현재는 임시 대응)
- [ ] OG 이미지, 서비스 URL 등 메타 태그 보강 (`index.html`)
- [ ] 배포 (Vercel / Netlify / GitHub Pages 중 선택)
