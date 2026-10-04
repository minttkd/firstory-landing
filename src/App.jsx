import Hero from './components/Hero'
import Problem from './components/Problem'
import Steps from './components/Steps'
import Sample from './components/Sample'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <Problem />
        <Steps />
        <Sample />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
