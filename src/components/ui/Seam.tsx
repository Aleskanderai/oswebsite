/*
  Full-width hairline between sections, with small crosshairs where it crosses the
  two page guide lines. Everything on the page lines up with those two lines, so the
  seams and the column always meet cleanly (Alex, 1:45: "the split with the line is off").
*/
export function Seam() {
  return (
    <div aria-hidden className="relative z-[1] h-px w-full bg-line">
      <div className="relative mx-auto hidden h-px w-[calc(100%-64px)] max-w-[1240px] lg:block">
        <Cross className="left-0 -translate-x-1/2" />
        <Cross className="right-0 translate-x-1/2" />
      </div>
    </div>
  )
}

function Cross({ className }: { className: string }) {
  return (
    <span className={`absolute top-0 h-[9px] w-[9px] -translate-y-1/2 ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink-3" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink-3" />
    </span>
  )
}
