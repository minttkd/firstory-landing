import './Button.css'

// variant: primary(주황) | mint(초록) | gradient(CTA)
export default function Button({ href, variant = 'primary', width, arrow, children }) {
  return (
    <a href={href} className={`btn btn--${variant}`} style={width ? { width } : undefined}>
      <span>{children}</span>
      <img src={arrow} alt="" width="8" height="14" />
    </a>
  )
}
