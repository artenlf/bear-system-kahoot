"use client"
import { useState } from "react"

export default function RegistroQuiz() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [passWord, setPassWord] = useState("")
    const [acceptTerm, setAcceptTerm] = useState(false)
    const [erro, setErro] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = regexEmail.test(email)

        if (!name || !email || !passWord) {
            setErro("Por favor, preencha todos os campos.")
            return
        }

        if (!acceptTerm) {
            setErro("Você precisa aceitar os termos de serviço.")
            return
        }

        if (isValid) {
            setErro('Formato de E-mail incorreto')
            return
        }

        // Here you would add the logic to send the form data to your backend.
        console.log("Formulário enviado", { nome: name, email, senha: passWord, aceitouTermos: acceptTerm })
        // Reset form or redirect user after successful registration
        setName("")
        setEmail("")
        setPassWord("")
        setAcceptTerm(false)
        setErro("")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-black">Registro para o Quiz KaHoot</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome
                        </label>
                        <input
                            id="nome"
                            type="text"
                            placeholder="Seu nome completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
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
                            placeholder="Escolha uma senha forte"
                            value={passWord}
                            onChange={(e) => setPassWord(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="termos"
                            checked={acceptTerm}
                            onChange={(e) => setAcceptTerm(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="termos" className="text-sm text-gray-700">
                            Eu aceito os termos de serviço e a política de privacidade
                        </label>
                    </div>
                    {erro && (
                        <div className="flex items-center space-x-2 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{erro}</span>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    )
}