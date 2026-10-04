import './Pledge.css'

const PLEDGES = [
  {
    emoji: '🪞',
    title: '우리 아이가 아닌, 닮은 친구의 이야기',
    desc: '아이와 비슷한 경험을 하는 별도의 캐릭터가 등장해요. 아이를 직접 지목하지 않아서 더 편하게 이야기할 수 있어요.',
  },
  {
    emoji: '🗣️',
    title: '정답 대신 질문',
    desc: '가르치려 하지 않아요. 아이가 스스로 생각하고 말해볼 수 있는 질문으로 부모와 아이의 대화를 이어줘요.',
  },
  {
    emoji: '🧭',
    title: '방향은 부모님이 정해요',
    desc: '동화가 만들어지기 전에 이야기의 방향을 확인할 수 있어요. 전하고 싶은 마음을 직접 담아보세요.',
  },
]

export default function Pledge() {
  return (
    <section className="section pledge">
      <div className="container">
        <div className="section-head center reveal">
          <p className="eyebrow">FIRSTORY의 약속</p>
          <h2 className="section-title">아이의 마음을 대신 말해주지 않아요</h2>
        </div>

        <ul className="pledge-list">
          {PLEDGES.map((p, i) => (
            <li key={p.title} className="pledge-card reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="pledge-emoji" aria-hidden="true">
                {p.emoji}
              </span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

