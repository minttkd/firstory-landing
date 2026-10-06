// 버튼 링크는 여기서만 관리해요.
// null이면 눌러도 아무 일도 일어나지 않아요 (이동할 화면 디자인이 아직 없음).
// 화면/주소가 정해지면 '/path' 또는 'https://...'를 넣으면 링크로 동작해요.
export const CTA_URL = null // FIRSTORY 출시 혜택 받기
export const SAMPLE_BOOK_URL = null // 샘플 동화책 읽어보기
export const GUIDE_URL = null // 대화 가이드 더 보기
export const SUBSCRIBE_API_URL = 'https://backendlandingpage-production-103a.up.railway.app/api/emails/subscribe'
// 가격 피드백: { email, rating } 전송. rating은 '비싸다' | '적당하다' | '저렴하다' | '기타' 만 허용 (그 외는 422)
export const FEEDBACK_API_URL = 'https://backendlandingpage-production-103a.up.railway.app/api/feedback'

// Google Analytics(GA4) 측정 ID. null이면 GA를 로드하지 않아요.
export const GA_MEASUREMENT_ID = 'G-Q7YT2RGFJM'

// 푸터 문구 (디자인에 [팀 이메일] 자리표시자로 되어 있음)
export const CONTACT_EMAIL = '[firstory.official@gmail.com]'
