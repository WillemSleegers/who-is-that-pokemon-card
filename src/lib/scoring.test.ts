import { describe, expect, it } from "vitest"
import { scoreForGuess } from "./scoring"

describe("scoreForGuess", () => {
  it("awards the card's max when guessed on the first hint", () => {
    expect(scoreForGuess(1, 7)).toBe(7)
  })

  it("loses one point per extra hint revealed", () => {
    expect(scoreForGuess(2, 7)).toBe(6)
    expect(scoreForGuess(4, 7)).toBe(4)
  })

  it("awards 1 point when guessed on the final hint", () => {
    expect(scoreForGuess(7, 7)).toBe(1)
  })

  it("stays fair for cards with fewer total hints", () => {
    expect(scoreForGuess(1, 6)).toBe(6)
    expect(scoreForGuess(6, 6)).toBe(1)
  })
})
