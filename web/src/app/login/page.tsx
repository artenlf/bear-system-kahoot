'use client'

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthTest() {
  const router = useRouter();
  const { login, logout, user, loading, error, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">{isAuthenticated ? 'Bem-vindo' : 'Login'}</h2>
        {isAuthenticated ? (
          <div className="flex flex-col space-y-8 text-center">
            <span className='text-green-600 text-3xl font-bold'>{user?.displayName}</span>
            <button
              onClick={() => router.push('/game')}
              className="w-full bg-blue-500 text-white py-4 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Iniciando um novo jogo...' : 'Iniciar novo jogo'}
            </button>
            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              disabled={loading}
            >
              {loading ? 'Saindo...' : 'Sair'}
            </button>
          </div>

        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mb-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Credenciais inválidas! Por favor, tente novamente.</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Entrar
            </button>
            <div className='w-full flex flex-col items-center gap-2'>
              <span>------------------------</span>
              <p className='text-zinc-400 text-sm'>Ainda não tem conta?

              </p>
              <Link
                href={'/register'}
                className="text-blue-500 underline hover:text-blue-700"
              >
                Registre-se
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};