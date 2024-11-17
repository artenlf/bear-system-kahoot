import { PodiumStep } from "./PodiumStep";

export function TwoPlayersPodium({ players }: { players: { name: string; score: number }[] }) {
  return (
    <div className="flex justify-center items-end space-x-8">
      <PodiumStep player={players[0]} position={1} />
      <PodiumStep player={players[1]} position={2} />
    </div>
  )
}