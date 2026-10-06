import { GA_MEASUREMENT_ID } from './config'

// Google Analytics(GA4) 로드. 배포(빌드)된 사이트에서만 동작하고,
// 로컬 개발 중(npm run dev)에는 로드하지 않아 방문 데이터가 섞이지 않아요.
export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || !import.meta.env.PROD) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID)
}

// 이벤트 추적용 (GA가 꺼져 있으면 아무 일도 하지 않아요). 예: trackEvent('click_cta')
export function trackEvent(name, params) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params)
}
