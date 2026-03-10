import { getPornstars } from '@/lib/eporner'
import Link from 'next/link'
import Image from 'next/image'
import Pagination from '@/components/Pagination'

export const metadata = {
  title: 'Daftar Pornstar - Bokep Indonesia Indo | AREA BOKEP',
  description: 'Koleksi pornstar bokep indonesia, jav, dan international. Lihat video berdasarkan pornstar favorit.',
  keywords: ['pornstar', 'bokep pornstar', 'indonesia pornstar', 'jav pornstar', 'bintang porno'],
}

export default async function PornstarsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const perPage = 50
  const data = await getPornstars(page, perPage)
  
  const pornstars = (data.pornstars && data.pornstars.length > 0) ? data.pornstars : []
  const hasMore = pornstars.length === perPage
  const totalPages = hasMore ? page + 2 : page

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
          <i className="fas fa-user-tie text-primary mr-3"></i>Popular Pornstars
        </h1>
        <p className="text-gray-400">
          <i className="fas fa-users mr-2"></i>
          {data.total || pornstars.length} pornstars found
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
        {pornstars.map((ps) => (
          <Link 
            key={ps.id} 
            href={`/pornstar/${ps.id}`}
            className="group"
          >
            <div className="bg-dark-secondary rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all">
              <div className="relative aspect-square bg-gray-800 overflow-hidden">
                {ps.thumb ? (
                  <Image
                    src={ps.thumb}
                    alt={ps.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-800">
                    <i className="fas fa-user text-4xl text-gray-600"></i>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300"></div>
              </div>
              <div className="p-3 text-center">
                <h3 className="text-white font-semibold group-hover:text-primary transition-colors text-sm">
                  {ps.name}
                </h3>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-400">
                  {ps.videos > 0 && (
                    <span className="flex items-center">
                      <i className="fas fa-video mr-1"></i>
                      {ps.videos}
                    </span>
                  )}
                  {ps.rating > 0 && (
                    <span className="flex items-center text-yellow-500">
                      <i className="fas fa-star mr-1"></i>
                      {ps.rating}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/pornstars" />
    </div>
  )
}
