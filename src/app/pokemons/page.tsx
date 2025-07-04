import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { PokemonCard } from '../../components/PokemonCard'

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
          <PokemonCard
            key={pokemon.name}
            name={pokemon.name}
            url={pokemon.url}
          />
        ))}
      </div>
    </div>
  )
}