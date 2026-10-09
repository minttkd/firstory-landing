import mixpanel from 'mixpanel-browser'
import { GA_MEASUREMENT_ID, META_PIXEL_ID, MIXPANEL_TOKEN } from './config'

let mixpanelInitialized = false

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

// ---- Mixpanel ----------------------------------------------------------------------------
// 토큰(VITE_MIXPANEL_TOKEN)이 있는 배포 사이트에서만 전송해요. 자동 수집(클릭·페이지뷰·마케팅 파라미터)은 모두 끄고,
// 분석 명세의 7개 이벤트(landing_viewed, section_viewed, sample_opened, sample_closed, faq_opened,
// cta_clicked, email_submitted)만 직접 보내요. 이메일 등 개인정보는 속성으로 보내지 않아요.
export function initMixpanel() {
  if (MIXPANEL_TOKEN && import.meta.env.PROD && !mixpanelInitialized) {
    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: false,
      track_pageview: false,
      track_marketing: false,
      record_sessions_percent: 100,
      record_mask_all_inputs: true,
      record_mask_all_text: true,
      record_console: false,
    })
    mixpanelInitialized = true
  }

  trackMixpanel('landing_viewed')
}

// 모든 이벤트에 붙는 공통 속성
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
// UTM은 이 페이지를 연 시점의 주소에서 한 번만 읽어요. 저장소에 남기지 않으니 다음 방문에 이전 값이 따라가지 않고,
// 같은 페이지 안의 #cta 이동은 주소의 쿼리(?utm_...)를 바꾸지 않아 값이 유지돼요. UTM 없이 들어오면 'none'으로 구분해요.
const pageUtm = Object.fromEntries(
  UTM_KEYS.map((key) => [key, new URLSearchParams(window.location.search).get(key)?.trim() || 'none']),
)

// 익명 세션 식별값: 탭(세션)마다 하나. 저장소를 못 쓰는 환경에서는 이 페이지를 연 동안만 유지돼요.
const createId = () =>
  window.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
const sessionId = (() => {
  try {
    const saved = window.sessionStorage.getItem('firstory_session_id')
    if (saved) return saved
    const id = createId()
    window.sessionStorage.setItem('firstory_session_id', id)
    return id
  } catch {
    return createId()
  }
})()

const getDeviceType = () => (window.innerWidth <= 760 ? 'mobile' : window.innerWidth <= 1024 ? 'tablet' : 'desktop')

export function trackMixpanel(name, props) {
  const payload = {
    session_id: sessionId,
    page_path: window.location.pathname,
    ...pageUtm,
    device_type: getDeviceType(),
    ...props,
  }
  if (import.meta.env.DEV) console.debug('[MP]', name, payload)
  if (mixpanelInitialized) mixpanel.track(name, payload)
}

// section_viewed: 섹션이 화면에 50% 이상 1초 이상 머물면 페이지뷰당 한 번만 기록해요.
// 화면보다 긴 섹션은 "섹션의 50%"를 채울 수 없으니 "화면 높이의 50% 이상"이 보이면 노출로 봐요.
const viewedSections = new Set()
export function observeMixpanelSection(element, sectionName) {
  if (viewedSections.has(sectionName) || !('IntersectionObserver' in window)) return () => {}

  let timer = null
  const cancel = () => {
    window.clearTimeout(timer)
    timer = null
  }

  const halfRatio = Math.min(0.5, (window.innerHeight * 0.5) / Math.max(element.offsetHeight, 1))
  const thresholds = Array.from({ length: 21 }, (_, i) => i / 20).concat(halfRatio)

  const observer = new IntersectionObserver(
    ([entry]) => {
      const viewportHeight = entry.rootBounds?.height || window.innerHeight
      const needed = Math.min(entry.boundingClientRect.height, viewportHeight) * 0.5
      const visible = entry.isIntersecting && entry.intersectionRect.height >= needed - 1

      if (!visible) {
        cancel()
        return
      }
      if (timer) return

      timer = window.setTimeout(() => {
        viewedSections.add(sectionName)
        trackMixpanel('section_viewed', { section_name: sectionName })
        observer.disconnect()
      }, 1000)
    },
    { threshold: thresholds.sort((a, b) => a - b) },
  )

  observer.observe(element)
  return () => {
    cancel()
    observer.disconnect()
  }
}

// ---- GA4 ---------------------------------------------------------------------------------
// 이벤트 전송. GA가 꺼져 있으면 아무것도 보내지 않고, 개발 중에는 콘솔에만 찍어서 확인할 수 있어요.
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
