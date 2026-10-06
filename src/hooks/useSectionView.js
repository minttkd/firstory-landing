import { useEffect, useRef } from 'react'
import { trackEventOnce } from '../analytics'

// 요소가 실제로 화면(viewport)에 들어왔을 때 이벤트를 방문당 한 번만 보내요. (스크롤 % 기준이 아님)
// 화면 위·아래 20%를 뺀 가운데 영역에 요소가 닿으면 "노출"로 봐요. 가장자리에 살짝 걸친 것은 세지 않고, 아주 긴 섹션도 같은 기준으로 잡혀요.
// getParams: 이벤트 파라미터를 보내는 시점에 계산하는 함수 (선택)
export default function useSectionView(eventName, getParams) {
  const ref = useRef(null)
  const getParamsRef = useRef(getParams)

  useEffect(() => {
    getParamsRef.current = getParams
  })

  useEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) return undefined

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

  return ref
}
