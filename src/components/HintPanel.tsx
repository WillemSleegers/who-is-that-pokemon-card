import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import type { Hint } from "@/lib/hints"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CroppedArt } from "@/components/CroppedArt"

interface HintPanelProps {
  hints: Hint[]
  revealedCount: number
  viewedIndex: number
  onPrevious: () => void
  onNext: () => void
}

const GRID_COLUMNS = 3

function HintContent({ hint }: { hint: Hint }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {hint.label}
      </p>
      {hint.isImage ? (
        <CroppedArt src={hint.value} alt="Pokémon illustration" className="rounded-lg" />
      ) : (
        <p className="text-base text-foreground">{hint.value}</p>
      )}
    </div>
  )
}

// Not-yet-revealed cards keep their card outline visible and only hide
// the content inside — an invisible whole card reads as a layout bug
// (a mysterious dead gap) rather than "there's a hint here, not revealed
// yet."
function HintCard({
  hint,
  fill,
  revealed = true,
}: {
  hint: Hint
  fill?: boolean
  revealed?: boolean
}) {
  return (
    <Card className={cn(fill && "h-full")}>
      <CardContent
        className={cn(
          fill && "flex h-full flex-col justify-center",
          !revealed && "invisible"
        )}
        aria-hidden={!revealed}
      >
        <HintContent hint={hint} />
      </CardContent>
    </Card>
  )
}

export function HintPanel({
  hints,
  revealedCount,
  viewedIndex,
  onPrevious,
  onNext,
}: HintPanelProps) {
  const revealedIndex = new Map(hints.map((hint, index) => [hint, index]))
  const isRevealed = (hint: Hint) => (revealedIndex.get(hint) ?? Infinity) < revealedCount

  // Every hint this round is rendered from the start, fixed in its final
  // grid position — only its visibility toggles as it's revealed. Building
  // the grid out of just the currently-revealed hints meant each new
  // reveal changed the cell count and reflowed every row's height, not
  // just the illustration.
  const flavorHint = hints.find((hint) => hint.label === "Flavor text")
  const illustrationHint = hints.find((hint) => hint.isImage)
  const smallHints = hints.filter((hint) => hint !== flavorHint && !hint.isImage)

  return (
    <>
      <Card className="md:hidden">
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onPrevious}
                disabled={viewedIndex === 0}
                aria-label="Previous hint"
              >
                <ChevronLeftIcon />
              </Button>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Hint {viewedIndex + 1} of {revealedCount}
              </p>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onNext}
                disabled={viewedIndex >= revealedCount - 1}
                aria-label="Next hint"
              >
                <ChevronRightIcon />
              </Button>
            </div>
            <HintContent hint={hints[viewedIndex]} />
          </div>
        </CardContent>
      </Card>
      <div
        className="hidden md:grid md:items-stretch md:gap-3"
        style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`, gridAutoFlow: "row dense" }}
      >
        {flavorHint && (
          <div style={{ gridColumn: `1 / -1` }}>
            <HintCard hint={flavorHint} revealed={isRevealed(flavorHint)} />
          </div>
        )}
        {illustrationHint && (
          <div style={{ gridColumn: GRID_COLUMNS, gridRow: "span 2" }} className="h-full">
            <HintCard hint={illustrationHint} fill revealed={isRevealed(illustrationHint)} />
          </div>
        )}
        {smallHints.map((hint) => (
          <HintCard key={hint.label} hint={hint} fill revealed={isRevealed(hint)} />
        ))}
      </div>
    </>
  )
}
