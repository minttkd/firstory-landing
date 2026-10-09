import { useState } from 'react'
import faqWave from '../assets/icons/faq-wave.svg'
import toggleOpen from '../assets/icons/toggle-open.svg'
import toggleClosed from '../assets/icons/toggle-closed.svg'
import iconClose from '../assets/icons/icon-close.svg'
import iconPlus from '../assets/icons/icon-plus.svg'
import useSectionView from '../hooks/useSectionView'
import { trackEvent, trackMixpanel } from '../analytics'
import './Faq.css'

// answer 배열의 각 항목은 줄바꿈(<br />)으로 구분돼요.
const FAQS = [
  {
    id: 'personalization',
    question: '우리 아이의 상황은 동화에 어떻게 반영되나요?',
    answer: [
      '부모가 알려준 아이의 경험과 감정, 성향과 관심사를 AI가 분석해요.',
      '이를 바탕으로 실제 상황은 자연스럽게 반영하고, 아이가 좋아할 캐릭터와 세계관을 담아 동화를 만들어요.',
    ],
  },
  {
    id: 'child_data',
    question: '아이 정보는 어떻게 사용되고 보관되나요?',
    answer: ['입력한 정보는 맞춤 동화를 만드는 데 필요한 범위에서만 사용되며, 개인정보 처리 기준에 따라 안전하게 관리돼요.'],
  },
  {
    id: 'conversation_guide',
    question: '동화를 활용한 아이와의 대화 가이드는 어떻게 제공되나요?',
    answer: [
      '완성된 동화와 함께 이야기의 주제와 대화 포인트를 한눈에 볼 수 있는 가이드를 제공해요.',
      '동화 속에 담긴 두 가지 질문을 언제, 어떤 방식으로 활용하면 좋은지 구체적인 설명도 함께 확인할 수 있어요.',
    ],
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  const sectionRef = useSectionView('faq_section_view', undefined, 'faq')

  return (
    <section className="faq" id="faq" ref={sectionRef}>
      <img className="faq__wave" src={faqWave} alt="" aria-hidden="true" />

      <div className="container faq__inner">
        <h2 className="section-title">자주 묻는 질문</h2>

        <ul className="faq__list">
          {FAQS.map((item, i) => {
            const open = openIndex === i
            return (
              <li key={item.question} className={`faq__item${open ? ' is-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    className="faq__question"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => {
                      if (!open) {
                        trackEvent('faq_click', { faq_id: item.id })
                        trackMixpanel('faq_opened', { faq_id: `faq_${String(i + 1).padStart(2, '0')}` })
                      }
                      setOpenIndex(open ? -1 : i)
                    }}
                  >
                    <span>{item.question}</span>
                    <span className="faq__toggle" aria-hidden="true">
                      <img src={open ? toggleOpen : toggleClosed} alt="" width="62" height="62" />
                      <img
                        className="faq__icon"
                        src={open ? iconClose : iconPlus}
                        alt=""
                        width={open ? 14 : 17}
                        height={open ? 14 : 17}
                      />
                    </span>
                  </button>
                </h3>
                <div className="faq__panel" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`}>
                  <div className="faq__panel-inner">
                    <p>
                      {item.answer.map((line, idx) => (
                        <span key={line}>
                          {idx > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
