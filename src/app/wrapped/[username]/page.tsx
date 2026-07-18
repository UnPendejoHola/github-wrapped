'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchWrappedData, WrappedData, getLangColor } from '@/lib/github'

export default function WrappedPage() {
  const { username } = useParams<{ username: string }>()
  const [data, setData] = useState<WrappedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWrappedData(username)
      .then(setData)
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false))
  }, [username])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 px-8 py-3 backdrop-blur-sm">
              <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                Wrapped
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-pink-500" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="mt-4 text-sm text-zinc-600">Cargando datos de {username}...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4">
        <p className="text-6xl">😿</p>
        <p className="text-zinc-500">{error || 'Error desconocido'}</p>
        <a href="/" className="rounded-xl bg-zinc-800 px-6 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-700">Volver</a>
      </div>
    )
  }

  const slides = [
    <CoverSlide key="cover" data={data} />,
    <StatsSlide key="stats" data={data} />,
    <LanguagesSlide key="langs" data={data} />,
    <StreakSlide key="streak" data={data} />,
    <ReposSlide key="repos" data={data} />,
    <GraphSlide key="graph" data={data} />,
    <OutroSlide key="outro" data={data} />,
  ]

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="flex w-full max-w-3xl flex-col items-center px-6"
        >
          {slides[slide]}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => setSlide((s) => Math.max(0, s - 1))}
          disabled={slide === 0}
          className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
        >
          Anterior
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' : 'w-2 bg-zinc-800 hover:bg-zinc-700'}`} />
          ))}
        </div>
        <button
          onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))}
          disabled={slide === slides.length - 1}
          className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

function CoverSlide({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
        <img src={data.user.avatar_url} alt="" className="mb-6 h-28 w-28 rounded-full border-4 border-purple-500/30 shadow-2xl shadow-purple-500/20" />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
        {data.user.name || data.user.login}
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-4 text-lg text-zinc-500">
        Esto es tu GitHub Wrapped
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="mt-2 text-sm text-zinc-700">
        @{data.user.login} &mdash; {new Date(data.user.created_at).getFullYear()} - {new Date().getFullYear()}
      </motion.p>
    </div>
  )
}

