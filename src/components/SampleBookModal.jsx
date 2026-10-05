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
import './SampleBookModal.css'

const SAMPLE_PAGES = [pageOne, pageTwo, pageThree, pageFour, pageFive, pageSix, pageSeven, pageEight]

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
  const closeTimerRef = useRef(null)
  const turnTimerRef = useRef(null)
  const closingRef = useRef(false)

  const goToPage = useCallback(
    (nextPage) => {
      if (turningPage || nextPage < 0 || nextPage >= SAMPLE_PAGES.length || nextPage === page) return

      setTurningPage({ page, direction: nextPage > page ? 'next' : 'prev' })
      setPage(nextPage)
      turnTimerRef.current = window.setTimeout(() => setTurningPage(null), 680)
    },
    [page, turningPage],
  )

  const close = useCallback(() => {
    if (closingRef.current) return

    closingRef.current = true
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(onClose, 220)
  }, [onClose])

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

  if (!isOpen) return null

  const image = SAMPLE_PAGES[page]
  const isFirstPage = page === 0
  const isLastPage = page === SAMPLE_PAGES.length - 1

  return (
    <div
      className={`sample-book-modal-overlay${isClosing ? ' is-closing' : ''}`}
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <section
        className={`sample-book-modal${isClosing ? ' is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sample-book-modal-title"
      >
        <h2 id="sample-book-modal-title">샘플 동화책 보기</h2>
        <button type="button" className="sample-book-modal__close" onClick={close} aria-label="샘플 동화책 닫기">
          <img src={iconClose} alt="" width="28" height="26.467" />
        </button>

        <div className="sample-book-modal__book" aria-live="polite">
          <img className="sample-book-modal__frame" src={bookFrame} alt="" aria-hidden="true" />
          <div className="sample-book-modal__paper" aria-hidden="true" />
          <PageLayer source={image} page={page} />
          {turningPage ? (
            <PageTurn source={SAMPLE_PAGES[turningPage.page]} direction={turningPage.direction} />
          ) : null}
          <img className="sample-book-modal__divider" src={bookDivider} alt="" aria-hidden="true" />
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
            className={`sample-book-modal__arrow sample-book-modal__arrow--next${isLastPage ? ' is-disabled' : ''}`}
            onClick={() => goToPage(page + 1)}
            disabled={isLastPage}
            aria-label="다음 페이지"
          >
            <img src={isLastPage ? arrowDisabled : arrowActive} alt="" width="19.527" height="29.161" />
          </button>
        </div>
      </section>
    </div>
  )
}
