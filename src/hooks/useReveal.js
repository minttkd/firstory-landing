import { useEffect } from 'react'

// `.reveal` 클래스가 붙은 요소가 화면에 들어오면 `.is-visible`을 붙여준다.
export default function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
