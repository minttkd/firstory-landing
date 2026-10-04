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
  '처음 유치원 가는 날, 겁먹은 아이에게 무슨 말을 해줄까요?',
  '동생이 태어난다는 걸 어떻게 설명해야 할까요?',
  '친구랑 싸우고 온 날, 뭐라고 해줘야 할지 몰랐어요',
  '키우던 강아지가 세상을 떠났을 때, 어떻게 위로할까요?',
]

// 중심 좌표(cx, cy)와 크기로 배치하고 중심 기준으로 회전해요.
function Placed({ cx, cy, w, h, rotate = 0, flipY = false, className = '', children }) {
  const transform = `rotate(${rotate}deg)${flipY ? ' scaleY(-1)' : ''}`
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

          <Box left={559} top={1358} w={322} h={288} className="stage__crop">
            <img
              src={thinking}
              alt=""
              style={{ height: '100%', left: '-22.53%', top: 0, width: '134.34%' }}
            />
          </Box>

          <Placed cx={1033.2} cy={1258.7} w={362.434} h={91.339} rotate={180} flipY>
            <img src={barFlip} alt="" />
          </Placed>
          <Box left={164} top={1159} w={594} h={102}>
            <img src={noteCoral1} alt="" />
          </Box>
          <Box left={759} top={1237} w={487} h={162}>
            {/* Figma inset -4.2% -1.6% -5.43% -1.6% */}
            <img
              src={noteWhite1}
              alt=""
              style={{ inset: 'auto', left: '-1.6%', top: '-4.2%', width: '103.2%', height: '109.63%' }}
            />
          </Box>
          <Placed cx={1151.461} cy={1550.289} w={286} h={72} rotate={14.34}>
            <img src={barB} alt="" />
          </Placed>
          <Box left={821} top={1468} w={515} h={82}>
            {/* Figma inset -8.29% -1.51% -10.73% -1.51% */}
            <img
              src={noteWhite2}
              alt=""
              style={{ inset: 'auto', left: '-1.51%', top: '-8.29%', width: '103.02%', height: '119.02%' }}
            />
          </Box>
          <Placed cx={351.467} cy={1435.865} w={483} h={72.949} rotate={-7.3}>
            <img src={noteCoral2} alt="" />
          </Placed>

          <Placed cx={473.052} cy={1201.056} w={501} h={34} rotate={-2.69} className="stage__text stage__text--light">
            {QUOTES[0]}
          </Placed>
          <Placed cx={350.513} cy={1426.939} w={384} h={32} rotate={-7.04} className="stage__text stage__text--light">
            {QUOTES[1]}
          </Placed>
          <Placed cx={1009.896} cy={1308.84} w={411} h={24} rotate={11.24} className="stage__text">
            {QUOTES[2]}
          </Placed>

          <Box left={124} top={1203} w={458} h={115}>
            <img src={barC} alt="" />
          </Box>
          <Placed cx={1083.62} cy={1495.83} w={456.928} h={24} rotate={-0.46} className="stage__text">
            {QUOTES[3]}
          </Placed>
          <Placed cx={290.957} cy={1488.09} w={362.434} h={91.339} rotate={174.09} flipY>
            <img src={barFlip} alt="" />
          </Placed>

          <Placed cx={222.29} cy={1137.41} w={95.427} h={133.06} rotate={-4.96}>
            <Sprite crop={{ height: '192.59%', left: '-86.62%', top: '-5.13%', width: '402.82%' }} />
          </Placed>
          <Placed cx={1185.06} cy={1287.4} w={103.295} h={92.358} rotate={15.4}>
            <Sprite crop={{ height: '250.88%', left: '-184.12%', top: '-27.74%', width: '336.47%' }} />
          </Placed>
          <Placed cx={1272.57} cy={1444.94} w={110.511} h={89.086} rotate={-0.41}>
            <Sprite crop={{ height: '241.35%', left: '-52.55%', top: '-131.75%', width: '291.84%' }} />
          </Placed>
          <Box left={115} top={1342} w={91} h={91}>
            <Sprite crop={{ height: '235.39%', left: '-199.38%', top: '-122.94%', width: '353.09%' }} />
          </Box>
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
