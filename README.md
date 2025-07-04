image.png# 🚀 Aprende Next.js: Construyendo una Pokédex

Este tutorial te enseñará los fundamentos de **Next.js** construyendo una aplicación práctica: una Pokédex que consume la PokeAPI. Al final tendrás una aplicación funcional y comprenderás los conceptos clave de Next.js.

## 🎯 ¿Qué aprenderás?

- ✅ Crear y configurar un proyecto Next.js desde cero
- ✅ Entender la estructura de carpetas y el App Router
- ✅ Diferencia entre Server Components y Client Components
- ✅ Sistema de rutas dinámicas
- ✅ Consumo de APIs externas
- ✅ Creación de API Routes propias
- ✅ Uso de componentes con ShadCN/UI
- ✅ Mejores prácticas de estructura y organización

## 📋 Requisitos previos

- Node.js (versión 18 o superior)
- Conocimientos básicos de React
- Conocimientos básicos de TypeScript (opcional pero recomendado)

---

## 🛠 Paso 1: Creación del proyecto

Primero, vamos a crear nuestro proyecto Next.js:

```bash
npx create-next-app@latest pokedex-nextjs
cd pokedex-nextjs
```

**Configuración recomendada:**
- ✅ TypeScript: **Yes**
- ✅ ESLint: **Yes** 
- ✅ Tailwind CSS: **Yes**
- ✅ `src/` directory: **Yes**
- ✅ App Router: **Yes** (recommended)
- ❌ Turbopack: **No**
- ❌ Import alias: **No**

Inicia el servidor de desarrollo:
```bash
npm run dev
```

Visita `http://localhost:3000` para ver tu aplicación funcionando.

---

## 📁 Paso 2: Entendiendo la estructura del proyecto

Next.js 13+ usa el **App Router** con esta estructura:

```
pokedex-nextjs/
├── src/                    # 📁 Código fuente
│   ├── app/                # 🎯 Corazón de la aplicación
│   │   ├── page.tsx        # 🏠 Página principal (/)
│   │   ├── layout.tsx      # 📋 Layout global
│   │   ├── globals.css     # 🎨 Estilos globales
│   │   ├── pokemons/       # 📂 Rutas de pokémons
│   │   │   ├── page.tsx    # 📄 Lista (/pokemons)
│   │   │   └── [name]/     # 🔗 Ruta dinámica
│   │   │       └── page.tsx # 📄 Detalle (/pokemons/pikachu)
│   │   └── api/            # 🔌 API Routes
│   │       └── pokemons/   
│   │           └── route.ts # 🛠 Endpoint propio
│   ├── components/         # 🧩 Componentes reutilizables
│   └── lib/                # 🔧 Utilidades y funciones
├── public/                 # 📁 Archivos estáticos
└── ...
```

### 🔍 Conceptos clave:

- **`src/`**: Directorio fuente que contiene todo el código
- **`app/`**: Cada carpeta representa una ruta
- **`page.tsx`**: Define una página accesible por URL
- **`layout.tsx`**: Envuelve páginas con elementos comunes
- **`[name]/`**: Rutas dinámicas (parámetros variables)

---

## 🎨 Paso 3: Configurar ShadCN/UI

ShadCN/UI nos dará componentes bonitos y funcionales:

```bash
npx shadcn@latest init
```

**Configuración recomendada:**
- Style: **Neutral**

Instala algunos componentes que usaremos:

```bash
npx shadcn@latest add card button badge input
```

---

## 🏠 Paso 4: Crear la página principal (Landing)

Actualiza `src/app/page.tsx` para crear una landing atractiva:

```tsx
// src/app/page.tsx
import Link from 'next/link'
import { Button } from '../components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16 text-center text-white">
        <h1 className="text-6xl font-bold mb-6">
          🔴 Pokédex
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Explora el mundo Pokémon con nuestra Pokédex interactiva. 
          Descubre información detallada sobre tus Pokémon favoritos.
        </p>
        <div className="space-y-4">
          <Link href="/pokemons">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              🚀 Explorar Pokémons
            </Button>
          </Link>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-3">⚡ Server Components</h3>
            <p>Renderizado del lado del servidor para mejor SEO y rendimiento</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-3">🔄 App Router</h3>
            <p>Sistema de rutas moderno con layouts y páginas anidadas</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-3">🛠 API Routes</h3>
            <p>Backend y frontend en un solo proyecto con API Routes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 📄 Paso 5: Lista de Pokémons (Server Component)

Crea la página de lista en `src/app/pokemons/page.tsx`:

```tsx
// src/app/pokemons/page.tsx
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

// 🔍 Tipos para TypeScript
interface Pokemon {
  name: string
  url: string
}

interface PokemonListResponse {
  results: Pokemon[]
  count: number
}

// 🌐 Función para obtener datos (Server Side)
async function getPokemons(): Promise<PokemonListResponse> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20', {
    cache: 'force-cache' // Cache para mejor rendimiento
  })
  
  if (!res.ok) {
    throw new Error('Error al cargar pokémons')
  }
  
  return res.json()
}

