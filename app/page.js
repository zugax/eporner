import { getVideos, getCategories } from '@/lib/eporner'
import VideoGrid from '@/components/VideoGrid'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'AREA BOKEP - Video Bokep Indonesia Indo Hijab Japan Gratis HD',
  description: 'Nonton video bokep indonesia, bokep indo, bokep hijab, bokep jepang (jav), bokep asian gratis kualitas HD terbaru.',
}

export default async function Home() {
  // Fetch data in parallel
  const [latestData, trendingData, popularData, topRatedData, categoriesData] = await Promise.all([
    getVideos({ perPage: 40, sort: 'newest' }),
    getVideos({ perPage: 40, sort: 'trending' }),
    getVideos({ perPage: 40, sort: 'popular' }),
    getVideos({ perPage: 40, sort: 'rating' }),
    getCategories()
  ])

  const latestVideos = latestData.videos || []
  const trendingVideos = trendingData.videos || []
  const popularVideos = popularData.videos || []
  const topRatedVideos = topRatedData.videos || []
  
  // Fallback categories if API returns empty
  const defaultCategories = [
    { id: 'amateur', name: 'Amateur', thumbs: ['https://placehold.co/640x360/1a1a2e/ae0000?text=Amateur'] },
    { id: 'teen', name: 'Teen', thumbs: ['https://placehold.co/640x360/1a1a2e/ae0000?text=Teen'] },
    { id: 'milf', name: 'MILF', thumbs: ['https://placehold.co/640x360/1a1a2e/ae0000?text=MILF'] },
    { id: 'big-ass', name: 'Big Ass', thumbs: ['https://placehold.co/640x360/1a1a2e/ae0000?text=Big+Ass'] },
    { id: 'big-tits', name: 'Big Tits', thumbs: ['https://placehold.co/640x360/1a1a2e/ae0000?text=Big+Tits'] },
    { id: 'anal', name: 'Anal', thumbs: ['https://placehold.co/640x360/1a1a2e/ae0000?text=Anal'] },
    { id: 'hardcore', name: 'Hardcore', thumbs: ['https://placehold.co/640x360/1a1a2e/ae0000?text=Hardcore'] },
    { id: 'blowjob', name: 'Blowjob', thumbs: ['https://placehold.co/640x360/1a1a2e/ae0000?text=Blowjob'] }
  ]
  
  const categories = (categoriesData && categoriesData.length > 0) ? categoriesData.slice(0, 8) : defaultCategories

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Trending Videos */}
      <VideoGrid 
        videos={trendingVideos} 
        title={<><i className="fas fa-fire text-orange-500 mr-2"></i>Trending Now</>}
        viewAllLink="/trending"
      />

      {/* Categories with Images - Eporner style */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <i className="fas fa-th text-primary mr-2"></i>Popular Categories
          </h2>
          <Link href="/categories" className="text-primary hover:text-primary-light text-sm font-medium">
            View All Categories <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.id}`}
              className="relative group rounded-lg overflow-hidden aspect-video shadow-md"
            >
              {cat.thumbs && cat.thumbs[0] ? (
                <Image
                  src={cat.thumbs[0]}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <i className="fas fa-play text-2xl text-gray-600"></i>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              {/* Hover effect */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-semibold text-sm md:text-base">{cat.name}</h3>
                <span className="text-gray-300 text-xs">{cat.count} videos</span>
              </div>
              {/* Play icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <i className="fas fa-play text-white ml-0.5"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Most Popular */}
      <VideoGrid 
        videos={popularVideos} 
        title={<><i className="fas fa-star text-yellow-500 mr-2"></i>Most Popular</>}
        viewAllLink="/popular"
      />

      {/* Latest Videos */}
      <VideoGrid 
        videos={latestVideos} 
        title={<><i className="fas fa-clock text-green-500 mr-2"></i>Latest Videos</>}
        viewAllLink="/latest"
      />

      {/* Top Rated */}
      <VideoGrid 
        videos={topRatedVideos} 
        title={<><i className="fas fa-trophy text-purple-500 mr-2"></i>Top Rated</>}
      />
    </div>
  )
}
