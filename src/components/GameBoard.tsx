import { useMemo, useRef, useState } from "react"

import cardsData from "@/data/cards.json"
import type { GameCard } from "@/types/card"
import { createDeck } from "@/lib/deck"
import { buildHints, type Hint } from "@/lib/hints"
import { scoreForGuess } from "@/lib/scoring"
import { isCorrectGuess } from "@/lib/matching"

import { GuessInput } from "@/components/GuessInput"
import { HintPanel } from "@/components/HintPanel"
import { HintButton } from "@/components/HintButton"
import { RevealCard } from "@/components/RevealCard"
import { ScoreBar } from "@/components/ScoreBar"
import { Button } from "@/components/ui/button"

const cards = cardsData as GameCard[]

interface Round {
  card: GameCard
  hints: Hint[]
  hintsRevealed: number
}

function newRound(card: GameCard): Round {
  return { card, hints: buildHints(card), hintsRevealed: 1 }
}

export function GameBoard() {
  const deckRef = useRef(createDeck(cards))
  const names = useMemo(() => [...cards.map((c) => c.name)].sort(), [])

  const [round, setRound] = useState<Round>(() => newRound(deckRef.current.next()))
  const [status, setStatus] = useState<"guessing" | "solved" | "given-up">("guessing")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [lastPoints, setLastPoints] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  const allHintsRevealed = round.hintsRevealed >= round.hints.length

  function handleGuess(name: string) {
    if (isCorrectGuess(name, round.card.name)) {
      const points = scoreForGuess(round.hintsRevealed, round.hints.length)
      setLastPoints(points)
      setTotalScore((prev) => prev + points)
      setStatus("solved")
      setFeedback(null)
    } else {
      setFeedback(`"${name}" isn't it — try again.`)
    }
  }

  function handleRevealHint() {
    setRound((prev) => ({
      ...prev,
      hintsRevealed: Math.min(prev.hintsRevealed + 1, prev.hints.length),
    }))
    setFeedback(null)
  }

  function handleGiveUp() {
    setLastPoints(0)
    setStatus("given-up")
    setFeedback(null)
  }

  function handleNext() {
    setRound(newRound(deckRef.current.next()))
    setStatus("guessing")
    setFeedback(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <ScoreBar totalScore={totalScore} />

      {status === "guessing" ? (
        <>
          <HintPanel hints={round.hints} revealedCount={round.hintsRevealed} />
          <GuessInput names={names} onGuess={handleGuess} />
          {feedback && <p className="text-center text-sm text-destructive">{feedback}</p>}
          <HintButton onReveal={handleRevealHint} disabled={allHintsRevealed} />
          {allHintsRevealed && (
            <Button variant="ghost" className="w-full" onClick={handleGiveUp}>
              Give up / reveal answer
            </Button>
          )}
        </>
      ) : (
        <RevealCard card={round.card} points={lastPoints} onNext={handleNext} />
      )}
    </div>
  )
}
