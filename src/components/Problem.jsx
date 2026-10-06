import useFitScale from '../hooks/useFitScale'
import useSectionView from '../hooks/useSectionView'
import glowLarge from '../assets/icons/glow-large.svg'
import glowSmall from '../assets/icons/glow-small.svg'
import thinking from '../assets/images/problem-thinking.webp'
import barFlip from '../assets/images/bar-flip.webp'
import barB from '../assets/images/bar-b.webp'
import barC from '../assets/images/bar-c.webp'
import noteCoral1 from '../assets/images/note-coral-1.webp'
import noteCoral2 from '../assets/images/note-coral-2.webp'
import noteWhite1 from '../assets/images/note-white-1.webp'
import noteWhite2 from '../assets/images/note-white-2.webp'
import characters from '../assets/images/characters.webp'
import './Problem.css'

// 데스크톱: Figma 프레임 좌표 그대로(1440px), 스테이지 시작 y = 1040
const DESKTOP = { width: 1440, height: 687, ORIGIN: { x: 0, y: -1040 } }

// 모바일: 같은 말풍선 묶음을 세로로 쌓은 560px 스테이지 (화면 폭에 맞춰 축소)
// 각 묶음은 Figma 좌표의 "기준점"을 모바일 스테이지의 목표 위치로 옮기는 오프셋이에요.
const MOBILE = {
  width: 560,
  height: 1180,
  baby: { x: -181, y: -1095 }, // 말풍선 중심 (461, 1210) -> (280, 115)
  friend: { x: -749, y: -952 }, // 말풍선 중심 (1029, 1297) -> (280, 345)
  kinder: { x: -51.2, y: -870.9 }, // 말풍선 중심 (331, 1446) -> (280, 575)
  puppy: { x: -829.5, y: -712 }, // 말풍선 중심 (1109.5, 1512) -> (280, 800)
  mother: { x: -440, y: -472 }, // 그림 왼쪽 위 (559, 1352) -> (119, 880)
}

const QUOTES = [
  '동생이 태어난다는 걸 어떻게 설명해야 할까요?',
  '처음 유치원 가는 날, 겁먹은 아이에게 무슨 말을 해줄까요?',
  '친구랑 싸우고 온 날, 뭐라고 해줘야 할지 몰랐어요',
  '키우던 강아지가 세상을 떠났을 때, 어떻게 위로할까요?',
]

// "동생이 태어난다는 걸…" 묶음: Figma 프레임 밖(캔버스 x≈6474, y≈2146)에 따로 있던 4개 요소를
// 서로의 상대 배치를 유지한 채, 유치원 말풍선이 원래 있던 왼쪽 위 자리(말풍선 중심 461, 1210)에 맞춰 옮겼어요.
// 디자이너가 프레임 안에 위치를 확정하면 BabyCluster의 좌표만 바꿔주세요.

// 중심 좌표(cx, cy)와 크기로 배치하고 중심 기준으로 회전/기울여요. (o = 묶음을 옮기는 오프셋)
function Placed({ o, cx, cy, w, h, rotate = 0, skewX = 0, flipY = false, className = '', children }) {
  const transform = `rotate(${rotate}deg)${skewX ? ` skewX(${skewX}deg)` : ''}${flipY ? ' scaleY(-1)' : ''}`
  return (
    <div
      className={`stage__item ${className}`}
      style={{ left: cx + o.x - w / 2, top: cy + o.y - h / 2, width: w, height: h, transform }}
    >
      {children}
    </div>
  )
}

// 좌상단(left, top) 좌표로 배치
function Box({ o, left, top, w, h, className = '', children }) {
  return (
    <div className={`stage__item ${className}`} style={{ left: left + o.x, top: top + o.y, width: w, height: h }}>
      {children}
    </div>
  )
}

// characters.webp 스프라이트에서 한 캐릭터만 잘라 보여줘요.
function Sprite({ crop }) {
  return (
    <div className="sprite">
      <img src={characters} alt="" style={crop} />
    </div>
  )
}

function Mother({ o }) {
  return (
    <Box o={o} left={559} top={1352} w={322} h={288} className="stage__crop">
      <img src={thinking} alt="" style={{ height: '100%', left: '-22.53%', top: 0, width: '134.34%' }} />
    </Box>
  )
}

// 동생 묶음: 장식 띠 → 말풍선 → 문구 → 아기 스티커
function BabyCluster({ o }) {
  return (
    <>
      <Placed o={o} cx={435.34} cy={1158.77} w={362.434} h={91.339} rotate={178.5} flipY>
        <img src={barFlip} alt="" />
      </Placed>
      <Placed o={o} cx={461} cy={1210} w={483} h={72.949} rotate={-2.95}>
        <img src={noteCoral2} alt="" />
      </Placed>
      <Placed
        o={o}
        cx={460.14}
        cy={1203.01}
        w={384}
        h={32.17}
        rotate={-2.65}
        className="stage__text stage__text--light"
      >
        {QUOTES[0]}
      </Placed>
      <Placed o={o} cx={281.176} cy={1144.474} w={97.65} h={97.65}>
        <Sprite crop={{ height: '235.39%', left: '-199.38%', top: '-122.94%', width: '353.09%' }} />
      </Placed>
    </>
  )
}

