import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Brands } from '@/components/brands'
import { Research } from '@/components/research'
import { History } from '@/components/history'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Brands />
        <Research />
        <History />
      </main>
      <SiteFooter />
    </>
  )
}