function StatsSlide({ data }: { data: WrappedData }) {
  const stats = [
    { label: 'Contribuciones', value: data.totalContributions.toLocaleString(), color: 'from-purple-500 to-purple-600' },
    { label: 'Repos', value: data.repos.length.toString(), color: 'from-pink-500 to-pink-600' },
    { label: 'Seguidores', value: data.user.followers.toLocaleString(), color: 'from-cyan-500 to-cyan-600' },
    { label: 'Estrellas', value: data.repos.reduce((s, r) => s + r.stargazers_count, 0).toString(), color: 'from-amber-500 to-amber-600' },
  ]
  return (
    <div className="flex flex-col items-center py-16">
      <h2 className="mb-12 text-3xl font-bold text-zinc-100">Tus numeros</h2>
      <div className="grid w-full grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center backdrop-blur-sm">
            <div className={`inline-block rounded-xl bg-gradient-to-r ${s.color} px-3 py-1 text-xs font-medium text-white mb-3`}>
              {s.label}
            </div>
            <p className="text-4xl font-black text-zinc-100">{s.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function LanguagesSlide({ data }: { data: WrappedData }) {
  const maxCount = Math.max(...data.topLanguages.map((l) => l.count))
  return (
    <div className="flex w-full flex-col items-center py-16">
      <h2 className="mb-12 text-3xl font-bold text-zinc-100">Lenguajes mas usados</h2>
      <div className="flex w-full flex-col gap-4">
        {data.topLanguages.map((lang, i) => (
          <motion.div key={lang.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4">
            <span className="w-24 text-right text-sm text-zinc-400">{lang.name}</span>
            <div className="flex-1">
              <div className="h-5 overflow-hidden rounded-full bg-zinc-800">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(lang.count / maxCount) * 100}%` }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
              </div>
            </div>
            <span className="w-12 text-right text-sm font-bold text-zinc-500">{lang.count}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 flex gap-2">
        {data.topLanguages.map((l) => (
          <span key={l.name} className="flex items-center gap-1.5 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            {l.name}
          </span>
        ))}
      </div>
    </div>
  )
}

function StreakSlide({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <h2 className="mb-12 text-3xl font-bold text-zinc-100">Racha</h2>
      <div className="grid w-full grid-cols-2 gap-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-purple-500/10 to-transparent p-8">
          <p className="text-sm text-zinc-500 mb-2">Mejor racha</p>
          <p className="text-6xl font-black text-purple-400">{data.longestStreak}</p>
          <p className="mt-1 text-sm text-zinc-600">dias seguidos</p>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
          className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-pink-500/10 to-transparent p-8">
          <p className="text-sm text-zinc-500 mb-2">Racha actual</p>
          <p className="text-6xl font-black text-pink-400">{data.currentStreak}</p>
          <p className="mt-1 text-sm text-zinc-600">dias</p>
        </motion.div>
      </div>
      {data.bestDay.count > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 w-full">
          <p className="text-sm text-zinc-500">Mejor dia</p>
          <p className="mt-1 text-xl font-bold text-zinc-200">{data.bestDay.count} contribuciones</p>
          <p className="text-xs text-zinc-600">{data.bestDay.date}</p>
        </motion.div>
      )}
    </div>
  )
}

function ReposSlide({ data }: { data: WrappedData }) {
  const top = [...data.repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5)
  return (
    <div className="flex w-full flex-col items-center py-16">
      <h2 className="mb-8 text-3xl font-bold text-zinc-100">Top repos</h2>
      <div className="flex w-full flex-col gap-3">
        {top.map((repo, i) => (
          <motion.a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-800/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-zinc-200 group-hover:text-purple-400 transition-colors">
                  {i + 1}. {repo.name}
                </p>
                {repo.description && <p className="mt-1 text-sm text-zinc-600">{repo.description}</p>}
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getLangColor(repo.language) }} />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  {repo.stargazers_count}
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}

function GraphSlide({ data }: { data: WrappedData }) {
  const weeks: { days: { count: number; level: number }[] }[] = []
  let week: { count: number; level: number }[] = []
  const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']

  data.contributions.forEach((d, i) => {
    week.push({ count: d.count, level: d.level })
    if (week.length === 7 || i === data.contributions.length - 1) {
      weeks.push({ days: week })
      week = []
    }
  })

  return (
    <div className="flex w-full flex-col items-center py-16">
      <h2 className="mb-8 text-3xl font-bold text-zinc-100">Contribuciones</h2>
      <div className="w-full overflow-x-auto">
        <div className="flex gap-[3px]">
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {w.days.map((d, di) => (
                <div key={di}
                  className="h-[14px] w-[14px] rounded-sm transition-colors"
                  style={{ backgroundColor: colors[d.level] || colors[0] }}
                  title={`${d.count} contribuciones`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-600">
        <span>Menos</span>
        {colors.map((c, i) => <div key={i} className="h-[14px] w-[14px] rounded-sm" style={{ backgroundColor: c }} />)}
        <span>Mas</span>
      </div>
      <p className="mt-6 text-sm text-zinc-600">
        Total: <strong className="text-zinc-300">{data.totalContributions.toLocaleString()}</strong> contribuciones en el ultimo ano
      </p>
    </div>
  )
}

function OutroSlide({ data }: { data: WrappedData }) {
  const shareText = `Mira mi GitHub Wrapped: ${data.totalContributions} contribuciones, ${data.repos.length} repos, racha de ${data.longestStreak} dias!`

  return (
    <div className="flex flex-col items-center py-20 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div className="mb-6 inline-flex items-center justify-center">
          <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 px-8 py-3 backdrop-blur-sm">
            <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
              Wrapped
            </h1>
          </div>
        </div>
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mt-4 text-lg text-zinc-400">
        Eso fue todo para <strong className="text-zinc-200">{data.user.name || data.user.login}</strong>
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-10 flex gap-4">
        <a href="/"
          className="rounded-xl border border-zinc-800 px-6 py-3 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
          Probar otro usuario
        </a>
        <button onClick={() => {
          navigator.clipboard.writeText(`github-wrapped.vercel.app/wrapped/${data.user.login}`)
          alert('Link copiado!')
        }}
          className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          Compartir
        </button>
      </motion.div>
    </div>
  )
}
