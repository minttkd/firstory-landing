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
├─ components/   섹션별 컴포넌트 (Hero.jsx + Hero.css처럼 JSX/CSS를 한 쌍으로)
├─ hooks/        useReveal (스크롤 등장 애니메이션, 필요하면 사용)
├─ styles/       global.css (색상/간격 토큰, 공통 버튼·섹션 스타일)
├─ config.js     CTA 링크/문구 (출시 알림 폼 주소는 여기서만 수정)
└─ App.jsx       섹션 조립
```

섹션마다 JSX와 CSS 파일을 분리하면, 서로 다른 섹션을 맡았을 때 충돌 없이 작업할 수 있어요.
`global.css`의 색상 변수와 공통 스타일은 임시 값이니 디자인 시안에 맞춰 수정해주세요.

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

- [ ] 디자인 시안 기준으로 `global.css` 토큰(색상, 폰트, 간격) 정리
- [ ] 섹션별 컴포넌트 구현 및 `App.jsx`에서 조립
- [ ] 출시 알림 신청 폼 주소를 `src/config.js`의 `CTA_URL`에 연결
- [ ] OG 이미지, 서비스 URL 등 메타 태그 보강 (`index.html`)
- [ ] 배포 (Vercel / Netlify / GitHub Pages 중 선택)
