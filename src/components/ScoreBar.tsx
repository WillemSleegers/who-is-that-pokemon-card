import { Badge } from "@/components/ui/badge"

interface ScoreBarProps {
  totalScore: number
}

export function ScoreBar({ totalScore }: ScoreBarProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Who's That Pokémon Card?</h1>
      <Badge variant="secondary" className="text-sm">
        Score: {totalScore}
      </Badge>
    </div>
  )
}
