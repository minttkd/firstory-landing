import './Problem.css'

const MOMENTS = [
  {
    emoji: '🎒',
    color: 'var(--mint)',
    quote: '내일 처음 유치원 가는데, 어떻게 설명해줘야 할까?',
  },
  {
    emoji: '👶',
    color: 'var(--sky)',
    quote: '동생이 생긴다는 걸 아이는 어떻게 받아들일까?',
  },
  {
    emoji: '🧩',
    color: 'var(--lilac)',
    quote: '친구랑 다툰 날, 아이 마음이 궁금한데 말을 잘 안 해요.',
  },
  {
    emoji: '📚',
    color: 'var(--yellow)',
    quote: '우리 아이 상황에 딱 맞는 동화책은 어디 있지?',
  },
]

export default function Problem() {
  return (
    <section className="section" id="problem">
      <div className="container">
        <div className="section-head center reveal">
          <p className="eyebrow">이런 순간, 있으셨나요?</p>
          <h2 className="section-title">아이의 첫 경험 앞에서, 부모도 처음이니까요</h2>
          <p className="section-desc">
            낯선 일을 앞둔 아이에게 어떤 말을 건네야 할지, 지나고 난 뒤 아이의 마음은 어땠는지.
            <br />
            FIRSTORY는 정답을 알려주는 대신 이야기를 나눌 계기를 만들어요.
          </p>
        </div>

        <ul className="moments">
          {MOMENTS.map((m, i) => (
            <li
              key={m.quote}
              className="moment reveal"
              style={{ '--tone': m.color, transitionDelay: `${i * 80}ms` }}
            >
              <span className="moment-emoji" aria-hidden="true">
                {m.emoji}
              </span>
              <p>“{m.quote}”</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
