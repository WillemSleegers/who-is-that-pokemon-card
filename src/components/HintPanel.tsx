import type { Hint } from "@/lib/hints"
import { Card, CardContent } from "@/components/ui/card"
import { CroppedArt } from "@/components/CroppedArt"

interface HintPanelProps {
  hints: Hint[]
  revealedCount: number
}

export function HintPanel({ hints, revealedCount }: HintPanelProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        {hints.slice(0, revealedCount).map((hint) => (
          <div key={hint.label}>
            <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {hint.label}
            </p>
            {hint.isImage ? (
              <CroppedArt src={hint.value} alt="Pokémon illustration" className="rounded-lg" />
            ) : (
              <p className="text-base text-foreground">{hint.value}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
