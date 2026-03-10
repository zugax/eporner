import { getVideos } from '@/lib/eporner'
import VideoGrid from '@/components/VideoGrid'
import Pagination from '@/components/Pagination'

export const metadata = {
  title: 'Video Bokep Terbaru - Bokep Indonesia Indo Terbaru | AREA BOKEP',
  description: 'Koleksi video bokep terbaru dan terupdate. Nonton bokep indo, bokep hijab, bokep jepang terbaru.',
  keywords: ['bokep terbaru', 'video bokep terbaru', 'bokep indonesia', 'bokep indo', 'bokep hijab', 'bokep jepang'],
}

export default async function LatestPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const perPage = 40
  const data = await getVideos({ page, perPage, sort: 'newest' })
  const videos = data.videos || []
  
  // Calculate total pages - if we got full page, assume there are more
  const hasMore = videos.length === perPage
  const totalPages = hasMore ? page + 2 : page // Show next few pages as potential

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
          <i className="fas fa-clock text-green-500 mr-3"></i>Video Bokep Terbaru
        </h1>
        <p className="text-gray-400">
          <i className="fas fa-video mr-2"></i>
          {data.total || videos.length} video bokep terbaru
        </p>
      </div>
      <VideoGrid videos={videos} />
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/latest" />
    </div>
  )
}
