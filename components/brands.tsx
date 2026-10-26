const brands = [
  {
    name: '아로나민',
    since: '1963',
    category: '일반의약품 · 활성비타민',
    description:
      '피로 회복과 활력 충전을 돕는 대한민국 대표 활성비타민. 세대를 넘어 사랑받아 온 일동제약의 상징입니다.',
  },
  {
    name: '비오비타',
    since: '1959',
    category: '정장제 · 유산균',
    description:
      '국내 유산균 정장제의 역사를 연 브랜드. 온 가족의 장 건강을 위한 오랜 친구로 자리 잡았습니다.',
  },
  {
    name: '전문의약품',
    since: 'ETC',
    category: '처방의약품',
    description:
      '순환기, 소화기, 대사질환 등 다양한 치료 영역의 전문의약품으로 의료 현장의 신뢰를 얻고 있습니다.',
  },
  {
    name: '헬스케어',
    since: 'Wellness',
    category: '건강기능식품 · 생활건강',
    description:
      '프로바이오틱스와 영양 제품 등 일상 속 건강 관리를 위한 다양한 헬스케어 솔루션을 선보입니다.',
  },
]

export function Brands() {
  return (
    <section id="brands" className="scroll-mt-16 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-accent">대표 브랜드</p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold leading-snug text-foreground md:text-4xl">
              세대를 이어 온 이름들
            </h2>
          </div>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            반세기 넘게 국민의 일상을 지켜 온 대표 제품부터 전문 치료 영역까지,
            일동제약의 브랜드는 신뢰로 증명됩니다.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {brands.map((brand, i) => (
            <li
              key={brand.name}
              className={
                i === 0
                  ? 'flex flex-col justify-between rounded-3xl bg-primary p-8 text-primary-foreground md:p-10'
                  : 'flex flex-col justify-between rounded-3xl border border-border bg-card p-8 md:p-10'
              }
            >
              <div className="flex items-start justify-between gap-4">
                <p
                  className={
                    i === 0
                      ? 'text-sm text-primary-foreground/70'
                      : 'text-sm text-muted-foreground'
                  }
                >
                  {brand.category}
                </p>
                <span
                  className={
                    i === 0
                      ? 'rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium'
                      : 'rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary'
                  }
                >
                  {brand.since}
                </span>
              </div>
              <div className="mt-14">
                <h3 className="font-serif text-3xl font-bold md:text-4xl">{brand.name}</h3>
                <p
                  className={
                    i === 0
                      ? 'mt-3 leading-relaxed text-primary-foreground/80'
                      : 'mt-3 leading-relaxed text-muted-foreground'
                  }
                >
                  {brand.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
