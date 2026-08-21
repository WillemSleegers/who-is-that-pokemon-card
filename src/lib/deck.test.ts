import { describe, expect, it } from "vitest"
import { createDeck } from "./deck"
import type { GameCard } from "@/types/card"

function fakeCard(name: string): GameCard {
  return {
    name,
    types: [],
    subtypes: [],
    hp: 10,
    genus: "",
    flavorText: "",
    attacks: [],
    abilities: [],
    image: "",
    set: "",
    setName: "",
    era: "",
    releaseDate: "",
  }
}

describe("createDeck", () => {
  it("draws every card exactly once before repeating", () => {
    const pool = ["A", "B", "C", "D"].map(fakeCard)
    const deck = createDeck(pool)

    const firstCycle = Array.from({ length: pool.length }, () => deck.next().name)
    expect(new Set(firstCycle)).toEqual(new Set(pool.map((c) => c.name)))
  })

  it("reshuffles and continues after the pool is exhausted", () => {
    const pool = ["A", "B", "C"].map(fakeCard)
    const deck = createDeck(pool)

    for (let i = 0; i < pool.length; i++) deck.next()
    const secondCycle = Array.from({ length: pool.length }, () => deck.next().name)
    expect(new Set(secondCycle)).toEqual(new Set(pool.map((c) => c.name)))
  })
})
