import { getVideos } from '@/lib/eporner'
import VideoGrid from '@/components/VideoGrid'
import Pagination from '@/components/Pagination'
import { Suspense } from 'react'

export const metadata = {
  title: 'Video Bokep Trending Viral - Bokep Indonesia Indo Hijab | AREA BOKEP',
  description: 'Koleksi video bokep trending dan viral bokep indonesia, bokep indo, bokep hijab paling banyak ditonton. Streaming gratis HD.',
  keywords: ['bokep trending', 'bokep viral', 'bokep indonesia', 'bokep indo', 'bokep hijab', 'video trending'],
}

export default async function TrendingPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const perPage = 40
  const data = await getVideos({ page, perPage, sort: 'trending', search: 'hijab indo' })
  const videos = data.videos || []
  const hasMore = videos.length === perPage
  const totalPages = hasMore ? page + 2 : page

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
          <i className="fas fa-fire text-orange-500 mr-3"></i>Hijab Indonesia Trending
        </h1>
        <p className="text-gray-400">
          <i className="fas fa-video mr-2"></i>
          {data.total || videos.length} video hijab indonesia trending
        </p>
      </div>
      <VideoGrid videos={videos} />
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/trending" />
    </div>
  )
}
