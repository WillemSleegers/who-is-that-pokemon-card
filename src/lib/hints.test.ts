import { describe, expect, it } from "vitest"
import { buildHints } from "./hints"
import type { GameCard } from "@/types/card"

const baseCard: GameCard = {
  name: "Bulbasaur",
  types: ["Grass"],
  subtypes: ["Basic"],
  hp: 80,
  genus: "Seed Pokémon",
  flavorText: "For some time after its birth...",
  attacks: [{ name: "Bind Down" }],
  abilities: [],
  image: "https://example.com/bulbasaur.png",
}

describe("buildHints", () => {
  it("redacts the pokemon's name when it appears in the flavor text", () => {
    const card: GameCard = {
      ...baseCard,
      flavorText: "Bulbasaur can be seen napping in bright sunlight.",
    }
    const hints = buildHints(card)
    expect(hints[0].value).toBe("█████████ can be seen napping in bright sunlight.")
  })

  it("redacts names containing accented characters", () => {
    const card: GameCard = {
      ...baseCard,
      name: "Flabébé",
      flavorText: "Flabébé always keeps its flower fresh.",
    }
    const hints = buildHints(card)
    expect(hints[0].value).toBe("███████ always keeps its flower fresh.")
  })

  it("starts with flavor text and ends with the card image", () => {
    const hints = buildHints(baseCard)
    expect(hints[0]).toEqual({ label: "Flavor text", value: baseCard.flavorText })
    expect(hints.at(-1)).toEqual({
      label: "Illustration",
      value: baseCard.image,
      isImage: true,
    })
  })

  it("does not include an HP hint", () => {
    const hints = buildHints(baseCard)
    expect(hints.some((h) => h.label === "HP")).toBe(false)
  })

  it("includes an attack-name hint when attacks are present", () => {
    const hints = buildHints(baseCard)
    expect(hints.some((h) => h.label === "Attack" && h.value === "Bind Down")).toBe(true)
  })

  it("falls back to abilities when there are no attacks", () => {
    const card: GameCard = { ...baseCard, attacks: [], abilities: [{ name: "Overgrow" }] }
    const hints = buildHints(card)
    expect(hints.some((h) => h.label === "Ability" && h.value === "Overgrow")).toBe(true)
    expect(hints.some((h) => h.label === "Attack")).toBe(false)
  })

  it("omits the attack/ability stage entirely when a card has neither", () => {
    const card: GameCard = { ...baseCard, attacks: [], abilities: [] }
    const hints = buildHints(card)
    expect(hints.some((h) => h.label === "Attack" || h.label === "Ability")).toBe(false)
    // still ends on the image even with a shorter list
    expect(hints.at(-1)?.isImage).toBe(true)
  })
})
