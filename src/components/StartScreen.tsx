import { useState } from "react"

import { HINT_KINDS, type HintKind } from "@/lib/hints"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface StartScreenProps {
  onStart: (enabledHints: Set<HintKind>) => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [enabledHints, setEnabledHints] = useState<Set<HintKind>>(
    () => new Set(HINT_KINDS.map((h) => h.kind))
  )

  function toggleHint(kind: HintKind, checked: boolean) {
    setEnabledHints((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(kind)
      } else {
        next.delete(kind)
      }
      return next
    })
  }

  const canStart = enabledHints.size > 0

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-4 pt-16 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Who's That Pokémon Card?</h1>
        <p className="text-sm text-muted-foreground">
          Guess the Pokémon from its card, one hint at a time.
        </p>
      </div>

      <Card className="text-left">
        <CardContent className="flex flex-col gap-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Hints to include
          </p>
          {HINT_KINDS.map(({ kind, label }) => (
            <label key={kind} className="group/field flex items-center gap-2 text-sm">
              <Checkbox
                checked={enabledHints.has(kind)}
                onCheckedChange={(checked) => toggleHint(kind, checked === true)}
              />
              {label}
            </label>
          ))}
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            className="w-full"
            disabled={!canStart}
            onClick={() => onStart(enabledHints)}
          >
            Start
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
