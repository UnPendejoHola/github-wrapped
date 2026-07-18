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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950">
      <div className="pointer-events-none fixed inset-0">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
          className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-[100px]" />
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
          className="absolute right-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-[80px]" />
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
          className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-amber-600/10 blur-[90px]" />
      </div>

      <div className="relative w-full max-w-lg px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-4 text-center">
          <div className="mb-2 inline-block rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-1 text-xs font-medium text-purple-300 border border-purple-500/20">
            GitHub Wrapped
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-7xl font-black tracking-tight sm:text-8xl">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Wrapped
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mt-3 text-center text-lg text-zinc-500">
          Tu año en GitHub, en una experiencia visual
        </motion.p>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onSubmit={handleSubmit} className="mt-10">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-lg transition-all duration-300 group-focus-within:opacity-40" />
            <div className="relative flex items-center rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-300 group-focus-within:border-purple-500/50">
              <span className="pl-5 text-lg text-zinc-500">github.com/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="usuario"
                className="flex-1 bg-transparent py-5 pr-4 text-lg text-zinc-100 outline-none placeholder:text-zinc-700"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading || !username.trim()}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generando...
              </span>
            ) : (
              'Ver mi Wrapped'
            )}
          </button>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-sm text-red-400">
              {error}
            </motion.p>
          )}
        </motion.form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-6 text-xs text-zinc-700">
          <span>Contribuciones</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span>Lenguajes</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span>Rachas</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span>Repos</span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-8 text-center">
          <p className="text-xs text-zinc-800">
            Hecho con Next.js + GitHub API
          </p>
        </motion.div>
      </div>
    </div>
  )
}
