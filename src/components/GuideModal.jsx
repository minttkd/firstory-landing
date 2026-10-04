import { useCallback, useEffect, useRef, useState } from 'react'
import iconClose from '../assets/icons/icon-close.svg'
import iconSprite from '../assets/images/guide-icons/node-image154.png'
import './GuideModal.css'

const GUIDE_ITEMS = [
  {
    title: '이 동화로 이런 이야기를 나눠보세요',
    summary: '내 마음과 친구의 마음이 다를 수 있다는 점을 이야기해요.',
    detail: [
      '토리의 이야기를 따라가며 친구와 함께 있을 때 느끼는 마음과 그 마음을 표현하는 방법에 대해 이야기해보세요.',
      '아이가 자신의 생각을 말로 표현하는 데 시간이 필요한 편이라면, 바로 아이의 경험을 묻기보다 토리의 마음을 먼저 이야기하며 천천히 대화를 시작해보세요.',
    ],
    icon: 'speech',
  },
  {
    title: '질문 1 활용 가이드',
    summary: '“토리는 어떤 기분이었을까요?”',
    detail: [
      '아이가 바로 감정을 말하기 어려워한다면 답을 재촉하기보다 토리의 표정이나 당시 장면을 함께 다시 살펴보세요.',
      '“토리 표정은 어때 보여?”처럼 쉽게 답할 수 있는 이야기부터 시작해도 좋아요. 아이가 “속상했어”처럼 짧게 답했다면, “어떤 부분에서 그렇게 느꼈어?”라고 이어가며 아이가 자기 속도로 생각을 표현할 수 있도록 기다려주세요.',
    ],
    icon: 'book',
  },
  {
    title: '질문 2 활용 가이드',
    summary: '“다음 날, 토리는 어떻게 했을까요?”',
    detail: [
      '아이가 먼저 이야기를 만들어내기 어려워한다면 곧바로 답을 요구하기보다 토리가 할 수 있는 행동을 함께 상상해보세요.',
      '“친구에게 먼저 말을 걸었을까?”, “옆에서 같이 놀았을까?”처럼 이야기의 실마리를 주고, 아이가 하나를 고르거나 다른 생각을 말하면 “왜 토리가 그렇게 했을 것 같아?”라고 자연스럽게 이어가보세요.',
    ],
    icon: 'book',
  },
  {
    title: '우리 아이와 이야기할 때',
    summary: '정답보다 아이가 왜 그렇게 생각했는지 들어주세요.',
    detail: [
      '아이가 낯을 가리고 자신의 생각을 말로 표현하는 데 시간이 필요한 편이라면 질문에 바로 답하지 않아도 괜찮아요.',
      '아이에게 직접 “너는 어땠어?”라고 묻기보다 토리의 마음 → 토리의 행동 → 아이의 생각 순서로 천천히 대화를 넓혀보세요.',
      '짧은 대답에도 충분히 반응해주면 아이가 부담 없이 다음 이야기를 이어가기 좋아요.',
    ],
    icon: 'bulb',
  },
]

function GuideIcon({ type }) {
  return (
    <span className={`guide-modal__icon guide-modal__icon--${type}`} aria-hidden="true">
      <img src={iconSprite} alt="" />
    </span>
  )
}

export default function GuideModal({ isOpen, onClose }) {
  const [openIndexes, setOpenIndexes] = useState([])
  const [isClosing, setIsClosing] = useState(false)
  const closeTimerRef = useRef(null)
  const closingRef = useRef(false)

  const handleClose = useCallback(() => {
    if (closingRef.current) return

    closingRef.current = true
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(onClose, 220)
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    closingRef.current = false

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') handleClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(closeTimerRef.current)
    }
  }, [handleClose, isOpen])

  if (!isOpen) return null

  return (
    <div
      className={`guide-modal-overlay${isClosing ? ' is-closing' : ''}`}
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && handleClose()}
    >
      <section
        className={`guide-modal${openIndexes.length > 0 ? ' is-scrollable' : ''}${isClosing ? ' is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
      >
        <button type="button" className="guide-modal__close" onClick={handleClose} aria-label="대화 가이드 닫기">
          <img src={iconClose} alt="" width="28" height="28" />
        </button>

        <div className="guide-modal__scroll">
          <h2 id="guide-modal-title">이 동화로 나눌 수 있는 대화 보기</h2>
          <p className="guide-modal__notice">※ 해당 가이드는 예시 자료입니다</p>

          <div className="guide-modal__list">
            {GUIDE_ITEMS.map((item, index) => {
              const isOpenItem = openIndexes.includes(index)
              return (
                <article className={`guide-modal__item${isOpenItem ? ' is-open' : ''}`} key={item.title}>
                  <button
                    type="button"
                    className="guide-modal__trigger"
                    aria-expanded={isOpenItem}
                    onClick={() =>
                      setOpenIndexes((current) =>
                        isOpenItem ? current.filter((openIndex) => openIndex !== index) : [...current, index],
                      )
                    }
                  >
                    <GuideIcon type={item.icon} />
                    <span className="guide-modal__copy">
                      <strong>{item.title}</strong>
                      <span className="guide-modal__summary">{item.summary}</span>
                    </span>
                    <span className="guide-modal__toggle" aria-hidden="true">
                      <span className="guide-modal__toggle-icon" />
                    </span>
                  </button>

                  <div className="guide-modal__detail" aria-hidden={!isOpenItem}>
                    <div className="guide-modal__detail-inner">
                      {item.detail.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
