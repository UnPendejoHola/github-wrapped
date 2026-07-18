# GitHub Wrapped

Tus estadisticas de GitHub en una experiencia visual estilo Spotify Wrapped. 7 slides con animaciones, colores y datos de tu perfil.

## Como funciona

Entra con tu usuario de GitHub y la app genera automaticamente:
- Tus contribuciones del ultimo año
- Lenguajes mas usados con graficos
- Rachas de contribuciones
- Mejores repositorios
- Stats generales

Los datos se obtienen de la API publica de GitHub y de github-contributions-api.

## Slides

| Slide | Que muestra |
|-------|-------------|
| Cover | Avatar, nombre, años en GitHub |
| Stats | Contribuciones, repos, seguidores, estrellas |
| Lenguajes | Top lenguajes con barras animadas |
| Racha | Mejor racha, racha actual, mejor dia |
| Repos | Top 5 repos por estrellas |
| Grafico | Mapa de contribuciones del año |
| Outro | Compartir o probar otro usuario |

## Pruebalo

https://github-wrapped-delta.vercel.app

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- GitHub REST API

## Local

```bash
git clone https://github.com/UnPendejoHola/github-wrapped
cd github-wrapped
npm install
npm run dev
```

Abre http://localhost:3000 y pon tu usuario de GitHub.

## Deploy

Conecta el repo a Vercel. No necesita base de datos ni variables de entorno.
