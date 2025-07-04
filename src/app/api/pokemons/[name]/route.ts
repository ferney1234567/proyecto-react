import { NextRequest, NextResponse } from 'next/server'

// 🔍 Tipos para el pokémon detallado
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

interface RouteParams {
  params: Promise<{ name: string }>
}

// 📦 GET - Obtener un pokémon específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { name } = await params
    
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`, {
      cache: 'force-cache'
    })
    
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Pokémon no encontrado' },
        { status: 404 }
      )
    }
    
    const pokemon: PokemonDetail = await res.json()
    
    return NextResponse.json(pokemon)
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al cargar pokémon' },
      { status: 500 }
    )
  }
} 