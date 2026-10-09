import { useState } from 'react'
import ctaBg from '../assets/images/cta-bg.webp'
import arrowCta from '../assets/icons/arrow-right-cta.svg'
import Button from './Button'
import useSectionView from '../hooks/useSectionView'
import { getBenefitEntryMethod, trackEvent } from '../analytics'
import ReleaseBenefitModal from './ReleaseBenefitModal'
import './FinalCta.css'

export default function FinalCta() {
  const [isBenefitOpen, setIsBenefitOpen] = useState(false)
  const sectionRef = useSectionView('benefit_section_view', () => ({ entry_method: getBenefitEntryMethod() }), 'bottom_cta')

  const openBenefit = () => {
    trackEvent('launch_cta_click', { cta_location: 'benefit' })
    setIsBenefitOpen(true)
  }

  return (
    <>
      <section className="cta" id="cta" ref={sectionRef}>
        <img className="cta__bg" src={ctaBg} alt="" aria-hidden="true" />

        <div className="cta__inner">
          <h2 className="section-title">우리 아이의 첫 이야기를 가장 먼저 만나보세요</h2>
          <p>출시 3일 전, FIRSTORY 소식과 할인 쿠폰을 이메일로 보내드려요.</p>
          <Button variant="gradient" width={255} arrow={arrowCta} onClick={openBenefit}>
            FIRSTORY 출시 혜택 받기
          </Button>
        </div>
      </section>

      <ReleaseBenefitModal isOpen={isBenefitOpen} onClose={() => setIsBenefitOpen(false)} />
    </>
  )
}
