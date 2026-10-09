import { useEffect, useRef } from 'react'
import { observeMixpanelSection, trackEventOnce } from '../analytics'

// 섹션 노출 추적. 요소 하나에 두 가지를 걸 수 있어요.
// - eventName: GA 이벤트. 화면 위·아래 20%를 뺀 가운데 영역에 닿으면 방문당 한 번만 보내요. (스크롤 % 기준이 아님)
// - mixpanelSection: Mixpanel section_viewed의 section_name. 50% 이상 1초 이상 노출되면 방문당 한 번만 보내요.
// getParams: GA 이벤트 파라미터를 보내는 시점에 계산하는 함수 (선택)
export default function useSectionView(eventName, getParams, mixpanelSection) {
  const ref = useRef(null)
  const getParamsRef = useRef(getParams)

  useEffect(() => {
    getParamsRef.current = getParams
  })

  useEffect(() => {
    const element = ref.current
    if (!eventName || !element || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        trackEventOnce(eventName, getParamsRef.current?.())
        observer.disconnect()
      },
      { rootMargin: '-20% 0px -20% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [eventName])

  useEffect(() => {
    const element = ref.current
    if (!mixpanelSection || !element) return undefined
    return observeMixpanelSection(element, mixpanelSection)
  }, [mixpanelSection])

  return ref
}
