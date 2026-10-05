import { useCallback, useEffect, useState } from 'react'
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

export default function SampleBookModal({ isOpen, onClose }) {
  const [page, setPage] = useState(0)

  const close = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') setPage((current) => Math.max(0, current - 1))
      if (event.key === 'ArrowRight') setPage((current) => Math.min(SAMPLE_PAGES.length - 1, current + 1))
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, isOpen])

  if (!isOpen) return null

  const image = SAMPLE_PAGES[page]
  const isFirstPage = page === 0
  const isLastPage = page === SAMPLE_PAGES.length - 1

  return (
    <div
      className="sample-book-modal-overlay"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <section
        className="sample-book-modal"
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
          {image ? (
            <img src={image} alt={`${page + 1}페이지 동화`} />
          ) : (
            <div className="sample-book-modal__placeholder">
              <span>{page + 1}페이지 이미지 준비 중</span>
            </div>
          )}
          <img className="sample-book-modal__divider" src={bookDivider} alt="" aria-hidden="true" />
        </div>

        <div className="sample-book-modal__pagination" aria-label="동화책 페이지 이동">
          <button
            type="button"
            className={`sample-book-modal__arrow sample-book-modal__arrow--prev${isFirstPage ? ' is-disabled' : ''}`}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
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
            onClick={() => setPage((current) => Math.min(SAMPLE_PAGES.length - 1, current + 1))}
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
