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

// 🌐 Función para obtener un Pokémon desde NUESTRA API
async function getPokemon(name: string): Promise<PokemonDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pokemons/${name}`, {
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
  params: Promise<{ name: string }>
}

export default async function PokemonDetailPage({ params }: PageProps) {
  // 🔥 IMPORTANTE: En Next.js 15, params es asíncrono y debe ser awaited
  const { name } = await params
  const pokemon = await getPokemon(name)
  
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