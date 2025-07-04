import { NextRequest, NextResponse } from 'next/server'

// 🔍 Tipos para nuestras respuestas
interface PokemonListItem {
  name: string
  url: string
  id: number
  image: string
  types: string[]
}

interface ApiResponse {
  pokemons: PokemonListItem[]
  total: number
  search?: string
}

// 📦 GET - Obtener lista de pokémons (con búsqueda)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '20'
  const search = searchParams.get('search') || ''
  
  try {
    // Obtener lista básica
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`, {
      cache: 'force-cache'
    })
    
    if (!res.ok) {
      throw new Error('Error al obtener pokémons')
    }
    
    const data = await res.json()
    
    // Enriquecer con detalles para búsqueda
    const enrichedPokemons = await Promise.all(
      data.results.map(async (pokemon: any) => {
        const detailRes = await fetch(pokemon.url, { cache: 'force-cache' })
        const detail = await detailRes.json()
        
        return {
          name: detail.name,
          url: pokemon.url,
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
    
    const response: ApiResponse = {
      pokemons: filteredPokemons,
      total: data.count,
      search
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al cargar pokémons' },
      { status: 500 }
    )
  }
}