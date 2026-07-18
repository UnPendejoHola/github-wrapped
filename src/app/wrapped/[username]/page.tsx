'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchWrappedData, WrappedData, getLangColor } from '@/lib/github'

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-6 py-3 shadow-2xl shadow-purple-500/20 backdrop-blur-xl">
          <p className="flex items-center gap-2 text-sm font-medium text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/5 blur-[150px]" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-pink-600/5 blur-[120px]" />
      <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[120px]" />
      <div className="absolute left-1/3 top-2/3 h-[300px] w-[300px] rounded-full bg-amber-600/5 blur-[100px]" />
    </div>
  )
}

export default function WrappedPage() {
  const { username } = useParams<{ username: string }>()
  const [data, setData] = useState<WrappedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ show: false, message: '' })

  useEffect(() => {
    fetchWrappedData(username)
      .then(setData)
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false))
  }, [username])

  function showToast(msg: string) {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: '' }), 2500)
  }

  function goToSlide(i: number) {
    setSlide(i)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <BackgroundEffects />
        <div className="relative text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 px-10 py-4 backdrop-blur-sm">
              <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
                Wrapped
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            {[0, 150, 300].map((d, i) => (
              <div key={i} className="h-2.5 w-2.5 animate-bounce rounded-full"
                style={{ animationDelay: `${d}ms`, backgroundColor: ['#a855f7', '#ec4899', '#06b6d4'][i] }} />
            ))}
          </div>
          <p className="mt-5 text-sm text-zinc-500">Cargando datos de {username}...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4">
        <BackgroundEffects />
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
    <OutroSlide key="outro" data={data} onShare={() => {
      const url = `https://github-wrapped-delta.vercel.app/wrapped/${data.user.login}`
      navigator.clipboard.writeText(url)
      showToast('Link copiado al portapapeles!')
    }} />,
  ]

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      <BackgroundEffects />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
        <div className="rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 backdrop-blur-sm">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goToSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' : 'w-2 bg-zinc-700 hover:bg-zinc-600'}`} />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="flex w-full max-w-3xl flex-col items-center px-6"
        >
          {slides[slide]}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button onClick={() => goToSlide(Math.max(0, slide - 1))} disabled={slide === 0}
          className="group flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-3 text-sm text-zinc-500 backdrop-blur-sm transition-all hover:border-zinc-700 hover:text-zinc-200 disabled:opacity-20 disabled:hover:border-zinc-800 disabled:hover:text-zinc-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
        <span className="text-xs text-zinc-700 w-8 text-center">{slide + 1}/{slides.length}</span>
        <button onClick={() => goToSlide(Math.min(slides.length - 1, slide + 1))} disabled={slide === slides.length - 1}
          className="group flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-3 text-sm text-zinc-500 backdrop-blur-sm transition-all hover:border-zinc-700 hover:text-zinc-200 disabled:opacity-20 disabled:hover:border-zinc-800 disabled:hover:text-zinc-500">
          Siguiente
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <Toast message={toast.message} show={toast.show} />
    </div>
  )
}

function CoverSlide({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 12 }}>
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-lg" />
          <img src={data.user.avatar_url} alt="" className="relative h-28 w-28 rounded-full border-4 border-zinc-800" />
        </div>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mt-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
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
      {data.user.bio && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-4 max-w-md text-sm text-zinc-600 italic">
          &ldquo;{data.user.bio}&rdquo;
        </motion.p>
      )}
    </div>
  )
}

