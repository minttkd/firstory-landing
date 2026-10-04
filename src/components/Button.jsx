import './Button.css'

// variant: primary(주황) | mint(초록) | gradient(CTA)
// href가 없으면 눌러도 아무 동작을 하지 않는 버튼으로 그려요 (이동할 화면이 아직 없을 때).
export default function Button({ href, variant = 'primary', width, arrow, onClick, children }) {
  const className = `btn btn--${variant}`
  const style = width ? { width } : undefined
  const content = (
    <>
      <span>{children}</span>
      <img src={arrow} alt="" width="8" height="14" />
    </>
  )

  if (!href) {
    return (
      <button type="button" className={className} style={style} onClick={onClick}>
        {content}
      </button>
    )
  }

  return (
    <a href={href} className={className} style={style}>
      {content}
    </a>
  )
}
