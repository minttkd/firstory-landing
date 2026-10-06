import { useCallback, useEffect, useRef, useState } from 'react'
import pageOne from '../assets/images/sample-book/Group 4.png'
import pageTwo from '../assets/images/sample-book/Group 5.png'
import pageThree from '../assets/images/sample-book/Group 6.png'
import pageFour from '../assets/images/sample-book/Group 7.png'
import pageFive from '../assets/images/sample-book/Group 8.png'
import pageSix from '../assets/images/sample-book/Group 9.png'
import pageSeven from '../assets/images/sample-book/Group 10.png'
import pageEight from '../assets/images/sample-book/Group 11.png'
import arrowActive from '../assets/figma/sample-book/arrow-active.svg'
import arrowDisabled from '../assets/figma/sample-book/arrow-disabled.svg'
import bookDivider from '../assets/figma/sample-book/book-divider.svg'
import bookFrame from '../assets/figma/sample-book/book-frame.svg'
import iconClose from '../assets/figma/sample-book/close.svg'
import { SAMPLE_ID, trackEvent, trackEventOnce } from '../analytics'
import './SampleBookModal.css'

const SAMPLE_PAGES = [pageOne, pageTwo, pageThree, pageFour, pageFive, pageSix, pageSeven, pageEight]

function preloadImage(source) {
  return new Promise((resolve) => {
    const image = new Image()
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true

      // 네트워크 수신뿐 아니라 디코딩까지 끝낸 뒤 다음 단계를 시작한다.
      const decode = typeof image.decode === 'function' ? image.decode() : Promise.resolve()
      decode.catch(() => {}).then(() => resolve(source))
    }

    image.decoding = 'async'
    image.onload = finish
    image.onerror = finish
    image.src = source

    // 캐시에 이미 있는 이미지는 load 이벤트보다 먼저 complete일 수 있다.
    if (image.complete) finish()
  })
}

function PageLayer({ source, page, className = '', ariaHidden = false }) {
  return (
    <div className={`sample-book-modal__page-layer${className ? ` ${className}` : ''}`} aria-hidden={ariaHidden}>
      {source ? (
        <img src={source} alt={ariaHidden ? '' : `${page + 1}페이지 동화`} />
      ) : (
        <div className="sample-book-modal__placeholder">
          <span>{page + 1}페이지 이미지 준비 중</span>
        </div>
      )}
    </div>
  )
}

function PageTurn({ source, direction }) {
  const pageStyle = source ? { backgroundImage: `url("${source}")` } : undefined

  return (
    <div className={`sample-book-modal__turning-spread sample-book-modal__turning-spread--${direction}`} aria-hidden="true">
      <div
        className="sample-book-modal__turning-half-page sample-book-modal__turning-half-page--left"
        style={{ ...pageStyle, backgroundPosition: 'left center' }}
      />
      <div
        className="sample-book-modal__turning-half-page sample-book-modal__turning-half-page--right"
        style={{ ...pageStyle, backgroundPosition: 'right center' }}
      />
    </div>
  )
}

