import './Faq.css'

const FAQS = [
  {
    q: '몇 살 아이를 위한 서비스인가요?',
    a: '4~6세 자녀를 둔 부모님을 위해 만들고 있어요. 아이가 처음 겪는 일이 많은 시기에 맞춰 이야기를 설계해요.',
  },
  {
    q: '동화는 어떻게 만들어지나요?',
    a: '부모님이 아이의 상황을 입력하면 AI가 몇 가지 추가 질문으로 맥락을 파악하고, 아이와 비슷한 경험을 하는 캐릭터가 나오는 동화를 만들어요. 이야기의 방향을 확인한 뒤 완성된 동화를 아이와 함께 읽을 수 있어요.',
  },
  {
    q: '아이의 이름이나 개인정보를 꼭 입력해야 하나요?',
    a: '동화 속에는 아이와 비슷한 상황을 겪는 별도의 캐릭터가 등장해요. 아이를 직접 드러내지 않고도 이야기를 만들 수 있도록 설계하고 있어요.',
  },
  {
    q: '언제부터 이용할 수 있나요?',
    a: '지금은 서비스를 준비하고 있어요. 출시 알림을 신청해주시면 가장 먼저 소식을 전해드릴게요.',
  },
]

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="container faq-inner">
        <div className="section-head reveal">
          <p className="eyebrow">자주 묻는 질문</p>
          <h2 className="section-title">궁금한 점이 있으신가요?</h2>
        </div>

        <div className="faq-list reveal">
          {FAQS.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
