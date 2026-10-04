import { CTA_LABEL, CTA_URL } from '../config'
import './Header.css'

const NAV = [
  { href: '#problem', label: '이런 순간' },
  { href: '#how', label: '이용 방법' },
  { href: '#story', label: '동화 미리보기' },
  { href: '#faq', label: '자주 묻는 질문' },
]

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#top" className="logo" aria-label="FIRSTORY 처음으로">
          FIR<span>STORY</span>
        </a>
        <nav className="nav" aria-label="주요 메뉴">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a href={CTA_URL} className="btn btn-primary btn-sm">
          {CTA_LABEL}
        </a>
      </div>
    </header>
  )
}
