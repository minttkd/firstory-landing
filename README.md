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
├─ components/   섹션별 컴포넌트 (JSX + CSS가 한 쌍)
│  ├─ Header      상단 내비게이션
│  ├─ Hero        메인 카피 + 일러스트
│  ├─ Problem     "이런 순간, 있으셨나요?"
│  ├─ HowItWorks  이용 방법 4단계
│  ├─ StoryPreview 동화 화면 예시
│  ├─ Pledge      FIRSTORY의 약속
│  ├─ Faq         자주 묻는 질문
│  ├─ FinalCta    마무리 CTA
│  └─ Footer
├─ hooks/        useReveal (스크롤 등장 애니메이션)
├─ styles/       global.css (색상/간격 토큰, 공통 버튼·섹션 스타일)
├─ config.js     CTA 링크/문구 (출시 알림 폼 주소는 여기서만 수정)
└─ App.jsx       섹션 조립
```

섹션마다 JSX와 CSS 파일이 분리되어 있어서, 서로 다른 섹션을 맡으면 충돌 없이 작업할 수 있어요.

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

- [ ] 출시 알림 신청 폼 주소를 `src/config.js`의 `CTA_URL`에 연결
- [ ] 실제 일러스트/이미지 교체 (현재는 이모지 + CSS 임시 비주얼)
- [ ] OG 이미지, 서비스 URL 등 메타 태그 보강
- [ ] 배포 (Vercel / Netlify / GitHub Pages 중 선택)
