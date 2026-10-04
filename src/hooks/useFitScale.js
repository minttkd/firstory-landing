import { useLayoutEffect, useRef, useState } from 'react'

// 고정 폭(designWidth)으로 그려진 데코 영역을 컨테이너 폭에 맞춰 축소해주는 훅.
// 반환: [ref(바깥 래퍼에 연결), scale(0~1)]
export default function useFitScale(designWidth) {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const update = () => setScale(Math.min(1, el.clientWidth / designWidth))
    update()

    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [designWidth])

  return [ref, scale]
}
