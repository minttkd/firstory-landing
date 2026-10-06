import heroBg from '../assets/images/hero-bg.webp'
import chevronDown from '../assets/icons/chevron-down.svg'
import arrowRight from '../assets/icons/arrow-right-hero.svg'
import Button from './Button'
import { setBenefitEntryMethod, trackEvent } from '../analytics'
import './Hero.css'

// 출시 혜택 영역으로 바로 이동해요. 중간 섹션을 스치며 "노출"로 잡히지 않도록 부드러운 스크롤 없이 한 번에 이동해요.
function handleCtaClick(event) {
  trackEvent('hero_cta_click', { destination: 'benefit' })
  setBenefitEntryMethod('hero_cta')

  const target = document.getElementById('cta')
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: 'instant', block: 'start' })
  window.history.replaceState(null, '', '#cta')
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__bg-wrap" aria-hidden="true">
        <img className="hero__bg" src={heroBg} alt="" />
      </div>

      <div className="container hero__inner">
        <p className="hero__logo">FIRSTORY</p>

        <p className="hero__badge">우리 아이의 이야기를 담은 AI 맞춤 동화</p>
        <h1 className="hero__title">
          아이에게 말하기 어려운 순간,
          <br />
          맞춤 동화로 시작하세요.
        </h1>
        <p className="hero__desc">어려웠던 이야기도 아이의 눈높이에서 자연스럽게 나눌 수 있어요.</p>
        <Button href="#cta" width={255} arrow={arrowRight} onClick={handleCtaClick}>
          FIRSTORY 미리 만나보기
        </Button>
      </div>

      <a className="hero__scroll" href="#problem">
        <span>아래로 내려 더보기</span>
        <img src={chevronDown} alt="" width="14" height="6" />
      </a>
    </section>
  )
}
