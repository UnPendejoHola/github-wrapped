export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface Repo {
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  html_url: string
  topics: string[]
}

export interface ContributionDay {
  date: string
  count: number
  level: number
}

export interface WrappedData {
  user: GitHubUser
  repos: Repo[]
  contributions: ContributionDay[]
  totalContributions: number
  topLanguages: { name: string; count: number; color: string }[]
  longestStreak: number
  currentStreak: number
  bestDay: { date: string; count: number }
  mostStarredRepo: Repo | null
  repoWithMostLang: { name: string; languages: { name: string; bytes: number }[] } | null
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6', JavaScript: '#F7DF1E', Python: '#3776AB',
  Java: '#ED8B00', Rust: '#DEA584', Go: '#00ADD8', Ruby: '#CC342D',
  PHP: '#777BB4', C: '#555555', 'C++': '#F34B7D', 'C#': '#178600',
  HTML: '#E34F26', CSS: '#563D7C', Shell: '#89E051', Swift: '#F05138',
  Kotlin: '#A97BFF', Dart: '#00B4AB', Lua: '#000080', Scala: '#DC322F',
  Elixir: '#4E2A59', Haskell: '#5E5086', SQL: '#E38C00',
}

export function getLangColor(lang: string): string {
  return LANG_COLORS[lang] || '#6B7280'
}

export async function fetchWrappedData(username: string): Promise<WrappedData> {
  const headers = { 'User-Agent': 'github-wrapped-app' }

  const userRes = await fetch(`https://api.github.com/users/${username}`, { headers })
  if (!userRes.ok) throw new Error('User not found')
  const user: GitHubUser = await userRes.json()

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`, { headers })
  const repos: Repo[] = await reposRes.json()

  const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, { headers })
  let contributions: ContributionDay[] = []
  let totalContributions = 0
  let longestStreak = 0
  let currentStreak = 0
  let bestDay = { date: '', count: 0 }

  if (contribRes.ok) {
    const contribData = await contribRes.json()
    const days: ContributionDay[] = (contribData.contributions || []).map((d: any) => ({
      date: d.date,
      count: d.count || d.intensity || 0,
      level: d.level || 0,
    }))
    contributions = days
    totalContributions = days.reduce((sum, d) => sum + d.count, 0)

    let streak = 0
    for (const d of days) {
      if (d.count > 0) { streak++; if (streak > longestStreak) longestStreak = streak }
      else streak = 0
      if (d.count > bestDay.count) { bestDay = { date: d.date, count: d.count } }
    }
    const reversed = [...days].reverse()
    currentStreak = 0
    for (const d of reversed) {
      if (d.count > 0) currentStreak++
      else break
    }
  }

  const langCount: Record<string, number> = {}
  for (const repo of repos) {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1
    }
  }
  const topLanguages = Object.entries(langCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, count]) => ({ name, count, color: getLangColor(name) }))

  const sortedByStars = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)
  const mostStarredRepo = sortedByStars[0] || null

  return {
    user,
    repos,
    contributions,
    totalContributions,
    topLanguages,
    longestStreak,
    currentStreak,
    bestDay,
    mostStarredRepo,
    repoWithMostLang: null,
  }
}
