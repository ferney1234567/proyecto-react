import Link from 'next/link'
import { Button } from '../components/ui/button'
import { SearchPokemon } from '../components/SearchPokemon'

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
      <div className="mt-16">
        <SearchPokemon />
      </div>
    </div>
  )
}