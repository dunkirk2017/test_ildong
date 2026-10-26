const milestones = [
  { year: '1941', title: '극동제약 창립', description: '창업주 윤용구 회장, 제약 사업의 첫발을 내딛다' },
  { year: '1942', title: '일동제약으로 사명 변경', description: '오늘의 일동제약이라는 이름이 시작되다' },
  { year: '1959', title: '비오비타 출시', description: '국내 유산균 정장제 시장을 열다' },
  { year: '1963', title: '아로나민 출시', description: '대한민국 대표 활성비타민의 탄생' },
  { year: '2016', title: '지주회사 체제 전환', description: '일동홀딩스 설립, 일동제약 신설법인 출범' },
  { year: '2023', title: '유노비아 출범', description: '신약 R&D 전문 자회사로 연구 역량 강화' },
]

export function History() {
  return (
    <section id="history" className="scroll-mt-16 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-sm font-medium text-accent">연혁</p>
        <h2 className="mt-3 text-balance font-serif text-3xl font-bold leading-snug text-foreground md:text-4xl">
          85년의 발자취
        </h2>

        <ol className="mt-12 border-t border-border">
          {milestones.map((m) => (
            <li
              key={m.year}
              className="grid gap-2 border-b border-border py-6 md:grid-cols-12 md:items-baseline md:gap-6 md:py-8"
            >
              <span className="font-serif text-2xl font-bold text-primary md:col-span-2 md:text-3xl">
                {m.year}
              </span>
              <h3 className="text-lg font-bold text-foreground md:col-span-4">{m.title}</h3>
              <p className="leading-relaxed text-muted-foreground md:col-span-6">
                {m.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
