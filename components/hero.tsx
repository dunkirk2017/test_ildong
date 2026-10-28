import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 md:grid-cols-2 md:px-8 md:pb-28 md:pt-24">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            Since 1941 · 대한민국 종합제약사
          </p>
          <h1 className="text-balance font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            의약품의 근본은
            <br />
            <span className="text-primary">사람</span>입니다
          </h1>
          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            일동제약은 80여 년간 국민의 곁에서 믿을 수 있는 의약품을 만들어 왔습니다.
            오늘도 더 건강한 내일을 위한 연구를 멈추지 않습니다.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              회사 알아보기
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="/brands"
              className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              대표 브랜드
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-[4/5]">
            <Image
              src="/images/hero-lab.png"
              alt="실험실에서 시약을 살펴보는 연구원"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-4 rounded-2xl border border-border bg-card p-5 shadow-lg md:-left-8">
            <p className="font-serif text-3xl font-bold text-primary">85년</p>
            <p className="mt-1 text-sm text-muted-foreground">국민 건강과 함께한 시간</p>
          </div>
        </div>
      </div>
    </section>
  )
}
