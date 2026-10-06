import badge from '../assets/images/badge-cloud.webp'
import step1 from '../assets/images/step-1.webp'
import step2 from '../assets/images/step-2.webp'
import step3 from '../assets/images/step-3.webp'
import outlineA from '../assets/icons/outline-circle-a.svg'
import outlineB from '../assets/icons/outline-circle-b.svg'
import outlineC from '../assets/icons/outline-circle-c.svg'
import outlineTriangle from '../assets/icons/outline-triangle.svg'
import useSectionView from '../hooks/useSectionView'
import './Steps.css'

const STEPS = [
  {
    image: step1,
    alt: '노트북 앞에서 턱을 괴고 생각하는 부모',
    title: '아이가 겪은 일을 간단히 알려 주세요',
    desc: ['어떤 일이 있었는지, 아이가 어떻게 느꼈는지', '몇 가지 질문에 답하면 돼요'],
  },
  {
    image: step2,
    alt: '태블릿 속에 펼쳐진 공룡 동화책',
    title: '우리 아이 맞춤 동화가 만들어져요',
    desc: ['아이의 성향과 관심사를 AI가 반영해', '아이가 좋아할 캐릭터와 세계관으로 만들어요.'],
  },
  {
    image: step3,
    alt: '침대에서 부모와 아이가 태블릿으로 동화를 함께 읽는 모습',
    title: '동화를 함께 읽으며 대화를 시작해요',
    desc: ['이야기 흐름에 맞춘 대화 가이드를 따라', '어려웠던 이야기도 편하게 나눌 수 있어요.'],
  },
]

// 손그림 느낌의 배경 도형 (Figma 좌표, 1440 기준 / 섹션 시작 y=1727)
const DECOS = [
  { src: outlineA, box: 227, left: 1247, top: 475, inset: '-40.84% -122.54% -204.23% -122.54%', rotate: true },
  { src: outlineC, box: 309, left: -104, top: 154, inset: '-30.01% -90.02% -150.03% -90.02%', rotate: true },
  { src: outlineB, box: 97, left: 1377, top: 366, inset: '-95.59% -286.76% -477.93% -286.76%', rotate: true },
]

export default function Steps() {
  const sectionRef = useSectionView('process_section_view')

  return (
    <section className="steps" id="steps" ref={sectionRef}>
      <div className="steps__decos" aria-hidden="true">
        {DECOS.map((d) => (
          <div
            key={d.src}
            className="steps__deco"
            style={{ width: d.box, height: d.box, left: `calc(50% - 720px + ${d.left}px)`, top: d.top }}
          >
            <img src={d.src} alt="" style={{ inset: d.inset }} />
          </div>
        ))}
        <div className="steps__deco steps__deco--triangle" style={{ left: 'calc(50% - 720px + 50.297px)', top: 465.297 }}>
          <img src={outlineTriangle} alt="" />
        </div>
      </div>

      <div className="container">
        <h2 className="section-title">우리 아이 맞춤 동화, 이렇게 만들어져요</h2>
        <p className="steps__sub">몇 가지 정보만 알려주면, 우리 아이에게 꼭 맞는 이야기가 완성돼요</p>

        <ol className="steps__cards">
          {STEPS.map((step, i) => (
            <li className="step-card" key={step.title}>
              <div className="step-card__badge">
                <img src={badge} alt="" />
                <span>{i + 1}</span>
              </div>
              <img className="step-card__image" src={step.image} alt={step.alt} />
              <h3>{step.title}</h3>
              <p>
                {step.desc[0]}
                <br />
                {step.desc[1]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
