import type { GameCard } from "@/types/card"

export interface SetInfo {
  code: string
  name: string
  era: string
  releaseDate: string
}

export interface EraGroup {
  era: string
  sets: SetInfo[]
}

// Groups the distinct sets present in the card pool by era, newest first
// (both eras and the sets within them are sorted by release date descending).
export function groupSetsByEra(cards: GameCard[]): EraGroup[] {
  const eraSets = new Map<string, Map<string, SetInfo>>()

  for (const card of cards) {
    if (!eraSets.has(card.era)) {
      eraSets.set(card.era, new Map())
    }
    eraSets.get(card.era)!.set(card.set, {
      code: card.set,
      name: card.setName,
      era: card.era,
      releaseDate: card.releaseDate,
    })
  }

  const groups = [...eraSets.entries()].map(([era, sets]) => ({
    era,
    sets: [...sets.values()].sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1)),
  }))

  function latestReleaseDate(group: EraGroup) {
    return group.sets.reduce((latest, s) => (s.releaseDate > latest ? s.releaseDate : latest), "")
  }

  return groups.sort((a, b) => {
    if (a.era === "Other") return 1
    if (b.era === "Other") return -1
    return latestReleaseDate(a) < latestReleaseDate(b) ? 1 : -1
  })
}

export function allSetCodes(cards: GameCard[]): Set<string> {
  return new Set(cards.map((c) => c.set))
}
