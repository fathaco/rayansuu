import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Stats from '@/components/Stats'
import Courses from '@/components/Courses'
import Hadiths from '@/components/Hadiths'
import QuranVerses from '@/components/QuranVerses'
import Tips from '@/components/Tips'
import FAQ from '@/components/FAQ'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Stats />
      <Courses />
      <Hadiths />
      <QuranVerses />
      <Tips />
      <FAQ />
      <Newsletter />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
