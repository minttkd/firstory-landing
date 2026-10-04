import { useCallback, useEffect, useState } from 'react'
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
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  const handleClose = useCallback(() => {
    setHasAttemptedSubmit(false)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') handleClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClose, isOpen])

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
      className="release-benefit-overlay"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && handleClose()}
    >
      <div className="release-benefit__decorations" aria-hidden="true">
        {decoration('release-benefit__deco--left', glowLargeLeft)}
        {decoration('release-benefit__deco--left-small', glowSmall)}
        {decoration('release-benefit__deco--bottom', glowLargeBottom)}
        {decoration('release-benefit__deco--right', glowCenterSmall)}
        {decoration('release-benefit__deco--mid-right', glowFarRight)}
      </div>

      <section
        className="release-benefit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="release-benefit-title"
      >
        <img className="release-benefit-modal__shape" src={modalShape} alt="" aria-hidden="true" />
        <img className="release-benefit-modal__line" src={line} alt="" aria-hidden="true" />

        <button type="button" className="release-benefit-modal__close" onClick={handleClose} aria-label="닫기">
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
    </div>
  )
}