function StatsSlide({ data }: { data: WrappedData }) {
  const stats = [
    { label: 'Contribuciones', value: data.totalContributions.toLocaleString(), color: 'from-purple-500 to-purple-600', icon: '📊' },
    { label: 'Repositorios', value: data.repos.length.toString(), color: 'from-pink-500 to-pink-600', icon: '📦' },
    { label: 'Seguidores', value: data.user.followers.toLocaleString(), color: 'from-cyan-500 to-cyan-600', icon: '👥' },
    { label: 'Estrellas', value: data.repos.reduce((s, r) => s + r.stargazers_count, 0).toString(), color: 'from-amber-500 to-amber-600', icon: '⭐' },
  ]
  return (
    <div className="flex flex-col items-center py-16">
      <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-3xl font-bold text-zinc-100">Tus numeros</motion.h2>
      <div className="grid w-full grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
            whileHover={{ scale: 1.03 }}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center backdrop-blur-sm transition-all hover:border-zinc-700">
            <span className="text-2xl mb-2 block">{s.icon}</span>
            <div className={`inline-block rounded-xl bg-gradient-to-r ${s.color} px-3 py-0.5 text-xs font-medium text-white mb-3`}>
              {s.label}
            </div>
            <p className="text-4xl font-black text-zinc-100 group-hover:scale-110 transition-transform">{s.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function LanguagesSlide({ data }: { data: WrappedData }) {
  const maxCount = Math.max(...data.topLanguages.map((l) => l.count), 1)
  return (
    <div className="flex w-full flex-col items-center py-16">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="mb-10 text-3xl font-bold text-zinc-100">Lenguajes mas usados</motion.h2>
      <div className="flex w-full flex-col gap-4">
        {data.topLanguages.map((lang, i) => (
          <motion.div key={lang.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4">
            <span className="w-20 text-right text-sm text-zinc-400">{lang.name}</span>
            <div className="flex-1">
              <div className="h-6 overflow-hidden rounded-full bg-zinc-800">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(lang.count / maxCount) * 100}%` }}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full shadow-lg"
                  style={{ backgroundColor: lang.color }}
                />
              </div>
            </div>
            <span className="w-10 text-right text-sm font-semibold text-zinc-500">{lang.count}</span>
          </motion.div>
        ))}
      </div>
      {data.topLanguages.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {data.topLanguages.map((l) => (
            <span key={l.name} className="flex items-center gap-1.5 rounded-full bg-zinc-800/50 px-3.5 py-1.5 text-xs text-zinc-400">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              {l.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function StreakSlide({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="mb-10 text-3xl font-bold text-zinc-100">Racha</motion.h2>
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
          className="mt-6 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
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
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="mb-8 text-3xl font-bold text-zinc-100">Top repos</motion.h2>
      {top.length === 0 ? (
        <p className="text-zinc-600">No hay repositorios publicos</p>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {top.map((repo, i) => (
            <motion.a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-800/50">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-200 group-hover:text-purple-400 transition-colors truncate">
                    {i + 1}. {repo.name}
                  </p>
                  {repo.description && <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{repo.description}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm text-zinc-600">
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
      )}
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
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="mb-8 text-3xl font-bold text-zinc-100">Contribuciones</motion.h2>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="w-full overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
        <div className="flex gap-[3px]" style={{ minWidth: weeks.length * 17 }}>
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {w.days.map((d, di) => (
                <div key={di}
                  className="h-[13px] w-[13px] rounded-sm transition-all hover:scale-150 hover:ring-1 hover:ring-zinc-500"
                  style={{ backgroundColor: colors[d.level] || colors[0] }}
                  title={`${d.count} contribuciones`}
                />
              ))}
            </div>
          ))}
        </div>
      </motion.div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-600">
        <span>Menos</span>
        {colors.map((c, i) => <div key={i} className="h-[13px] w-[13px] rounded-sm" style={{ backgroundColor: c }} />)}
        <span>Mas</span>
      </div>
      <p className="mt-6 text-sm text-zinc-600">
        Total: <strong className="text-zinc-300">{data.totalContributions.toLocaleString()}</strong> contribuciones en el ultimo año
      </p>
    </div>
  )
}

function OutroSlide({ data, onShare }: { data: WrappedData; onShare: () => void }) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div className="relative mb-8 inline-flex items-center justify-center">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl" />
          <div className="relative rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 px-10 py-4 backdrop-blur-sm">
            <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
              Wrapped
            </h1>
          </div>
        </div>
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-lg text-zinc-400">
        Eso fue todo para <strong className="text-zinc-200">{data.user.name || data.user.login}</strong>
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-10 flex gap-4">
        <a href="/"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm text-zinc-400 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:text-zinc-200">
          Probar otro usuario
        </a>
        <button onClick={onShare}
          className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95">
          Compartir
        </button>
      </motion.div>
    </div>
  )
}
