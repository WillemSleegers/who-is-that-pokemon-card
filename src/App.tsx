import { useMemo, useState } from "react"

import cardsData from "@/data/cards.json"
import type { GameCard } from "@/types/card"
import type { HintKind } from "@/lib/hints"
import { groupSetsByEra } from "@/lib/sets"
import { GameBoard } from "@/components/GameBoard"
import { StartScreen } from "@/components/StartScreen"

const cards = cardsData as GameCard[]

interface GameConfig {
  enabledHints: Set<HintKind>
  selectedSets: Set<string>
}

function App() {
  const eraGroups = useMemo(() => groupSetsByEra(cards), [])
  const [config, setConfig] = useState<GameConfig | null>(null)

  return (
    <main className="min-h-svh bg-background">
      {config ? (
        <GameBoard enabledHints={config.enabledHints} selectedSets={config.selectedSets} />
      ) : (
        <StartScreen
          eraGroups={eraGroups}
          onStart={(enabledHints, selectedSets) => setConfig({ enabledHints, selectedSets })}
        />
      )}
    </main>
  )
}

export default App