// 친구 묶음: 장식 띠 → 흰 말풍선 → 문구 → 곰 인형 스티커
function FriendCluster({ o }) {
  return (
    <>
      <Placed o={o} cx={1056.391} cy={1236.3175} w={362.434} h={91.339} rotate={176.63} flipY>
        <img src={barFlip} alt="" />
      </Placed>
      <Placed o={o} cx={1029.2215} cy={1297.2475} w={487} h={162} rotate={-3.41}>
        {/* Figma inset -4.2% -1.6% -5.43% -1.6% */}
        <img
          src={noteWhite1}
          alt=""
          style={{ inset: 'auto', left: '-1.6%', top: '-4.2%', width: '103.2%', height: '109.63%' }}
        />
      </Placed>
      <Placed o={o} cx={1036.059} cy={1287.6635} w={411} h={24} rotate={7.83} className="stage__text">
        {QUOTES[2]}
      </Placed>
      <Placed o={o} cx={1217.6105} cy={1255.1865} w={103.295} h={92.358} rotate={11.98}>
        <Sprite crop={{ height: '250.88%', left: '-184.12%', top: '-27.74%', width: '336.47%' }} />
      </Placed>
    </>
  )
}

// 유치원 묶음: 코랄 말풍선 → 문구 → 장식 띠 → 유치원생 스티커
function KinderCluster({ o }) {
  return (
    <>
      <Placed o={o} cx={331.236} cy={1445.9335} w={554} h={93} rotate={0.79}>
        <img src={noteCoral1} alt="" />
      </Placed>
      <Placed
        o={o}
        cx={331.4395}
        cy={1439.642}
        w={467.238}
        h={31.002}
        rotate={-1.84}
        skewX={0.12}
        className="stage__text stage__text--light"
      >
        {QUOTES[1]}
      </Placed>
      <Placed o={o} cx={249.7725} cy={1478.809} w={458} h={115} rotate={0.79}>
        <img src={barC} alt="" />
      </Placed>
      <Placed o={o} cx={113.6165} cy={1365.8245} w={95.427} h={133.06} rotate={-4.17}>
        <Sprite crop={{ height: '192.59%', left: '-86.62%', top: '-5.13%', width: '402.82%' }} />
      </Placed>
    </>
  )
}

// 강아지 묶음: 장식 띠 → 흰 말풍선 → 문구 → 강아지 스티커
function PuppyCluster({ o }) {
  return (
    <>
      <Placed o={o} cx={1182.461} cy={1553.2885} w={286} h={72} rotate={14.34}>
        <img src={barB} alt="" />
      </Placed>
      <Box o={o} left={852} top={1471} w={515} h={82}>
        {/* Figma inset -8.29% -1.51% -10.73% -1.51% */}
        <img
          src={noteWhite2}
          alt=""
          style={{ inset: 'auto', left: '-1.51%', top: '-8.29%', width: '103.02%', height: '119.02%' }}
        />
      </Box>
      <Placed o={o} cx={1114.613} cy={1498.8335} w={456.928} h={24} rotate={-0.46} className="stage__text">
        {QUOTES[3]}
      </Placed>
      <Placed o={o} cx={1303.5745} cy={1447.939} w={110.511} h={89.086} rotate={-0.41}>
        <Sprite crop={{ height: '241.35%', left: '-52.55%', top: '-131.75%', width: '291.84%' }} />
      </Placed>
    </>
  )
}

export default function Problem() {
  const [desktopRef, desktopScale] = useFitScale(DESKTOP.width)
  const [mobileRef, mobileScale] = useFitScale(MOBILE.width)
  const d = DESKTOP.ORIGIN
  const sectionRef = useSectionView('problem_section_view')

  return (
    <section className="problem" id="problem" ref={sectionRef}>
      {/* 모바일에서만 보이는 배경 글로우 (데스크톱은 스테이지 안에 있어요) */}
      <div className="problem__glows" aria-hidden="true">
        <img className="problem__glow problem__glow--a" src={glowSmall} alt="" />
        <img className="problem__glow problem__glow--b" src={glowLarge} alt="" />
      </div>

      <div className="container">
        <h2 className="section-title">이런 순간, 있으셨죠?</h2>
      </div>

      {/* 데스크톱: 디자인 그대로의 스테이지 (폭에 맞춰 축소) */}
      <div className="problem__fit" ref={desktopRef} style={{ height: DESKTOP.height * desktopScale }}>
        <div className="stage" style={{ transform: `scale(${desktopScale})` }} aria-hidden="true">
          <Box o={d} left={1063} top={1225} w={468} h={468} className="stage__glow">
            <img src={glowLarge} alt="" style={{ inset: '-89.76%' }} />
          </Box>
          <Box o={d} left={20} top={1085} w={288} h={288} className="stage__glow">
            <img src={glowSmall} alt="" style={{ inset: '-109.06%' }} />
          </Box>

          <Mother o={d} />
          <BabyCluster o={d} />
          <FriendCluster o={d} />
          <KinderCluster o={d} />
          <PuppyCluster o={d} />
        </div>
      </div>

      {/* 모바일: 같은 말풍선/캐릭터를 세로로 쌓은 구성 (화면 폭에 맞춰 축소) */}
      <div className="problem__mfit" ref={mobileRef} style={{ height: MOBILE.height * mobileScale }}>
        <div
          className="stage stage--mobile"
          style={{ width: MOBILE.width, height: MOBILE.height, transform: `scale(${mobileScale})` }}
          aria-hidden="true"
        >
          <BabyCluster o={MOBILE.baby} />
          <FriendCluster o={MOBILE.friend} />
          <KinderCluster o={MOBILE.kinder} />
          <PuppyCluster o={MOBILE.puppy} />
          <Mother o={MOBILE.mother} />
        </div>
      </div>

      {/* 스테이지는 그림이라 스크린 리더용 텍스트를 따로 둬요 */}
      <ul className="sr-only">
        {QUOTES.map((quote) => (
          <li key={quote}>{quote}</li>
        ))}
      </ul>
    </section>
  )
}
