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