import Image from 'next/image'
import { Activity, FlaskConical, Microscope, Pill } from 'lucide-react'

const areas = [
  { icon: Activity, title: '대사질환', description: '비만·당뇨 등 만성 대사질환 신약' },
  { icon: Pill, title: '소화기 질환', description: '위장관 질환의 새로운 치료 옵션' },
  { icon: Microscope, title: '감염 질환', description: '바이러스 감염 대응 치료제' },
  { icon: FlaskConical, title: '플랫폼 기술', description: '저분자 신약 발굴 연구 역량' },
]

export function Research() {
  return (
    <section
      id="research"
      className="scroll-mt-16 bg-foreground py-20 text-background md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-sm font-medium text-accent">연구개발</p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold leading-snug md:text-4xl">
              유노비아와 함께 여는
              <br />
              신약의 미래
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-background/70">
              2023년 11월, 일동제약은 연구개발 부문을 분할해 신약 R&amp;D 전문 자회사
              &lsquo;유노비아&rsquo;를 출범시켰습니다. 유노비아는 일동제약의 연구 자산과 인력을
              이어받아 20여 개의 혁신 신약 파이프라인에 역량을 집중하고 있습니다.
            </p>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {areas.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="rounded-2xl border border-background/10 bg-background/5 p-5"
                >
                  <Icon className="size-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-background/60">
                    {description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-80 overflow-hidden rounded-3xl md:min-h-full">
            <Image
              src="/images/facility.png"
              alt="깨끗하게 정돈된 의약품 생산 설비"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-background/95 p-5 text-foreground backdrop-blur">
              <p className="text-sm text-muted-foreground">생산 거점</p>
              <p className="mt-1 font-bold">경기 안성 · 충북 청주 GMP 공장</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