// 🧩 Server Component (por defecto en app/)
export default async function PokemonsPage() {
  const data = await getPokemons()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Pokédex</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {data.count} Pokémons total
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.results.map((pokemon) => (
          <Link key={pokemon.name} href={`/pokemons/${pokemon.name}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="capitalize text-center">
                  {pokemon.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-4xl">
                  🔴
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

### 🔍 Conceptos importantes:

- **Server Component**: Se ejecuta en el servidor, perfecto para fetch de datos
- **async/await**: Los Server Components pueden ser asíncronos
- **cache: 'force-cache'**: Optimización de rendimiento
- **TypeScript**: Tipos para mejor desarrollo

---

## 📱 Paso 6: Página de detalle (Rutas dinámicas)

Crea `src/app/pokemons/[name]/page.tsx`:

```tsx
// src/app/pokemons/[name]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'

// 🔍 Tipos para el Pokémon detallado
interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string
    back_default: string
  }
  types: Array<{
    type: { name: string }
  }>
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
}

// 🌐 Función para obtener un Pokémon específico
async function getPokemon(name: string): Promise<PokemonDetail | null> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`, {
      cache: 'force-cache'
    })
    
    if (!res.ok) {
      return null
    }
    
    return res.json()
  } catch {
    return null
  }
}

// 🎯 Props que recibe la página (incluye parámetros de ruta)
interface PageProps {
  params: { name: string }
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const pokemon = await getPokemon(params.name)
  
  // Si no existe el Pokémon, mostrar 404
  if (!pokemon) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/pokemons">
        <Button variant="outline" className="mb-6">
          ← Volver a la lista
        </Button>
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl capitalize flex items-center gap-4">
              {pokemon.name}
              <Badge>#{pokemon.id}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center space-x-4">
              <img 
                src={pokemon.sprites.front_default} 
                alt={`${pokemon.name} frontal`}
                className="w-32 h-32"
              />
              <img 
                src={pokemon.sprites.back_default} 
                alt={`${pokemon.name} trasero`}
                className="w-32 h-32"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Altura</p>
                <p className="text-2xl font-bold">{pokemon.height / 10} m</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Peso</p>
                <p className="text-2xl font-bold">{pokemon.weight / 10} kg</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Tipos</p>
              <div className="flex gap-2">
                {pokemon.types.map((type) => (
                  <Badge key={type.type.name} variant="secondary">
                    {type.type.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{stat.stat.name}</span>
                    <span className="font-bold">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(stat.base_stat / 2, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 🔍 Conceptos importantes:

- **[name]**: Carpeta con corchetes = ruta dinámica
- **params**: Acceso a parámetros de la URL
- **notFound()**: Función de Next.js para mostrar página 404
- **Manejo de errores**: Try/catch para APIs externas

---

## 🔧 Paso 7: Crear un componente reutilizable

Crea `src/components/PokemonCard.tsx`:

```tsx
// src/components/PokemonCard.tsx
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface PokemonCardProps {
  name: string
  url: string
}

export function PokemonCard({ name, url }: PokemonCardProps) {
  // Extraer ID del URL para mostrar imagen
  const pokemonId = url.split('/').filter(Boolean).pop()
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
  
  return (
    <Link href={`/pokemons/${name}`}>
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="capitalize text-center text-lg">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <img 
            src={imageUrl}
            alt={name}
            className="w-20 h-20 mx-auto mb-2"
            loading="lazy"
          />
          <p className="text-sm text-gray-500">#{pokemonId}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
```

Ahora actualiza `src/app/pokemons/page.tsx` para usar el componente:

```tsx
// Importar el componente
import { PokemonCard } from '../../components/PokemonCard'

// En el return, reemplazar el Card manual por:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {data.results.map((pokemon) => (
    <PokemonCard 
      key={pokemon.name} 
      name={pokemon.name} 
      url={pokemon.url} 
    />
  ))}
</div>
```

---

## 🛠 Paso 8: API Routes (Backend en Next.js)

Crea tu propia API en `src/app/api/pokemons/route.ts`:

```tsx
// src/app/api/pokemons/route.ts
import { NextRequest, NextResponse } from 'next/server'

// 🔍 Interfaz para el caché local
interface CachedPokemon {
  name: string
  id: number
  image: string
  types: string[]
}

// 📦 GET - Obtener lista de pokémons (con caché y filtros)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '20'
  const search = searchParams.get('search') || ''
  
  try {
    // Obtener lista básica
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
      { cache: 'force-cache' }
    )
    const data = await res.json()
    
    // Enriquecer con detalles (para filtros y mejor UX)
    const enrichedPokemons = await Promise.all(
      data.results.map(async (pokemon: any) => {
        const detailRes = await fetch(pokemon.url, { cache: 'force-cache' })
        const detail = await detailRes.json()
        
        return {
          name: detail.name,
          id: detail.id,
          image: detail.sprites.front_default,
          types: detail.types.map((t: any) => t.type.name)
        }
      })
    )
    
    // Filtrar por búsqueda si existe
    const filteredPokemons = search
      ? enrichedPokemons.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      : enrichedPokemons
    
    return NextResponse.json({
      pokemons: filteredPokemons,
      total: data.count,
      search
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener pokémons' },
      { status: 500 }
    )
  }
}

