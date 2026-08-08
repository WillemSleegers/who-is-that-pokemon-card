import type { GameCard } from "@/types/card"

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export interface Deck {
  next(): GameCard
}

// Draws cards without repeats until the whole pool has been seen, then
// reshuffles and starts a new cycle.
export function createDeck(pool: GameCard[]): Deck {
  let queue: GameCard[] = []

  return {
    next(): GameCard {
      if (queue.length === 0) {
        queue = shuffle(pool)
      }
      return queue.pop()!
    },
  }
}
