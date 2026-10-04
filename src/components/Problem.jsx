import useFitScale from '../hooks/useFitScale'
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

const STAGE_WIDTH = 1440
const STAGE_HEIGHT = 687
const ORIGIN_Y = 1040 // Figma 기준 스테이지 시작 y

const QUOTES = [
  '동생이 태어난다는 걸 어떻게 설명해야 할까요?',
  '처음 유치원 가는 날, 겁먹은 아이에게 무슨 말을 해줄까요?',
  '친구랑 싸우고 온 날, 뭐라고 해줘야 할지 몰랐어요',
  '키우던 강아지가 세상을 떠났을 때, 어떻게 위로할까요?',
]

// "동생이 태어난다는 걸…" 묶음: Figma 프레임 밖(캔버스 x≈6474, y≈2146)에 따로 있던 4개 요소를
// 서로의 상대 배치를 유지한 채, 유치원 말풍선이 원래 있던 왼쪽 위 자리(말풍선 중심 461, 1210)에 맞춰 옮겼어요.
// 디자이너가 프레임 안에 위치를 확정하면 아래 좌표만 바꿔주세요.

// 중심 좌표(cx, cy)와 크기로 배치하고 중심 기준으로 회전/기울여요.
function Placed({ cx, cy, w, h, rotate = 0, skewX = 0, flipY = false, className = '', children }) {
  const transform = `rotate(${rotate}deg)${skewX ? ` skewX(${skewX}deg)` : ''}${flipY ? ' scaleY(-1)' : ''}`
  return (
    <div
      className={`stage__item ${className}`}
      style={{ left: cx - w / 2, top: cy - h / 2 - ORIGIN_Y, width: w, height: h, transform }}
    >
      {children}
    </div>
  )
}

// 좌상단(left, top) 좌표로 배치
function Box({ left, top, w, h, className = '', children }) {
  return (
    <div className={`stage__item ${className}`} style={{ left, top: top - ORIGIN_Y, width: w, height: h }}>
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

export default function Problem() {
  const [fitRef, scale] = useFitScale(STAGE_WIDTH)

  return (
    <section className="problem" id="problem">
      <div className="container">
        <h2 className="section-title">이런 순간, 있으셨죠?</h2>
      </div>

      {/* 데스크톱: 디자인 그대로의 스테이지 (폭에 맞춰 축소) */}
      <div className="problem__fit" ref={fitRef} style={{ height: STAGE_HEIGHT * scale }}>
        <div className="stage" style={{ transform: `scale(${scale})` }} aria-hidden="true">
          <Box left={1063} top={1225} w={468} h={468} className="stage__glow">
            <img src={glowLarge} alt="" style={{ inset: '-89.76%' }} />
          </Box>
          <Box left={20} top={1085} w={288} h={288} className="stage__glow">
            <img src={glowSmall} alt="" style={{ inset: '-109.06%' }} />
          </Box>

          <Box left={559} top={1352} w={322} h={288} className="stage__crop">
            <img
              src={thinking}
              alt=""
              style={{ height: '100%', left: '-22.53%', top: 0, width: '134.34%' }}
            />
          </Box>

          {/* 장식 띠: Figma 캔버스에서는 말풍선 오른쪽 위에 떠 있었지만 어색해서, 요청에 따라
              말풍선 바로 위(왼쪽 끝은 아기 스티커 뒤, 아래쪽은 말풍선 뒤)에 깔리도록 옮겼어요 */}
          <Placed cx={435.34} cy={1158.77} w={362.434} h={91.339} rotate={178.5} flipY>
            <img src={barFlip} alt="" />
          </Placed>
          <Placed cx={461} cy={1210} w={483} h={72.949} rotate={-2.95}>
            <img src={noteCoral2} alt="" />
          </Placed>
          <Placed
            cx={460.725}
            cy={1194.223}
            w={384}
            h={32.17}
            rotate={-2.65}
            className="stage__text stage__text--light"
          >
            {QUOTES[0]}
          </Placed>
          <Placed cx={281.176} cy={1144.474} w={97.65} h={97.65}>
            <Sprite crop={{ height: '235.39%', left: '-199.38%', top: '-122.94%', width: '353.09%' }} />
          </Placed>

          <Placed cx={1056.391} cy={1236.3175} w={362.434} h={91.339} rotate={176.63} flipY>
            <img src={barFlip} alt="" />
          </Placed>
          <Placed cx={331.236} cy={1445.9335} w={554} h={93} rotate={0.79}>
            <img src={noteCoral1} alt="" />
          </Placed>
          <Placed cx={1029.2215} cy={1297.2475} w={487} h={162} rotate={-3.41}>
            {/* Figma inset -4.2% -1.6% -5.43% -1.6% */}
            <img
              src={noteWhite1}
              alt=""
              style={{ inset: 'auto', left: '-1.6%', top: '-4.2%', width: '103.2%', height: '109.63%' }}
            />
          </Placed>
          <Placed cx={1182.461} cy={1553.2885} w={286} h={72} rotate={14.34}>
            <img src={barB} alt="" />
          </Placed>
          <Box left={852} top={1471} w={515} h={82}>
            {/* Figma inset -8.29% -1.51% -10.73% -1.51% */}
            <img
              src={noteWhite2}
              alt=""
              style={{ inset: 'auto', left: '-1.51%', top: '-8.29%', width: '103.02%', height: '119.02%' }}
            />
          </Box>

          <Placed
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
          <Placed cx={1036.059} cy={1287.6635} w={411} h={24} rotate={7.83} className="stage__text">
            {QUOTES[2]}
          </Placed>

          <Placed cx={249.7725} cy={1478.809} w={458} h={115} rotate={0.79}>
            <img src={barC} alt="" />
          </Placed>
          <Placed cx={1114.613} cy={1498.8335} w={456.928} h={24} rotate={-0.46} className="stage__text">
            {QUOTES[3]}
          </Placed>

          <Placed cx={113.6165} cy={1365.8245} w={95.427} h={133.06} rotate={-4.17}>
            <Sprite crop={{ height: '192.59%', left: '-86.62%', top: '-5.13%', width: '402.82%' }} />
          </Placed>
          <Placed cx={1217.6105} cy={1255.1865} w={103.295} h={92.358} rotate={11.98}>
            <Sprite crop={{ height: '250.88%', left: '-184.12%', top: '-27.74%', width: '336.47%' }} />
          </Placed>
          <Placed cx={1303.5745} cy={1447.939} w={110.511} h={89.086} rotate={-0.41}>
            <Sprite crop={{ height: '241.35%', left: '-52.55%', top: '-131.75%', width: '291.84%' }} />
          </Placed>
        </div>
      </div>

      {/* 모바일: 스테이지 대신 간단한 목록 */}
      <ul className="problem__list container">
        {QUOTES.map((quote) => (
          <li key={quote}>{quote}</li>
        ))}
      </ul>
    </section>
  )
}
