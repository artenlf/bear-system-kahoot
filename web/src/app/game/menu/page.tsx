'use client'

import Lobby from "@/components/Lobby"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/authStore"
import { useRoomStore } from "@/store/roomStore"
import { LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function MenuPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { createRoom } = useRoomStore()
  const [gameState, setGameState] = useState<'menu' | 'create' | 'join' | 'lobby'>('menu')
  const [gameCode, setGameCode] = useState('')

  const handleCreateGame = async () => {
    if (user) {
      try {
        const roomId = await createRoom(user.uid);
        router.push(`/game/lobby/${roomId}`);
      } catch (error) {
        console.error('Error creating room:', error);
      }
    }
  };

  const handleJoinGame = async (code: string) => {
    if (user && code) {
      try {
        router.push(`/game/lobby/${code.toUpperCase()}`);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    }
  };

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {gameState === 'lobby' ? 'Aguardando jogadores' : 'Bem-vindo ao SabeTudo!'}
          </CardTitle>
          <span className="text-sm">
            {gameState === 'lobby'
              ? 'compartilhe o código abaixo com seus amigos!'
              : 'Para começar, escolha entre:'}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="absolute right-8 top-4" variant="ghost" size="icon">
                <Avatar>
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'Unknown'} />
                  <AvatarFallback>{(user?.displayName || 'Unknown').slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {gameState === 'menu' && (
            <div className="space-y-4">
              <Button onClick={() => handleCreateGame()} className="w-full py-8 bg-blue-800 font-semibold hover:bg-blue-600">
                Criar um novo jogo
              </Button>
              <Button onClick={() => setGameState('join')} variant="outline" className="w-full py-8 font-semibold border-blue-800 hover:border-blue-600">
                Entrar em um jogo
              </Button>
            </div>
          )}
          {gameState === 'join' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Digite o código da sala"
                className="w-full py-6 px-2 text-3xl text-center rounded border border-blue-800 focus-within:outline-blue-500"
                onChange={(e) => setGameCode(e.target.value)}
              />
              <Button onClick={() => handleJoinGame(gameCode)} className="w-full py-8 bg-blue-800 font-semibold hover:bg-blue-600">
                Entrar
              </Button>
              <Button onClick={() => setGameState('menu')} variant="outline" className="w-full font-semibold border-blue-800 hover:border-blue-600">
                Voltar
              </Button>
            </div>
          )}
          {gameState === 'lobby' && user && (
            <Lobby
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}