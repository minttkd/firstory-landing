import { CTA_LABEL, CTA_URL } from '../config'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">4~6세 부모님을 위한 AI 맞춤 동화</p>
          <h1>
            아이의 <em>첫 경험</em>이,
            <br />
            한 편의 동화가 됩니다
          </h1>
          <p className="hero-desc">
            처음 가는 유치원, 새로 생기는 동생, 친구와의 다툼.
            <br />
            낯선 순간을 아이와 닮은 친구의 이야기로 만들고, 함께 읽으며 대화를 시작해보세요.
          </p>
          <div className="hero-actions">
            <a href={CTA_URL} className="btn btn-primary">
              {CTA_LABEL}
            </a>
            <a href="#how" className="btn btn-ghost">
              어떻게 만들어지나요?
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="book">
            <div className="book-page left">
              <span className="book-emoji">🐻</span>
              <p>토리는 내일 처음으로 유치원에 가요.</p>
            </div>
            <div className="book-page right">
              <span className="book-emoji">🏫</span>
              <p>가슴이 콩닥콩닥, 토리의 마음은 어땠을까요?</p>
            </div>
          </div>
          <div className="bubble bubble-a">토리는 어떤 기분일까?</div>
          <div className="bubble bubble-b">나도 조금 떨렸어!</div>
          <span className="star star-a">✦</span>
          <span className="star star-b">✧</span>
        </div>
      </div>
    </section>
  )
}
