'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos..."
          className="bg-dark/80 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 pl-10 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-36 md:w-56 lg:w-64 transition-all"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
    </form>
  )
}
