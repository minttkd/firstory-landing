import './HowItWorks.css'

const STEPS = [
  {
    title: '아이의 상황을 알려주세요',
    desc: '아이가 처음 겪었거나 앞으로 겪게 될 경험을 편하게 적어주세요.',
  },
  {
    title: 'AI가 몇 가지를 더 물어봐요',
    desc: '이야기의 맥락을 정확히 이해하기 위해 추가 질문을 건네요.',
  },
  {
    title: '이야기 방향을 확인하세요',
    desc: '아이와 비슷한 경험을 하는 별도의 캐릭터가 나오는 이야기의 방향을 부모님이 먼저 살펴봐요.',
  },
  {
    title: '함께 읽고 이야기 나눠요',
    desc: '동화 속 질문으로 등장인물의 상황과 감정을 자연스럽게 이야기해요.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">이용 방법</p>
          <h2 className="section-title">네 걸음이면, 우리 아이 동화가 완성돼요</h2>
        </div>

        <ol className="steps">
          {STEPS.map((step, i) => (
            <li key={step.title} className="step reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="step-no">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
