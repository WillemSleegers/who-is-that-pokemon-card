import { useState } from "react"

import type { HintKind } from "@/lib/hints"
import { GameBoard } from "@/components/GameBoard"
import { StartScreen } from "@/components/StartScreen"

function App() {
  const [enabledHints, setEnabledHints] = useState<Set<HintKind> | null>(null)

  return (
    <main className="min-h-svh bg-background">
      {enabledHints ? (
        <GameBoard enabledHints={enabledHints} />
      ) : (
        <StartScreen onStart={setEnabledHints} />
      )}
    </main>
  )
}

export default App
