import Image from 'next/image'
import { HeartPulse, ShieldCheck, Sparkles } from 'lucide-react'

const stats = [
  { value: '1941', label: '창업 연도' },
  { value: '60년+', label: '아로나민의 역사' },
  { value: '2곳', label: '생산 공장 (안성·청주)' },
  { value: '20+', label: '신약 파이프라인' },
]

const values = [
  {
    icon: HeartPulse,
    title: '사람 중심',
    description: '환자와 소비자의 삶을 먼저 생각하는 것이 모든 의약품 개발의 출발점입니다.',
  },
  {
    icon: ShieldCheck,
    title: '품질과 신뢰',
    description: '엄격한 GMP 기준의 생산 시설에서 안전하고 효과적인 제품만을 공급합니다.',
  },
  {
    icon: Sparkles,
    title: '미래를 향한 혁신',
    description: '미충족 의료 수요에 도전하는 신약 연구로 새로운 치료의 가능성을 엽니다.',
  },
]

export function About() {
  return (
    <section id="about" className="scroll-mt-16 bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-sm font-medium text-accent">회사소개</p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold leading-snug text-foreground md:text-4xl">
              국민과 함께 성장해 온 <br className="hidden md:block" />
              신뢰의 제약 기업
            </h2>
          </div>
          <div className="space-y-5 text-pretty leading-relaxed text-muted-foreground md:col-span-7">
            <p>
              일동제약은 1941년 창업주 윤용구 회장이 설립한 극동제약에서 출발해, 1942년
              일동제약으로 사명을 바꾸며 본격적인 제약 사업의 길을 걸어왔습니다.
            </p>
            <p>
              &lsquo;의약품의 근본은 사람&rsquo;이라는 창업이념 아래 일반의약품, 전문의약품,
              건강기능식품을 아우르는 폭넓은 포트폴리오를 구축했으며, 2016년 지주회사 체제 전환과
              2023년 R&amp;D 전문 자회사 유노비아 출범을 통해 지속 가능한 성장 기반을
              다지고 있습니다.
            </p>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-6 md:p-8">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 font-serif text-3xl font-bold text-primary md:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/family-health.png"
              alt="햇살 아래 공원을 함께 걷는 가족"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <ul className="space-y-8">
            {values.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
