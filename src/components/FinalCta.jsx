import { CTA_LABEL, CTA_URL } from '../config'
import './FinalCta.css'

export default function FinalCta() {
  return (
    <section className="section final-cta" id="cta">
      <div className="container">
        <div className="cta-box reveal">
          <h2 className="section-title">다음 첫 경험은, 이야기로 시작해요</h2>
          <p className="section-desc">
            출시 알림을 신청하시면 FIRSTORY의 첫 동화를 가장 먼저 만나보실 수 있어요.
          </p>
          <a href={CTA_URL} className="btn btn-primary">
            {CTA_LABEL}
          </a>
        </div>
      </div>
    </section>
  )
}