// 📝 POST - Favoritos (ejemplo de endpoint personalizado)
export async function POST(request: NextRequest) {
  try {
    const { pokemonName } = await request.json()
    
    // Aquí podrías guardar en base de datos
    // Por ahora solo simulamos
    console.log(`Pokémon ${pokemonName} añadido a favoritos`)
    
    return NextResponse.json({
      message: `${pokemonName} añadido a favoritos`,
      success: true
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 400 }
    )
  }
}
```

### 🔍 Probar la API:

Visita: `http://localhost:3000/api/pokemons?limit=5&search=pika`

---

## 🎮 Paso 9: Client Component interactivo

Crea un componente con interactividad en `src/components/SearchPokemon.tsx`:

```tsx
// src/components/SearchPokemon.tsx
'use client' // 🎯 Marca como Client Component

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface SearchResult {
  name: string
  id: number
  image: string
  types: string[]
}

export function SearchPokemon() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  
  const handleSearch = async () => {
    if (!search.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/pokemons?search=${search}&limit=10`)
      const data = await res.json()
      setResults(data.pokemons)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔍 Buscar Pokémon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Busca un Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? '🔄' : '🔍'}
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((pokemon) => (
              <div key={pokemon.id} className="flex items-center gap-3 p-3 border rounded">
                <img src={pokemon.image} alt={pokemon.name} className="w-12 h-12" />
                <div>
                  <p className="font-semibold capitalize">{pokemon.name}</p>
                  <p className="text-sm text-gray-500">
                    {pokemon.types.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

Añade este componente a tu página principal:

```tsx
// src/app/page.tsx - añadir después del contenido existente
import { SearchPokemon } from '../components/SearchPokemon'

// En el return, añadir antes del cierre del div principal:
<div className="mt-16">
  <SearchPokemon />
</div>
```

### 🔍 Diferencias clave:

- **'use client'**: Necesario para hooks como useState
- **Client Component**: Se ejecuta en el navegador
- **Server Component**: Se ejecuta en el servidor (por defecto)

---

## 🚀 Paso 10: Optimizaciones y mejores prácticas

### 📁 Crear utilidades en `src/lib/pokemon.ts`:

```tsx
// src/lib/pokemon.ts
export interface Pokemon {
  name: string
  url: string
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  sprites: { front_default: string; back_default: string }
  types: Array<{ type: { name: string } }>
  stats: Array<{ base_stat: number; stat: { name: string } }>
}

export async function fetchPokemon(name: string): Promise<PokemonDetail | null> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`, {
      next: { revalidate: 3600 } // Revalidar cada hora
    })
    return res.ok ? res.json() : null
  } catch {
    return null
  }
}

export async function fetchPokemonList(limit = 20): Promise<{ results: Pokemon[]; count: number }> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`, {
    next: { revalidate: 3600 }
  })
  return res.json()
}
```

### 🎨 Actualizar layout global en `src/app/layout.tsx`:

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pokédex Next.js',
  description: 'Aprende Next.js construyendo una Pokédex',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <nav className="border-b border-gray-200 bg-white/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">🔴 Pokédex</h1>
              <div className="space-x-4">
                <a href="/" className="hover:text-blue-600">Inicio</a>
                <a href="/pokemons" className="hover:text-blue-600">Pokémons</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

---

## 🎉 ¡Felicidades! Has completado tu Pokédex

### 📚 Resumen de lo que has aprendido:

1. **✅ Estructura de Next.js**: App Router, páginas, layouts
2. **✅ Server vs Client Components**: Cuándo usar cada uno
3. **✅ Rutas dinámicas**: `[name]` para parámetros variables  
4. **✅ API Routes**: Backend integrado en Next.js
5. **✅ Optimizaciones**: Cache, revalidación, lazy loading
6. **✅ Componentes**: Reutilización y props con TypeScript
7. **✅ UI moderna**: ShadCN/UI + Tailwind CSS

### 🚀 Próximos pasos sugeridos:

- 🗄️ Añadir una base de datos (SQLite/PostgreSQL)
- 🔐 Implementar autenticación
- 📱 Hacer la app PWA (Progressive Web App)
- 🎨 Añadir animaciones con Framer Motion
- 📊 Implementar filtros avanzados
- 🌙 Modo oscuro
- 📈 Analytics y métricas

### 🔗 Recursos útiles:

- [Documentación oficial de Next.js](https://nextjs.org/docs)
- [ShadCN/UI Components](https://ui.shadcn.com)
- [PokeAPI Documentation](https://pokeapi.co)
- [Tailwind CSS](https://tailwindcss.com)

---

**¡Tu Pokédex está lista! 🎮 Ahora tienes una base sólida para construir aplicaciones más complejas con Next.js.**