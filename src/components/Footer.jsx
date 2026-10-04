import { CONTACT_EMAIL } from '../config'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>{`FIRSTORY  ·  문의 ${CONTACT_EMAIL}  ·  개인정보처리방침  ·  © 2026 FIRSTORY`}</p>
      </div>
    </footer>
  )
}
