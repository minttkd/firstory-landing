import { useCallback, useEffect, useRef, useState } from 'react'
import modalShape from '../assets/figma/release-benefit/modal-shape.svg'
import line from '../assets/figma/release-benefit/deco-1.svg'
import closeCircle from '../assets/figma/release-benefit/deco-2.svg'
import glowLargeLeft from '../assets/figma/release-benefit/line.svg'
import glowLargeBottom from '../assets/figma/release-benefit/deco-3.svg'
import glowCenterSmall from '../assets/figma/release-benefit/deco-7.svg'
import closeIcon from '../assets/figma/release-benefit/deco-5.svg'
import glowSmall from '../assets/figma/release-benefit/deco-6.svg'
import glowFarRight from '../assets/figma/release-benefit/deco-4.svg'
import './ReleaseBenefitModal.css'

export default function ReleaseBenefitModal({ isOpen, onClose }) {
  const MODAL_CLOSE_DURATION = 320
  const FEEDBACK_CLOSE_DURATION = 220
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isFeedbackClosing, setIsFeedbackClosing] = useState(false)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const feedbackCloseTimerRef = useRef(null)
  const modalCloseTimerRef = useRef(null)

  useEffect(() => {
    const preloadModalAssets = () => {
      const image = new Image()
      image.decoding = 'async'
      image.src = modalShape

      if (document.fonts?.load) {
        document.fonts.load("400 42px 'MemomentKkukkukkFull'")
      }
    }

    let idleHandle
    let usesIdleCallback = false

    if ('requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(preloadModalAssets, { timeout: 1200 })
      usesIdleCallback = true
    } else {
      idleHandle = window.setTimeout(preloadModalAssets, 700)
    }

    return () => {
      if (usesIdleCallback) window.cancelIdleCallback(idleHandle)
      else window.clearTimeout(idleHandle)
    }
  }, [])

  const requestClose = useCallback(() => {
    if (feedbackCloseTimerRef.current) {
      window.clearTimeout(feedbackCloseTimerRef.current)
      feedbackCloseTimerRef.current = null
    }
    setIsFeedbackClosing(false)
    setIsFeedbackOpen(true)
  }, [])

  const closePopup = useCallback(() => {
    if (isModalClosing) return

    setIsModalClosing(true)
    modalCloseTimerRef.current = window.setTimeout(() => {
      setIsModalClosing(false)
      modalCloseTimerRef.current = null
      onClose()
    }, MODAL_CLOSE_DURATION)
  }, [isModalClosing, onClose])

  const closeFeedback = useCallback((closeParent = false) => {
    if (isFeedbackClosing) return

    setIsFeedbackClosing(true)
    if (closeParent) closePopup()
    feedbackCloseTimerRef.current = window.setTimeout(() => {
      setIsFeedbackOpen(false)
      setIsFeedbackClosing(false)
      feedbackCloseTimerRef.current = null

      if (closeParent) setHasAttemptedSubmit(false)
    }, FEEDBACK_CLOSE_DURATION)
  }, [closePopup, isFeedbackClosing])

  const handleFeedbackSelect = useCallback(() => closeFeedback(true), [closeFeedback])

  useEffect(() => () => {
    if (feedbackCloseTimerRef.current) {
      window.clearTimeout(feedbackCloseTimerRef.current)
    }
    if (modalCloseTimerRef.current) {
      window.clearTimeout(modalCloseTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (isFeedbackOpen) closeFeedback()
      else requestClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeFeedback, isFeedbackOpen, isOpen, requestClose])

  if (!isOpen) return null

  const isValidEmail = /\S+@\S+\.\S+/.test(email)
  const emailError = hasAttemptedSubmit
    ? isValidEmail
      ? ''
      : email.trim()
        ? '올바른 이메일 주소를 입력해주세요.'
        : '이메일을 입력해주세요.'
    : ''
  const consentError = hasAttemptedSubmit && !consent ? '개인정보 수집·이용에 동의해주세요.' : ''

  const handleSubmit = (event) => {
    event.preventDefault()

    if (isValidEmail && consent) {
      setHasAttemptedSubmit(false)
      closePopup()
      return
    }

    setHasAttemptedSubmit(true)
  }

  const decoration = (className, src, alt = '') => (
    <div className={`release-benefit__deco ${className}`} aria-hidden="true">
      <div className="release-benefit__deco-inner">
        <div className="release-benefit__deco-frame">
          <img src={src} alt={alt} />
        </div>
      </div>
      <span className="release-benefit__deco-outline" />
    </div>
  )

  return (
    <div
      className={`release-benefit-overlay${isModalClosing ? ' release-benefit-overlay--closing' : ''}`}
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && requestClose()}
    >
      <div className="release-benefit__decorations" aria-hidden="true">
        {decoration('release-benefit__deco--left', glowLargeLeft)}
        {decoration('release-benefit__deco--left-small', glowSmall)}
        {decoration('release-benefit__deco--bottom', glowLargeBottom)}
        {decoration('release-benefit__deco--right', glowCenterSmall)}
        {decoration('release-benefit__deco--mid-right', glowFarRight)}
      </div>

      <section
        className={`release-benefit-modal${isModalClosing ? ' release-benefit-modal--closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="release-benefit-title"
      >
        <img className="release-benefit-modal__shape" src={modalShape} alt="" aria-hidden="true" decoding="async" />
        <img className="release-benefit-modal__line" src={line} alt="" aria-hidden="true" decoding="async" />

        <button type="button" className="release-benefit-modal__close" onClick={requestClose} aria-label="닫기">
          <img src={closeCircle} alt="" aria-hidden="true" />
          <img src={closeIcon} alt="" aria-hidden="true" />
        </button>

        <div className="release-benefit-modal__content">
          <div className="release-benefit-modal__offer">
            <p className="release-benefit-modal__brand">FIRSTORY</p>
            <h2 id="release-benefit-title">서비스 출시 알림 받고,<br />20% 할인 쿠폰 받을래요</h2>
            <p className="release-benefit-modal__item">맞춤 동화 4권 (8페이지 디지털북 + 대화 가이드)</p>
            <div className="release-benefit-modal__price">
              <del>정가 16,500원</del>
              <strong>20% 13,200원</strong>
            </div>
            <p className="release-benefit-modal__note">이메일 입력자 전용 · 출시 시 쿠폰으로 적용</p>
          </div>

          <form
            className="release-benefit-modal__form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="release-benefit-email">쿠폰 받을 이메일</label>
            <input
              id="release-benefit-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@gmail.com"
              autoComplete="email"
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'release-benefit-email-error' : undefined}
            />
            {emailError && (
              <p id="release-benefit-email-error" className="release-benefit-modal__error" role="alert">
                {emailError}
              </p>
            )}
            <div className="release-benefit-modal__consent-row">
              <label className="release-benefit-modal__consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
                <span className="release-benefit-modal__checkbox" aria-hidden="true" />
                <span>[필수] 개인정보 수집·이용 동의</span>
              </label>
              <button type="button" className="release-benefit-modal__view">보기</button>
            </div>
            {consentError && (
              <p className="release-benefit-modal__error release-benefit-modal__consent-error" role="alert">
                {consentError}
              </p>
            )}
            <button
              type="submit"
              className="release-benefit-modal__submit"
            >
              이 가격으로 예약할게요
            </button>
          </form>
        </div>
      </section>

      {isFeedbackOpen && (
        <div
          className={`release-feedback-overlay${isFeedbackClosing ? ' release-feedback-overlay--closing' : ''}`}
          role="presentation"
        >
          <section
            className={`release-feedback-modal${isFeedbackClosing ? ' release-feedback-modal--closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="release-feedback-title"
          >
            <h2 id="release-feedback-title">가격이 어떻게 느껴지셨나요?</h2>
            <p>더 좋은 서비스를 위해 의견을 들려주세요</p>
            <div className="release-feedback-modal__options">
              {['비싸다', '적당하다', '저렴하다', '기타'].map((option) => (
                <button type="button" key={option} onClick={handleFeedbackSelect}>
                  {option}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
