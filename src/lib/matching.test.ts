import { describe, expect, it } from "vitest"
import { isCorrectGuess } from "./matching"

describe("isCorrectGuess", () => {
  it("matches an exact name", () => {
    expect(isCorrectGuess("Bulbasaur", "Bulbasaur")).toBe(true)
  })

  it("is case-insensitive", () => {
    expect(isCorrectGuess("bulbasaur", "Bulbasaur")).toBe(true)
  })

  it("ignores surrounding whitespace and collapses internal runs", () => {
    expect(isCorrectGuess("  Erika's   Oddish ", "Erika's Oddish")).toBe(true)
  })

  it("rejects a different name", () => {
    expect(isCorrectGuess("Ivysaur", "Bulbasaur")).toBe(false)
  })
})
