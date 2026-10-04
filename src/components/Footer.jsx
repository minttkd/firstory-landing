import './Footer.css'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-logo">FIRSTORY</span>
        <p>아이의 첫 경험을 이야기로, 부모와 아이의 대화로.</p>
        <small>© {YEAR} FIRSTORY. All rights reserved.</small>
      </div>
    </footer>
  )
}
