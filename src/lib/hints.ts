import type { GameCard } from "@/types/card"

export interface Hint {
  label: string
  value: string
  isImage?: boolean
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function redactPokemonName(text: string, name: string): string {
  const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b`, "gi")
  return text.replace(pattern, (match) => "█".repeat(match.length))
}

export function buildHints(card: GameCard): Hint[] {
  const hints: Hint[] = [
    { label: "Flavor text", value: redactPokemonName(card.flavorText, card.name) },
    { label: "Genus", value: card.genus },
  ]

  if (card.types.length > 0) {
    hints.push({ label: "Type", value: card.types.join(" / ") })
  }

  if (card.subtypes.length > 0) {
    hints.push({ label: "Stage", value: card.subtypes.join(", ") })
  }

  if (card.attacks.length > 0) {
    hints.push({
      label: "Attack",
      value: card.attacks.map((a) => a.name).join(", "),
    })
  } else if (card.abilities.length > 0) {
    hints.push({
      label: "Ability",
      value: card.abilities.map((a) => a.name).join(", "),
    })
  }

  hints.push({ label: "Illustration", value: card.image, isImage: true })

  return hints
}
