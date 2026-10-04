import { CTA_URL } from '../config'
import ctaBg from '../assets/images/cta-bg.webp'
import arrowCta from '../assets/icons/arrow-right-cta.svg'
import Button from './Button'
import './FinalCta.css'

export default function FinalCta() {
  return (
    <section className="cta" id="cta">
      <img className="cta__bg" src={ctaBg} alt="" aria-hidden="true" />

      <div className="cta__inner">
        <h2 className="section-title">우리 아이의 첫 이야기, 가장 먼저 만나보세요</h2>
        <p>지금 사전 예약하고, 출시 후 첫 맞춤 동화를 특별한 가격으로 만나보세요</p>
        <Button href={CTA_URL} variant="gradient" width={286} arrow={arrowCta}>
          내 아이 맞춤 동화 만들어보기
        </Button>
      </div>
    </section>
  )
}
