import { PodiumStep } from "./PodiumStep";

export function StandardPodium({ players }: { players: { name: string; score: number }[] }) {
  const podiumOrder = [1, 0, 2]
  return (
    <div className="flex justify-center items-end space-x-4">
      {podiumOrder.map((index) => (
        <PodiumStep key={index} player={players[index]} position={index === 0 ? 1 : index === 1 ? 2 : 3} />
      ))}
    </div>
  )
}