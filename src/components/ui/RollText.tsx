/** Button label whose letters roll up one after another on hover, as on AgentLab. */
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="sr-only">{children}</span>
      {Array.from(children).map((ch, i) => {
        const c = ch === ' ' ? ' ' : ch
        return (
          <span key={i} aria-hidden className="roll-ch" style={{ transitionDelay: `${i * 16}ms` }}>
            <span>{c}</span>
            <span className="roll-ch-2">{c}</span>
          </span>
        )
      })}
    </span>
  )
}
