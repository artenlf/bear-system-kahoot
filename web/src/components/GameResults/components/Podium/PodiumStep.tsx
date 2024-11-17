export function PodiumStep({ player, position }: { player?: { name: string; score: number }, position: number }) {
  const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-16' }
  const colors = {
    1: 'bg-yellow-400',
    2: 'bg-gray-300',
    3: 'bg-yellow-600'
  }

  const medals = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-2">
        <p className="text-2xl font-bold">{player?.name || 'N/A'}</p>
        <p className="text-lg text-muted-foreground">{player?.score} pontos</p>
      </div>
      <div className={`w-24 ${heights[position as keyof typeof heights]} ${colors[position as keyof typeof colors]} rounded-t-lg flex items-center justify-center`}>
        <span className="text-4xl font-bold text-white">{medals[position as keyof typeof medals]}</span>
      </div>
    </div>
  )
}