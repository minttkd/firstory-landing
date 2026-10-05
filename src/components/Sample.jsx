import { SAMPLE_BOOK_URL } from '../config'
import { useState } from 'react'
import bookCover from '../assets/images/book-cover.webp'
import guideCards from '../assets/images/guide-cards.webp'
import sectionArc from '../assets/icons/section-arc.svg'
import circleLg from '../assets/icons/circle-bg-lg.svg'
import circleSm from '../assets/icons/circle-bg-sm.svg'
import arrowSample from '../assets/icons/arrow-right-hero.svg'
import arrowGuide from '../assets/icons/arrow-right-guide.svg'
import Button from './Button'
import GuideModal from './GuideModal'
import SampleBookModal from './SampleBookModal'
import './Sample.css'

// 배경 원 (Figma 좌표, 1440 기준 / 섹션 시작 y=2485)
const CIRCLES = [
  { src: circleLg, size: 291, left: -142, top: 184 },
  { src: circleLg, size: 291, left: 1170, top: 149 },
  { src: circleSm, size: 95, left: 1232, top: 463 },
  { src: circleSm, size: 95, left: 176, top: 200 },
]

export default function Sample() {
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [isBookOpen, setIsBookOpen] = useState(false)

  return (
    <>
      <section className="sample" id="sample">
      <img className="sample__arc" src={sectionArc} alt="" aria-hidden="true" />
      {CIRCLES.map((c) => (
        <img
          key={`${c.left}-${c.top}`}
          className="sample__circle"
          src={c.src}
          alt=""
          aria-hidden="true"
          style={{ width: c.size, height: c.size, left: `calc(50% - 720px + ${c.left}px)`, top: c.top }}
        />
      ))}

      <div className="sample__inner">
        <h2 className="section-title sample__title">우리 아이를 위한 맞춤 동화를 미리 만나보세요</h2>

        <div className="sample__book">
          <img src={bookCover} alt="토리와 빨간 블록 동화책 표지" width="446" height="446" />
          <div className="sample__book-text">
            <h3 className="section-title">토리와 빨간 블록</h3>
            <p>
              친구와 장난감을 두고 다툰 토리가
              <br />
              자신의 마음과 친구의 마음을 알아가는 이야기
            </p>
            <Button
              href={SAMPLE_BOOK_URL}
              width={215}
              arrow={arrowSample}
              onClick={() => setIsBookOpen(true)}
            >
              샘플 동화책 읽어보기
            </Button>
          </div>
        </div>

        <div className="sample__guide">
          <div className="sample__guide-left">
            <span className="sample__pill">동화를 읽은 다음</span>
            <h3 className="sample__guide-title">동화 속 이야기로 아이와 대화를 이어가세요</h3>
            <img
              src={guideCards}
              alt="동화 속 장면별 질문과 대화 가이드 카드 미리보기"
              width="343"
              height="253"
            />
          </div>
          <div className="sample__guide-text">
            <p>
              동화 속 장면을 바탕으로 아이의 생각과 마음을 물어볼 수 있는
              <br />
              질문과 대화 가이드를 제공해요.
            </p>
            <Button variant="mint" width={208} arrow={arrowGuide} onClick={() => setIsGuideOpen(true)}>
              대화 가이드 더 보기
            </Button>
          </div>
        </div>
        </div>
      </section>
      <GuideModal key={isGuideOpen ? 'open' : 'closed'} isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <SampleBookModal
        key={isBookOpen ? 'open' : 'closed'}
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
      />
    </>
  )
}
