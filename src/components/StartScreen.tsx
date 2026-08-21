import { useEffect, useState } from "react"

import { HINT_KINDS, type HintKind } from "@/lib/hints"
import type { EraGroup } from "@/lib/sets"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

interface StartScreenProps {
  eraGroups: EraGroup[]
  onStart: (enabledHints: Set<HintKind>, selectedSets: Set<string>) => void
}

export function StartScreen({ eraGroups, onStart }: StartScreenProps) {
  const [enabledHints, setEnabledHints] = useState<Set<HintKind>>(
    () => new Set(HINT_KINDS.map((h) => h.kind))
  )
  const [selectedSets, setSelectedSets] = useState<Set<string>>(
    () => new Set(eraGroups[0]?.sets.map((s) => s.code) ?? [])
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

  function toggleSet(code: string, checked: boolean) {
    setSelectedSets((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(code)
      } else {
        next.delete(code)
      }
      return next
    })
  }

  function toggleEra(era: EraGroup, checked: boolean) {
    setSelectedSets((prev) => {
      const next = new Set(prev)
      for (const set of era.sets) {
        if (checked) {
          next.add(set.code)
        } else {
          next.delete(set.code)
        }
      }
      return next
    })
  }

  function selectAllSets() {
    setSelectedSets(new Set(eraGroups.flatMap((g) => g.sets.map((s) => s.code))))
  }

  function deselectAllSets() {
    setSelectedSets(new Set())
  }

  const canStart = enabledHints.size > 0 && selectedSets.size > 0

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" && canStart) {
        event.preventDefault()
        onStart(enabledHints, selectedSets)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [canStart, enabledHints, selectedSets, onStart])

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-4 pt-16 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Who's That Pokémon Card?</h1>
        <p className="text-sm text-muted-foreground">
          Guess the Pokémon from its card, one hint at a time.
        </p>
      </div>

      <Button
        className="w-full"
        disabled={!canStart}
        onClick={() => onStart(enabledHints, selectedSets)}
      >
        Start <span className="opacity-70">(Enter)</span>
      </Button>

      <Card className="text-left">
        <CardContent>
          <FieldSet>
            <FieldLegend variant="label">Hints to include</FieldLegend>
            <FieldGroup data-slot="checkbox-group">
              {HINT_KINDS.map(({ kind, label }) => (
                <Field key={kind} orientation="horizontal">
                  <Checkbox
                    id={`hint-${kind}`}
                    checked={enabledHints.has(kind)}
                    onCheckedChange={(checked) => toggleHint(kind, checked === true)}
                  />
                  <FieldLabel htmlFor={`hint-${kind}`}>{label}</FieldLabel>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      <Card className="text-left">
        <CardContent className="max-h-80 overflow-y-auto pt-1">
          <div className="mb-3 flex items-center justify-between">
            <FieldLegend variant="label" className="mb-0">
              Sets to include
            </FieldLegend>
            <div className="flex gap-3">
              <Button variant="link" size="sm" className="h-auto p-0" onClick={selectAllSets}>
                Select all
              </Button>
              <Button variant="link" size="sm" className="h-auto p-0" onClick={deselectAllSets}>
                Deselect all
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {eraGroups.map((group) => {
              const codes = group.sets.map((s) => s.code)
              const selectedCount = codes.filter((c) => selectedSets.has(c)).length
              const allSelected = selectedCount === codes.length
              const noneSelected = selectedCount === 0

              return (
                <FieldSet key={group.era}>
                  <FieldLegend variant="label">
                    <Field orientation="horizontal">
                      <Checkbox
                        id={`era-${group.era}`}
                        checked={allSelected ? true : noneSelected ? false : "indeterminate"}
                        onCheckedChange={(checked) => toggleEra(group, checked === true)}
                      />
                      <FieldLabel htmlFor={`era-${group.era}`}>{group.era}</FieldLabel>
                    </Field>
                  </FieldLegend>
                  <FieldGroup data-slot="checkbox-group" className="ml-6">
                    {group.sets.map((set) => (
                      <Field key={set.code} orientation="horizontal">
                        <Checkbox
                          id={`set-${set.code}`}
                          checked={selectedSets.has(set.code)}
                          onCheckedChange={(checked) =>
                            toggleSet(set.code, checked === true)
                          }
                        />
                        <FieldLabel
                          htmlFor={`set-${set.code}`}
                          className="text-muted-foreground"
                        >
                          {set.name}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                </FieldSet>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
