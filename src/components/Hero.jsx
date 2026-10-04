import heroBg from '../assets/images/hero-bg.png'
import chevronDown from '../assets/icons/chevron-down.svg'
import arrowRight from '../assets/icons/arrow-right-hero.svg'
import Button from './Button'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero__bg" src={heroBg} alt="" />

      <div className="container hero__inner">
        <p className="hero__logo">FIRSTORY</p>

        <p className="hero__badge">우리 아이의 이야기를 담은 AI 맞춤 동화</p>
        <h1 className="hero__title">
          아이에게 말하기 어려운 순간,
          <br />
          맞춤 동화로 시작하세요.
        </h1>
        <p className="hero__desc">어려웠던 이야기도 아이의 눈높이에서 자연스럽게 나눌 수 있어요.</p>
        <Button href="#sample" width={255} arrow={arrowRight}>
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
