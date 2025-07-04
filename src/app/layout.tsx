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