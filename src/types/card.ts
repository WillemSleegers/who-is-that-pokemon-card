export interface GameCard {
  name: string
  types: string[]
  subtypes: string[]
  hp: number
  genus: string
  flavorText: string
  attacks: { name: string }[]
  abilities: { name: string }[]
  image: string
  set: string
  setName: string
  era: string
  releaseDate: string
}
