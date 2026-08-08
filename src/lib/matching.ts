function normalize(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ")
}

export function isCorrectGuess(guess: string, answer: string): boolean {
  return normalize(guess) === normalize(answer)
}
