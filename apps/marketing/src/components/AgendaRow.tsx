interface AgendaRowProps {
  title: string
  detail: string
  /** Minutes this part of the call takes. The time column renders only when
   *  set, so an unconfirmed split is never shown. */
  minutes?: number
}

/** One line of the call agenda: optional time, title, one-line detail. */
export function AgendaRow({ title, detail, minutes }: AgendaRowProps) {
  const hasTime = minutes !== undefined
  return (
    <li
      className={`border-b border-line py-5 ${
        hasTime
          ? 'grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-x-6 gap-y-1'
          : ''
      }`}
    >
      {hasTime && (
        <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-gold-text pt-1">
          {minutes} min
        </span>
      )}
      <div>
        <p className="text-lg font-medium leading-snug text-ink-em">{title}</p>
        <p className="mt-1.5 text-base font-light leading-6 text-ink-sub">
          {detail}
        </p>
      </div>
    </li>
  )
}
