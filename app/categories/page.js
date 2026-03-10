import { getCategories } from '@/lib/eporner'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'All Categories - AREA BOKEP',
  description: 'Browse all video categories on AREA BOKEP'
}

export default async function CategoriesPage() {
  const categoriesData = await getCategories()
  const categories = categoriesData || []

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
          <i className="fas fa-th text-primary mr-3"></i>All Categories
        </h1>
        <p className="text-gray-400">{categories.length} categories available</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/category/${cat.id}`}
            className="group"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-dark-secondary shadow-md">
              {cat.thumbs && cat.thumbs[0] ? (
                <Image
                  src={cat.thumbs[0]}
                  alt={`${cat.name} videos - Watch free ${cat.name} porn on AREA BOKEP`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-800">
                  <i className="fas fa-play text-3xl text-gray-600"></i>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              {/* Hover effect */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300"></div>
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-semibold text-sm md:text-base group-hover:text-primary transition-colors">{cat.name}</h3>
                <span className="text-gray-300 text-xs">{cat.count} videos</span>
              </div>
              {/* Play icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                  <i className="fas fa-play text-white ml-0.5"></i>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
