import Header from './components/Header'
import Hero from './components/Hero'
import Problem from './components/Problem'
import HowItWorks from './components/HowItWorks'
import StoryPreview from './components/StoryPreview'
import Pledge from './components/Pledge'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import useReveal from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <StoryPreview />
        <Pledge />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

