import { GA_MEASUREMENT_ID, META_PIXEL_ID } from './config'

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

// Meta 픽셀 로드 (Meta가 안내한 설치 코드와 같은 동작). 배포(빌드)된 사이트에서만 동작해요.
export function initMetaPixel() {
  if (!META_PIXEL_ID || !import.meta.env.PROD || window.fbq) return

  const fbq = function fbq() {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments)
    else fbq.queue.push(arguments)
  }
  window.fbq = fbq
  window._fbq = fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  fbq('init', META_PIXEL_ID)
  fbq('track', 'PageView')
}

// 이벤트 전송. GA가 꺼져 있으면(개발 중 등) 아무것도 보내지 않고, 개발 중에는 콘솔에만 찍어서 확인할 수 있어요.
export function trackEvent(name, params) {
  if (import.meta.env.DEV) console.debug('[GA]', name, params ?? '')
  if (typeof window.gtag === 'function') window.gtag('event', name, params)
}

// 같은 방문(페이지를 연 뒤 새로고침 전까지) 안에서는 이름당 한 번만 보내요. 섹션 노출·완독 같은 "최초" 이벤트용.
const sentOnce = new Set()
export function trackEventOnce(name, params) {
  if (sentOnce.has(name)) return
  sentOnce.add(name)
  trackEvent(name, params)
}

// 출시 혜택 영역에 어떻게 도착했는지 (Hero 버튼으로 바로 이동했는지, 스크롤로 왔는지)
let benefitEntryMethod = 'scroll'
export const setBenefitEntryMethod = (method) => {
  benefitEntryMethod = method
}
export const getBenefitEntryMethod = () => benefitEntryMethod

// GA에 저장하는 값(화면 문구와 구분)
export const SAMPLE_ID = 'tori_red_block'
export const PRICE = 13200
export const PRICE_RESPONSE = {
  비싸다: 'expensive',
  적당하다: 'reasonable',
  저렴하다: 'cheap',
  기타: 'other',
}
