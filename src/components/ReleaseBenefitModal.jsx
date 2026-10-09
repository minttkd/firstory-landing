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
import { CONTACT_EMAIL, FEEDBACK_API_URL, SUBSCRIBE_API_URL } from '../config'
import { PRICE, PRICE_RESPONSE, trackEvent, trackEventOnce, trackMixpanel } from '../analytics'
import './ReleaseBenefitModal.css'

// 백엔드가 허용하는 값과 정확히 같아야 해요 (다른 문구를 보내면 422)
const FEEDBACK_RATINGS = ['비싸다', '적당하다', '저렴하다', '기타']

// "개인정보 수집·이용 동의" 보기 문구. 푸터처럼 [대괄호]로 적어 둔 문의처는 대괄호를 빼고 보여줘요.
const PRIVACY_CONTACT = CONTACT_EMAIL.replace(/[[\]]/g, '')
const PRIVACY_ITEMS = [
  ['수집 항목', '이메일 주소 (가격 의견을 선택한 경우 그 응답도 함께 저장돼요)'],
  ['수집·이용 목적', 'FIRSTORY 출시 안내와 할인 쿠폰 발송, 서비스 개선을 위한 가격 의견 분석'],
  ['보유·이용 기간', '목적을 달성하거나 동의 철회를 요청할 때까지'],
  ['동의 거부 권리', '동의를 거부할 수 있어요. 다만 거부하면 출시 안내와 할인 쿠폰을 받을 수 없어요.'],
  ['문의 및 철회', PRIVACY_CONTACT],
]

