// Copies + trims card data from the sibling pokemon-tcg-database project into
// src/data/cards.json. Rerun whenever that project adds new sets.
//
//   node scripts/copy-data.mjs

import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SOURCE_SETS_DIR =
  "/Users/willem/GitHub/pokemon-tcg-database/data/sets"
const OUTPUT_PATH = path.join(__dirname, "../src/data/cards.json")

const setFiles = readdirSync(SOURCE_SETS_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort()

const cards = []

for (const file of setFiles) {
  const { set, cards: setCards } = JSON.parse(
    readFileSync(path.join(SOURCE_SETS_DIR, file), "utf8"),
  )

  for (const card of setCards) {
    if (card.supertype !== "Pokémon" || !card.flavorText || !card.pokedex) {
      continue
    }

    cards.push({
      name: card.name,
      types: card.types ?? [],
      subtypes: card.subtypes ?? [],
      hp: card.hp ?? 0,
      genus: card.pokedex.genus ?? "",
      flavorText: card.flavorText,
      attacks: (card.attacks ?? []).map((a) => ({ name: a.name })),
      abilities: (card.abilities ?? []).map((a) => ({ name: a.name })),
      image: card.images?.large ?? card.images?.small ?? "",
      set: set.code,
      setName: set.name,
      era: set.series,
      releaseDate: set.releaseDate ?? "",
    })
  }
}

writeFileSync(OUTPUT_PATH, JSON.stringify(cards, null, 2) + "\n")
console.log(`Wrote ${cards.length} cards to ${path.relative(process.cwd(), OUTPUT_PATH)}`)
