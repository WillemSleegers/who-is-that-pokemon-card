import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ScoreBarProps {
  totalScore: number
  onExit: () => void
}

export function ScoreBar({ totalScore, onExit }: ScoreBarProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="sm" onClick={onExit}>
        New Game
      </Button>
      <Badge variant="secondary" className="text-sm">
        Score: {totalScore}
      </Badge>
    </div>
  )
}
