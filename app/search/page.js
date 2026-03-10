import { getVideos } from '@/lib/eporner'
import VideoGrid from '@/components/VideoGrid'
import Pagination from '@/components/Pagination'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }) {
  const query = searchParams.q || ''
  return {
    title: `Cari ${query} - Video Bokep Indonesia Indo | AREA BOKEP`,
    description: `Cari video bokep ${query}. Koleksi video bokep ${query} terbaru dan terupdate.`,
    keywords: ['bokep', 'video bokep', `bokep ${query}`, 'search bokep', 'nonton bokep'],
  }
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams?.page || '1')
  const perPage = 40
  const data = await getVideos({ search: query, page, perPage })
  const videos = data.videos || []
  const hasMore = videos.length === perPage
  const totalPages = hasMore ? page + 2 : page

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center">
          <i className="fas fa-search text-primary mr-3"></i>
          Search Results: <span className="text-primary ml-2">{query}</span>
        </h1>
        <p className="text-gray-400">
          <i className="fas fa-video mr-2"></i>
          {data.total || videos.length} videos found
        </p>
      </div>
      <VideoGrid videos={videos} />
      <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/search?q=${encodeURIComponent(query)}`} />

      {/* Popunder Ad */}
      <Script id="popunder-ad-search" strategy="afterInteractive">
        {`(function(zcath){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = zcath || {};
s.src = "\\/\\/perfumed-development.com\\/clDw9w6.bZ2V5flBSWWzQ\\/9\\/NxjRg\\/1zNdjqgR4NNESp0S2qO\\/DhUn2POwDxg\\/5y";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>

      {/* MultiTag VAST Ad */}
      <Script id="vast-ad-search" strategy="afterInteractive">
        {`(function(vtbp){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = vtbp || {};
s.src = "\\/\\/frugal-sex.com\\/bTXVVms.dBGilW0iYnWkce\\/peAmP9HuzZlUvl\\/kdP\\/TcYo4-NET\\/Yw4\\/OuTxMDtlNrjsgp1\\/NejmgN5xNawC";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>
    </div>
  )
}
