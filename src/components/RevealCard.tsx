import type { GameCard } from "@/types/card"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RevealCardProps {
  card: GameCard
  points: number
  onNext: () => void
}

export function RevealCard({ card, points, onNext }: RevealCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 text-center">
        <img src={card.image} alt={card.name} className="max-h-96 rounded-lg" />
        <CardTitle>{card.name}</CardTitle>
        <Badge variant={points > 0 ? "default" : "outline"}>
          {points > 0 ? `+${points} points` : "0 points"}
        </Badge>
      </CardContent>
      <CardFooter className="justify-center">
        <Button className="w-full" onClick={onNext}>
          Next card
        </Button>
      </CardFooter>
    </Card>
  )
}
