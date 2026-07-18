'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const u = username.trim()
    if (!u) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`https://api.github.com/users/${u}`, {
        headers: { 'User-Agent': 'github-wrapped' },
      })
      if (!res.ok) { setError('Usuario no encontrado'); setLoading(false); return }
      router.push(`/wrapped/${u}`)
    } catch { setError('Error al conectar'); setLoading(false) }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-pink-600/10 blur-[120px]" />
        <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative text-center">
        <div className="mb-8 inline-flex items-center justify-center">
          <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 px-8 py-3 backdrop-blur-sm">
            <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl">
              Wrapped
            </h1>
          </div>
        </div>
        <p className="mb-10 text-lg text-zinc-500">Tu año en GitHub, en una experiencia visual</p>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">@</span>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="usuario"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 py-4 pl-8 pr-4 text-lg text-zinc-100 outline-none backdrop-blur-sm transition-colors placeholder:text-zinc-600 focus:border-purple-500" />
            </div>
            <button type="submit" disabled={loading || !username.trim()}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100">
              {loading ? (
                <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : 'Ver Wrapped'}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </form>

        <p className="mt-12 text-xs text-zinc-700">Ingresa tu usuario de GitHub y descubre tu wrapped</p>
      </motion.div>
    </div>
  )
}
