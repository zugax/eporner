import { getVideos } from '@/lib/eporner'
import VideoGrid from '@/components/VideoGrid'
import Pagination from '@/components/Pagination'

export const metadata = {
  title: 'Video Bokep Popular - Bokep Indonesia Indo | AREA BOKEP',
  description: 'Koleksi video bokep paling populer dan terpopuler. Lihat video bokep hot yang paling banyak ditonton.',
  keywords: ['bokep popular', 'bokep terpopuler', 'bokep indonesia', 'bokep indo', 'video popular'],
}

export default async function PopularPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const perPage = 40
  const data = await getVideos({ page, perPage, sort: 'popular', country: 'indonesia' })
  const videos = data.videos || []
  const hasMore = videos.length === perPage
  const totalPages = hasMore ? page + 2 : page

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
          <i className="fas fa-star text-yellow-500 mr-3"></i>Video Indonesia Populer
        </h1>
        <p className="text-gray-400">
          <i className="fas fa-video mr-2"></i>
          {data.total || videos.length} video indonesia paling populer
        </p>
      </div>
      <VideoGrid videos={videos} />
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/popular" />
    </div>
  )
}
