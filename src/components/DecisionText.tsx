interface DecisionTextProps {
  text: string
}

export default function DecisionText({ text }: DecisionTextProps) {
  // Split into paragraphs on 2+ newlines
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim())

  return (
    <div className="decision-text font-serif text-[15px] leading-[1.8] text-slate-800">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim()

        // Horizontal rules
        if (trimmed === '---') {
          return <hr key={i} className="my-6 border-slate-200" />
        }

        // Centered headers (Republic of the Philippines, SUPREME COURT, EN BANC, etc.)
        if (
          /^(Republic of the Philippines|SUPREME COURT|Manila|EN BANC|FIRST DIVISION|SECOND DIVISION|THIRD DIVISION|SPECIAL .* DIVISION|D\s*E\s*C\s*I\s*S\s*I\s*O\s*N|R\s*E\s*S\s*O\s*L\s*U\s*T\s*I\s*O\s*N|CONCURRING OPINION|DISSENTING OPINION|SEPARATE OPINION|CONCURRING AND DISSENTING OPINION)$/i.test(trimmed)
        ) {
          return (
            <p key={i} className="text-center font-bold text-slate-900 my-2 text-sm uppercase tracking-wide">
              {trimmed}
            </p>
          )
        }

        // Case number + date line (e.g., "G.R. No. 101083   July 30, 1993")
        if (/^G\.R\.\s*(Nos?\.|No\.)?\s*/i.test(trimmed) && trimmed.length < 200) {
          return (
            <p key={i} className="text-center font-bold text-slate-700 my-2 text-sm">
              {trimmed}
            </p>
          )
        }

        // Ponente line (e.g., "DAVIDE, JR., J.:")
        if (/^[A-Z][A-Z\s,.\-]+,?\s*(?:C\.?J\.?|J\.?):?\s*$/m.test(trimmed) && trimmed.length < 100) {
          return (
            <p key={i} className="font-bold text-slate-900 mt-6 mb-3">
              {trimmed}
            </p>
          )
        }

        // "vs." separator
        if (/^vs\.?\s*$/i.test(trimmed)) {
          return (
            <p key={i} className="text-center text-slate-500 italic my-1 text-sm">
              vs.
            </p>
          )
        }

        // WHEREFORE / SO ORDERED (dispositive portion)
        if (/^WHEREFORE/i.test(trimmed) || /^SO ORDERED\.?\s*$/i.test(trimmed)) {
          return (
            <p key={i} className="my-4 font-bold text-slate-900">
              {trimmed}
            </p>
          )
        }

        // Section headings (all caps, short)
        if (/^[A-Z][A-Z\s.:\-]{4,}$/.test(trimmed) && trimmed.length < 80) {
          return (
            <p key={i} className="font-bold text-slate-900 mt-6 mb-2 text-sm uppercase tracking-wide">
              {trimmed}
            </p>
          )
        }

        // Regular paragraph — may contain internal single newlines
        const lines = trimmed.split('\n')
        return (
          <p key={i} className="my-3 text-justify">
            {lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}
