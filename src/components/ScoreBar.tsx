import { Badge } from "@/components/ui/badge"

interface ScoreBarProps {
  totalScore: number
}

export function ScoreBar({ totalScore }: ScoreBarProps) {
  return (
    <div className="flex items-center justify-end">
      <Badge variant="secondary" className="text-sm">
        Score: {totalScore}
      </Badge>
    </div>
  )
}
