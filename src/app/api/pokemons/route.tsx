mport { NextRequest, NextResponse } from 'next/server'

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