export default function SampleBookModal({ isOpen, onClose }) {
  const [page, setPage] = useState(0)
  const [turningPage, setTurningPage] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [bookScale, setBookScale] = useState(1)
  const [mobileModalHeight, setMobileModalHeight] = useState(null)
  const [isFirstPageReady, setIsFirstPageReady] = useState(false)
  const [arePagesReady, setArePagesReady] = useState(false)
  const closeTimerRef = useRef(null)
  const turnTimerRef = useRef(null)
  const bookRef = useRef(null)
  const closingRef = useRef(false)

  const goToPage = useCallback(
    (nextPage) => {
      if (!arePagesReady || turningPage || nextPage < 0 || nextPage >= SAMPLE_PAGES.length || nextPage === page) return

      setTurningPage({ page, direction: nextPage > page ? 'next' : 'prev' })
      setPage(nextPage)
      turnTimerRef.current = window.setTimeout(() => setTurningPage(null), 680)
    },
    [arePagesReady, page, turningPage],
  )

  const close = useCallback(() => {
    if (closingRef.current) return

    closingRef.current = true
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(onClose, 220)
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    let cancelled = false

    const loadPages = async () => {
      // 첫 페이지는 먼저 받아서 바로 보여준다.
      await preloadImage(SAMPLE_PAGES[0])
      if (cancelled) return
      setIsFirstPageReady(true)

      // 나머지 페이지는 동시에 비동기로 준비하고, 모두 끝난 뒤에만 페이지 이동을 연다.
      await Promise.allSettled(SAMPLE_PAGES.slice(1).map((source) => preloadImage(source)))
      if (!cancelled) setArePagesReady(true)
    }

    loadPages()

    return () => {
      cancelled = true
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined

    closingRef.current = false

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') goToPage(page - 1)
      if (event.key === 'ArrowRight') goToPage(page + 1)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(closeTimerRef.current)
    }
  }, [close, goToPage, isOpen, page])

  useEffect(() => () => window.clearTimeout(turnTimerRef.current), [])

  // 동화책을 열거나 페이지를 넘길 때마다 열람 기록, 마지막 페이지에 처음 닿으면 완독 기록
  useEffect(() => {
    if (!isOpen) return
    trackEvent('sample_page_view', { sample_id: SAMPLE_ID, page_number: page + 1 })
    if (page === SAMPLE_PAGES.length - 1) trackEventOnce('sample_complete', { sample_id: SAMPLE_ID })
  }, [isOpen, page])

  useEffect(() => {
    if (!isOpen) return undefined

    const book = bookRef.current
    const modal = book?.parentElement

    if (!book || !modal) return undefined

    const updateBookScale = () => {
      if (window.innerWidth > 960) {
        setBookScale(1)
        setMobileModalHeight(null)
        return
      }

      const isSmallMobile = window.innerWidth <= 760
      const topOffset = isSmallMobile ? 72 : 86
      const bottomOffset = isSmallMobile ? 22 : 35
      const paginationHeight = 45
      const gap = 16
      const frameWidth = 919.241
      const frameHeight = 543.095
      const availableWidth = Math.max(0, modal.clientWidth - 24)
      const widthScale = availableWidth / frameWidth
      const reservedHeight = topOffset + bottomOffset + paginationHeight + gap

      if (isSmallMobile) {
        const viewportModalHeight = Math.max(0, window.innerHeight - 20)
        const heightScale = (viewportModalHeight - reservedHeight) / frameHeight
        const scale = Math.max(0.12, Math.min(1, widthScale, heightScale))

        setBookScale(scale)
        setMobileModalHeight(Math.ceil(reservedHeight + frameHeight * scale))
        return
      }

      const availableHeight = Math.max(0, modal.clientHeight - reservedHeight)
      const heightScale = availableHeight / frameHeight

      setBookScale(Math.max(0.12, Math.min(1, widthScale, heightScale)))
      setMobileModalHeight(null)
    }

    updateBookScale()

    const resizeObserver = new ResizeObserver(updateBookScale)
    resizeObserver.observe(modal)
    window.addEventListener('resize', updateBookScale)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateBookScale)
    }
  }, [isOpen])

  if (!isOpen) return null

  const image = SAMPLE_PAGES[page]
  const isFirstPage = page === 0
  const isLastPage = page === SAMPLE_PAGES.length - 1
  const canRenderPage = isFirstPageReady && (arePagesReady || page === 0)
  const isBookLoading = !isFirstPageReady || !arePagesReady

  return (
    <div
      className={`sample-book-modal-overlay${isClosing ? ' is-closing' : ''}`}
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <section
        className={`sample-book-modal${isClosing ? ' is-closing' : ''}`}
        style={{ '--sample-book-modal-height': mobileModalHeight ? `${mobileModalHeight}px` : undefined }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sample-book-modal-title"
      >
        <h2 id="sample-book-modal-title">샘플 동화책 보기</h2>
        <button type="button" className="sample-book-modal__close" onClick={close} aria-label="샘플 동화책 닫기">
          <img src={iconClose} alt="" width="28" height="26.467" />
        </button>

        <div
          ref={bookRef}
          className="sample-book-modal__book"
          style={{ transform: `translateX(-50%) scale(${bookScale})` }}
          aria-live="polite"
        >
          <img className="sample-book-modal__frame" src={bookFrame} alt="" aria-hidden="true" />
          <div className="sample-book-modal__paper" aria-hidden="true" />
          <PageLayer source={canRenderPage ? image : null} page={page} />
          {turningPage ? (
            <PageTurn source={SAMPLE_PAGES[turningPage.page]} direction={turningPage.direction} />
          ) : null}
          <img className="sample-book-modal__divider" src={bookDivider} alt="" aria-hidden="true" />
          {isBookLoading ? (
            <p className="sample-book-modal__loading" role="status" aria-live="polite">
              {!isFirstPageReady ? '첫 페이지를 불러오는 중이에요' : '동화책을 준비하고 있어요'}
            </p>
          ) : null}
        </div>

        <div className="sample-book-modal__pagination" aria-label="동화책 페이지 이동">
          <button
            type="button"
            className={`sample-book-modal__arrow sample-book-modal__arrow--prev${isFirstPage ? ' is-disabled' : ''}`}
            onClick={() => goToPage(page - 1)}
            disabled={isFirstPage}
            aria-label="이전 페이지"
          >
            <img src={isFirstPage ? arrowDisabled : arrowActive} alt="" width="19.527" height="29.161" />
          </button>

          <p>
            <strong>{page + 1}</strong>
            <span>/</span>
            <span>{SAMPLE_PAGES.length}</span>
          </p>

          <button
            type="button"
            className={`sample-book-modal__arrow sample-book-modal__arrow--next${isLastPage || !arePagesReady ? ' is-disabled' : ''}`}
            onClick={() => goToPage(page + 1)}
            disabled={isLastPage || !arePagesReady}
            aria-label="다음 페이지"
          >
            <img src={isLastPage || !arePagesReady ? arrowDisabled : arrowActive} alt="" width="19.527" height="29.161" />
          </button>
        </div>
      </section>
    </div>
  )
}
