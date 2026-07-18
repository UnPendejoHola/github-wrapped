'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchWrappedData, WrappedData, getLangColor } from '@/lib/github'

const SLIDE_COLORS = [
  { from: '#7c3aed', to: '#db2777' },
  { from: '#2563eb', to: '#06b6d4' },
  { from: '#7c3aed', to: '#a855f7' },
  { from: '#f59e0b', to: '#ef4444' },
  { from: '#ec4899', to: '#8b5cf6' },
  { from: '#059669', to: '#10b981' },
  { from: '#6366f1', to: '#ec4899' },
]

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 rounded-full bg-zinc-900/90 border border-zinc-800 px-6 py-3 shadow-2xl backdrop-blur-xl">
          <p className="flex items-center gap-2 text-sm text-zinc-200">
            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
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

  function next() { setSlide((s) => Math.min(s + 1, 6)) }
  function prev() { setSlide((s) => Math.max(0, s - 1)) }

  const c = SLIDE_COLORS[slide]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#0f0f0f' }}>
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">Wrapped</h1>
          <div className="mt-8 flex justify-center gap-1.5">
            {[0,0.15,0.3].map((d,i) => (
              <div key={i} className="h-2.5 w-2.5 animate-bounce rounded-full bg-zinc-600" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-600">Cargando datos de {username}...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-4" style={{ background: '#0f0f0f' }}>
        <p className="text-5xl">😿</p>
        <p className="text-zinc-500">{error || 'Error'}</p>
        <a href="/" className="rounded-full bg-zinc-800 px-6 py-2.5 text-sm text-zinc-300">Volver</a>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden select-none" style={{ background: '#0f0f0f' }}>
      <div className="absolute inset-0 transition-colors duration-700" style={{ background: `radial-gradient(ellipse at center, ${c.from}22 0%, transparent 70%)` }} />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-1.5">
          {Array.from({length:7}).map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
      </div>

      <button className="absolute inset-0 z-10 w-full cursor-pointer" onClick={next} />

      <AnimatePresence mode="wait">
        <motion.div key={slide} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.35 }}
          className="relative z-10 flex h-full w-full items-center justify-center px-8">
          {slide === 0 && <CoverSlide data={data} />}
          {slide === 1 && <StatsSlide data={data} />}
          {slide === 2 && <LanguagesSlide data={data} />}
          {slide === 3 && <StreakSlide data={data} />}
          {slide === 4 && <ReposSlide data={data} />}
          {slide === 5 && <GraphSlide data={data} />}
          {slide === 6 && <OutroSlide data={data} onShare={() => { navigator.clipboard.writeText(`https://github-wrapped-delta.vercel.app/wrapped/${data.user.login}`); showToast('Link copiado!') }} />}
        </motion.div>
      </AnimatePresence>

      {slide > 0 && (
        <button onClick={(e) => { e.stopPropagation(); prev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      {slide < 6 && (
        <button onClick={(e) => { e.stopPropagation(); next() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      )}

      <Toast message={toast.message} show={toast.show} />
    </div>
  )
}

function CoverSlide({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center text-center max-w-lg">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 12 }}>
        <div className="relative mx-auto mb-8">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 blur-xl" />
          <img src={data.user.avatar_url} alt="" className="relative h-24 w-24 rounded-full border-2 border-white/10" />
        </div>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white">
        {data.user.name || data.user.login}
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-3 text-lg text-white/50">
        Esto es tu GitHub Wrapped
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="mt-1 text-sm text-white/30">
        @{data.user.login} &mdash; {new Date(data.user.created_at).getFullYear()} - {new Date().getFullYear()}
      </motion.p>
    </div>
  )
}

function StatsSlide({ data }: { data: WrappedData }) {
  const items = [
    { label: 'Contribuciones', value: data.totalContributions.toLocaleString(), emoji: '📊' },
    { label: 'Repos', value: data.repos.length.toString(), emoji: '📦' },
    { label: 'Seguidores', value: data.user.followers.toLocaleString(), emoji: '👥' },
    { label: 'Estrellas', value: data.repos.reduce((s, r) => s + r.stargazers_count, 0).toLocaleString(), emoji: '⭐' },
  ]
  return (
    <div className="flex flex-col items-center max-w-lg w-full">
      <h2 className="text-2xl font-bold text-white/80 mb-10">Tus numeros</h2>
      <div className="grid w-full grid-cols-2 gap-4">
        {items.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
            className="rounded-2xl bg-white/5 p-6 text-center backdrop-blur-sm border border-white/5">
            <span className="text-2xl mb-2 block">{item.emoji}</span>
            <p className="text-3xl font-bold text-white">{item.value}</p>
            <p className="mt-1 text-xs text-white/40">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function LanguagesSlide({ data }: { data: WrappedData }) {
  const maxCount = Math.max(...data.topLanguages.map((l) => l.count), 1)
  return (
    <div className="flex flex-col items-center max-w-lg w-full">
      <h2 className="text-2xl font-bold text-white/80 mb-8">Lenguajes</h2>
      <div className="w-full space-y-3">
        {data.topLanguages.map((lang, i) => (
          <motion.div key={lang.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3">
            <span className="w-16 text-right text-sm text-white/50">{lang.name}</span>
            <div className="flex-1 h-5 rounded-full bg-white/5 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(lang.count / maxCount) * 100}%` }}
                transition={{ delay: i * 0.08 + 0.3, duration: 0.5 }}
                className="h-full rounded-full" style={{ backgroundColor: lang.color }} />
            </div>
            <span className="w-8 text-right text-sm font-semibold text-white/40">{lang.count}</span>
          </motion.div>
        ))}
      </div>
      {data.topLanguages.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {data.topLanguages.map((l) => (
            <span key={l.name} className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
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
    <div className="flex flex-col items-center text-center max-w-lg w-full">
      <h2 className="text-2xl font-bold text-white/80 mb-8">Racha</h2>
      <div className="grid w-full grid-cols-2 gap-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="rounded-2xl bg-white/5 p-8 border border-white/5">
          <p className="text-sm text-white/40 mb-2">Mejor racha</p>
          <p className="text-5xl font-bold text-white">{data.longestStreak}</p>
          <p className="mt-1 text-xs text-white/30">dias seguidos</p>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
          className="rounded-2xl bg-white/5 p-8 border border-white/5">
          <p className="text-sm text-white/40 mb-2">Racha actual</p>
          <p className="text-5xl font-bold text-white">{data.currentStreak}</p>
          <p className="mt-1 text-xs text-white/30">dias</p>
        </motion.div>
      </div>
      {data.bestDay.count > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-6 w-full rounded-2xl bg-white/5 p-5 border border-white/5">
          <p className="text-xs text-white/40">Mejor dia</p>
          <p className="mt-1 text-lg font-semibold text-white">{data.bestDay.count} contribuciones</p>
          <p className="text-xs text-white/30">{data.bestDay.date}</p>
        </motion.div>
      )}
    </div>
  )
}

function ReposSlide({ data }: { data: WrappedData }) {
  const top = [...data.repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5)
  return (
    <div className="flex flex-col items-center max-w-lg w-full">
      <h2 className="text-2xl font-bold text-white/80 mb-6">Top repos</h2>
      {top.length === 0 ? (
        <p className="text-white/40">Sin repos publicos</p>
      ) : (
        <div className="w-full space-y-2">
          {top.map((repo, i) => (
            <motion.a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="block rounded-2xl bg-white/5 p-4 border border-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-white truncate">{i+1}. {repo.name}</p>
                <span className="flex items-center gap-1 text-xs text-white/40 shrink-0">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  {repo.stargazers_count}
                </span>
              </div>
              {repo.description && <p className="mt-1 text-xs text-white/40 line-clamp-1">{repo.description}</p>}
            </motion.a>
          ))}
        </div>
      )}
    </div>
  )
}

function GraphSlide({ data }: { data: WrappedData }) {
  const weeks: { days: { level: number }[] }[] = []
  let week: { level: number }[] = []
  const colors = ['#1a1a2e', '#0e4429', '#006d32', '#26a641', '#39d353']

  data.contributions.forEach((d, i) => {
    week.push({ level: d.level })
    if (week.length === 7 || i === data.contributions.length - 1) { weeks.push({ days: week }); week = [] }
  })

  return (
    <div className="flex flex-col items-center max-w-lg w-full">
      <h2 className="text-2xl font-bold text-white/80 mb-6">Contribuciones</h2>
      <div className="w-full overflow-x-auto rounded-2xl bg-white/5 p-4 border border-white/5">
        <div className="flex gap-[2px]" style={{ minWidth: Math.max(weeks.length * 15, 200) }}>
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {w.days.map((d, di) => (
                <div key={di} className="h-[11px] w-[11px] rounded-sm" style={{ backgroundColor: colors[d.level] || colors[0] }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-white/30">
        <span>Menos</span>
        {colors.map((c, i) => <div key={i} className="h-[11px] w-[11px] rounded-sm" style={{ backgroundColor: c }} />)}
        <span>Mas</span>
      </div>
      <p className="mt-4 text-sm text-white/50">
        <strong className="text-white">{data.totalContributions.toLocaleString()}</strong> en el ultimo año
      </p>
    </div>
  )
}

function OutroSlide({ data, onShare }: { data: WrappedData; onShare: () => void }) {
  return (
    <div className="flex flex-col items-center text-center max-w-lg">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 150 }}>
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl" />
          <div className="relative rounded-3xl border border-white/10 bg-white/5 px-8 py-3 backdrop-blur-sm">
            <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-4xl font-black tracking-tight text-transparent">Wrapped</h1>
          </div>
        </div>
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-lg text-white/60">
        Eso fue todo para <strong className="text-white">{data.user.name || data.user.login}</strong>
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-8 flex gap-3">
        <a href="/" className="rounded-full bg-white/10 px-6 py-2.5 text-sm text-white/60 hover:bg-white/20 transition-all">Otro usuario</a>
        <button onClick={onShare} className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white/90 transition-all">Compartir</button>
      </motion.div>
    </div>
  )
}