export default function ReleaseBenefitModal({ isOpen, onClose }) {
  const MODAL_CLOSE_DURATION = 320
  const FEEDBACK_CLOSE_DURATION = 220
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [submissionState, setSubmissionState] = useState('idle')
  const [submissionMessage, setSubmissionMessage] = useState('')
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isFeedbackClosing, setIsFeedbackClosing] = useState(false)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const feedbackCloseTimerRef = useRef(null)
  const modalCloseTimerRef = useRef(null)
  const feedbackSentEmailRef = useRef('') // 피드백 전송에 성공한 이메일 (같은 이메일로 중복 전송 방지)
  const feedbackPendingRef = useRef(false) // 전송 중 (빠르게 두 번 눌러도 한 번만)
  const emailSubmittedRef = useRef(false) // 이번 방문에서 이메일 제출에 성공했는지 (price_exit 판단용)
  const exitLoggedRef = useRef(false) // 팝업을 한 번 열 때 price_exit은 한 번만

  const isSubmitting = submissionState === 'submitting'

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
    if (isSubmitting) return

    // 이메일을 제출하지 않은 채 닫으면 가격 화면 이탈로 기록해요 (닫기 버튼, 바깥 클릭, Esc 모두)
    if (!emailSubmittedRef.current && !exitLoggedRef.current) {
      exitLoggedRef.current = true
      trackEvent('price_exit', { price: PRICE })
    }

    if (feedbackCloseTimerRef.current) {
      window.clearTimeout(feedbackCloseTimerRef.current)
      feedbackCloseTimerRef.current = null
    }
    setIsFeedbackClosing(false)
    setIsFeedbackOpen(true)
  }, [isSubmitting])

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

  // 가격 의견은 사전등록 여부와 관계없이 백엔드로 보내요.
  // 팝업은 바로 닫고 전송은 뒤에서 처리해요(keepalive로 창이 닫혀도 요청이 끝까지 가요). 실패하면 다음 선택 때 다시 시도해요.
  const sendFeedback = useCallback(
    (rating) => {
      const feedbackEmail = email.trim()

      if (feedbackEmail && feedbackSentEmailRef.current === feedbackEmail) return
      if (feedbackPendingRef.current) return

      feedbackPendingRef.current = true
      fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: feedbackEmail, rating }),
        keepalive: true,
      })
        .then((response) => {
          if (!response.ok) {
            console.warn(`가격 피드백 전송 실패 (${response.status})`)
            return
          }
          if (feedbackEmail) feedbackSentEmailRef.current = feedbackEmail
        })
        .catch(() => console.warn('가격 피드백 전송 중 네트워크 오류'))
        .finally(() => {
          feedbackPendingRef.current = false
        })
    },
    [email],
  )

  const handleFeedbackSelect = useCallback(
    (rating) => {
      trackEvent('price_survey_submit', { price_response: PRICE_RESPONSE[rating] })
      sendFeedback(rating)
      closeFeedback(true)
    },
    [closeFeedback, sendFeedback],
  )

  const resetSubmissionState = () => {
    if (submissionState === 'idle') return
    setSubmissionState('idle')
    setSubmissionMessage('')
  }

  useEffect(() => () => {
    if (feedbackCloseTimerRef.current) {
      window.clearTimeout(feedbackCloseTimerRef.current)
    }
    if (modalCloseTimerRef.current) {
      window.clearTimeout(modalCloseTimerRef.current)
    }
  }, [])

  // 가격이 보이는 신청 화면이 열릴 때: 방문당 한 번 price_view, 열 때마다 price_exit 기록 초기화
  useEffect(() => {
    if (!isOpen) return
    exitLoggedRef.current = false
    trackEventOnce('price_view', { price: PRICE })
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (isPrivacyOpen) setIsPrivacyOpen(false)
      else if (isFeedbackOpen) closeFeedback()
      else requestClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeFeedback, isFeedbackOpen, isOpen, isPrivacyOpen, requestClose])

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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSubmitting) return

    if (!isValidEmail || !consent) {
      setHasAttemptedSubmit(true)
      return
    }

    setHasAttemptedSubmit(false)
    setSubmissionState('submitting')
    setSubmissionMessage('사전등록 중입니다...')

    try {
      const response = await fetch(SUBSCRIBE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      })

      let data = null
      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (response.ok) {
        emailSubmittedRef.current = true
        trackEvent('email_submit', { price: PRICE })
        trackMixpanel('email_submitted')
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead')
        setSubmissionState('success')
        setSubmissionMessage('사전등록이 완료되었습니다!')
        return
      }

      if (response.status === 409) {
        setSubmissionState('duplicate')
        setSubmissionMessage(data?.detail || '이미 사전등록된 이메일입니다.')
        return
      }

      if (response.status === 422) {
        setSubmissionState('invalid')
        setSubmissionMessage('올바른 이메일 주소를 입력해주세요.')
        return
      }

      setSubmissionState('error')
      setSubmissionMessage('사전등록에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } catch {
      setSubmissionState('error')
      setSubmissionMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
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
              className="mp-mask"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                resetSubmissionState()
              }}
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
                  onChange={(event) => {
                    setConsent(event.target.checked)
                    resetSubmissionState()
                  }}
                />
                <span className="release-benefit-modal__checkbox" aria-hidden="true" />
                <span>[필수] 개인정보 수집·이용 동의</span>
              </label>
              <button type="button" className="release-benefit-modal__view" onClick={() => setIsPrivacyOpen(true)}>
                보기
              </button>
            </div>
            {consentError && (
              <p className="release-benefit-modal__error release-benefit-modal__consent-error" role="alert">
                {consentError}
              </p>
            )}
            <button
              type="submit"
              className="release-benefit-modal__submit"
              disabled={isSubmitting || submissionState === 'success'}
            >
              {isSubmitting ? '사전등록 중...' : submissionState === 'success' ? '사전등록 완료' : '이 가격으로 예약할게요'}
            </button>
            {submissionMessage && (
              <p
                className={`release-benefit-modal__status release-benefit-modal__status--${submissionState}`}
                role={submissionState === 'error' || submissionState === 'duplicate' || submissionState === 'invalid' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {submissionMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      {isPrivacyOpen && (
        <div
          className="release-privacy-overlay"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setIsPrivacyOpen(false)}
        >
          <section className="release-privacy-modal" role="dialog" aria-modal="true" aria-labelledby="release-privacy-title">
            <h2 id="release-privacy-title">개인정보 수집 및 이용 동의</h2>
            <dl className="release-privacy-modal__list">
              {PRIVACY_ITEMS.map(([term, description]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
            <button type="button" className="release-privacy-modal__confirm" onClick={() => setIsPrivacyOpen(false)} autoFocus>
              확인
            </button>
          </section>
        </div>
      )}

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
              {FEEDBACK_RATINGS.map((option) => (
                <button type="button" key={option} onClick={() => handleFeedbackSelect(option)}>
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
