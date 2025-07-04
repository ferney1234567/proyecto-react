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