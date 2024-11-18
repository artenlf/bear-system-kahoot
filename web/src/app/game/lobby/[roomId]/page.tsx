'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/authStore"
import { useRoomStore } from "@/store/roomStore"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"

export default function LobbyPage({ params }: { params: Promise<{ roomId: string }> }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()
  const { activeRoom, participants, joinRoom, exitRoom, beginQuiz } = useRoomStore()
  const resolvedParams = use(params)
  const isHost = activeRoom?.hostId === user?.uid

  useEffect(() => {
    const initializeLobby = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      if (resolvedParams.roomId) {
        try {
          await joinRoom(resolvedParams.roomId, {
            id: user.uid,
            name: user.displayName || 'Unknown',
            score: 0,
            disconnected: false
          })
        } catch (error) {
          console.error('Error joining room:', error)
          router.push('/game/menu')
        }
      }
    }

    initializeLobby()
  }, [resolvedParams.roomId, user, joinRoom, router])

  useEffect(() => {
    if (activeRoom?.status === 'playing') {
      router.push(`/game/room/${resolvedParams.roomId}`)
    }
  }, [activeRoom?.status, router, resolvedParams.roomId])

  async function handleStartGame() {
    try {
      setIsLoading(true);
      toast({
        title: "Gerando questões...",
        description: "Isso pode levar alguns segundos.",
        duration: 3000,
      });

      if (!activeRoom?.id) {
        throw new Error("Sala não encontrada");
      }

      const success = await beginQuiz(activeRoom.id);
      if (!success) {
        throw new Error("Não foi possível iniciar o quiz");
      }

    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao iniciar o jogo.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleLeave = async () => {
    if (activeRoom && user) {
      await exitRoom(activeRoom.id, user.uid)
      router.push('/menu')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-white rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">ID da sala</h2>
          <div className="text-4xl font-bold tracking-wider bg-gray-100 rounded-lg py-2">
            {resolvedParams.roomId}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Jogadores ({participants.length}/8)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-2 bg-gray-100 rounded-lg p-2"
              >
                <Avatar>
                  <AvatarFallback>
                    {participant.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{participant.name}</span>
              </div>
            ))}
            {Array.from({ length: 8 - participants.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center gap-2 bg-gray-100 rounded-lg p-2"
              >
                <Avatar>
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-400">Aguardando...</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button onClick={handleLeave} variant="outline">
            Sair da sala
          </Button>
          {isHost && (
            <Button
              onClick={handleStartGame}
              disabled={participants.length < 2 || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Gerando perguntas...
                </>
              ) : (
                'Iniciar jogo'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}