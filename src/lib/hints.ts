import type { GameCard } from "@/types/card"

export interface Hint {
  label: string
  value: string
  isImage?: boolean
}

export type HintKind =
  | "flavorText"
  | "genus"
  | "type"
  | "stage"
  | "attackOrAbility"
  | "illustration"

export const HINT_KINDS: { kind: HintKind; label: string }[] = [
  { kind: "flavorText", label: "Flavor text" },
  { kind: "genus", label: "Genus" },
  { kind: "type", label: "Type" },
  { kind: "stage", label: "Stage" },
  { kind: "attackOrAbility", label: "Attack / Ability" },
  { kind: "illustration", label: "Illustration" },
]

export const ALL_HINT_KINDS: Set<HintKind> = new Set(HINT_KINDS.map((h) => h.kind))

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function redactPokemonName(text: string, name: string): string {
  const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b`, "gi")
  return text.replace(pattern, (match) => "█".repeat(match.length))
}

export function buildHints(card: GameCard, enabledKinds: Set<HintKind> = ALL_HINT_KINDS): Hint[] {
  const hints: Hint[] = []

  if (enabledKinds.has("flavorText")) {
    hints.push({ label: "Flavor text", value: redactPokemonName(card.flavorText, card.name) })
  }

  if (enabledKinds.has("genus")) {
    hints.push({ label: "Genus", value: card.genus })
  }

  if (enabledKinds.has("type") && card.types.length > 0) {
    hints.push({ label: "Type", value: card.types.join(" / ") })
  }

  if (enabledKinds.has("stage") && card.subtypes.length > 0) {
    hints.push({ label: "Stage", value: card.subtypes.join(", ") })
  }

  if (enabledKinds.has("attackOrAbility")) {
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
  }

  if (enabledKinds.has("illustration")) {
    hints.push({ label: "Illustration", value: card.image, isImage: true })
  }

  return hints
}
