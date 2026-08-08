// Points for guessing correctly with `hintsRevealed` hints shown, out of
// `totalHints` available for that card. Guessing right on the first hint
// always earns the card's max; each extra hint costs 1 point.
export function scoreForGuess(hintsRevealed: number, totalHints: number): number {
  return totalHints - hintsRevealed + 1
}
