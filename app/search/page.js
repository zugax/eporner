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

      {/* In-Page Push Ad */}
      <Script id="push-ad-search" strategy="afterInteractive">
        {`(function(lxye){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = lxye || {};
s.src = "\/\/swift-weird.com\/bTX\/Vgs.duGwl\/0\/YuWVcf\/xeOmD9XuUZMUBl-kUPxTnYf4VNHDzcD4iMbTocLtWNcjQgq0rNtzfggybM\/QG";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>

      {/* Popunder Ad */}
      <Script id="popunder-ad-search" strategy="afterInteractive">
        {`(function(mbvwp){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = mbvwp || {};
s.src = "\/\/perfumed-development.com\/cLD.9R6EbP2Q5clTSZWQQ_9gN\/jVg\/1\/N-jVgV4\/NPSW0E2vOSD_UT2qO\/Dkg\/5S";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>

      {/* Banner Ad */}
      <Script id="banner-ad-search" strategy="afterInteractive">
        {`(function(cobz){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = cobz || {};
s.src = "\/\/swift-weird.com\/b.XzVksKdEGWlP0UYyWZcS\/Uermg9nuVZ_Udl\/k\/PcTGY_z\/NDjOgZzHNsjWYRtuNJj\/Mk2tOHDLMg2NNswP";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>

      {/* Multitag VAST Ad */}
      <Script id="vast-ad-search" strategy="afterInteractive">
        {`(function(asoi){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = asoi || {};
s.src = "\/\/swift-weird.com\/bNXFV\/s.dFG\/lJ0tYLWGcx\/Ce\/mu9Gu\/ZzUxlwkYPNTfYPz\/NojxgKzHMRzrYptLN\/jUMF2\/OLDQM\/zbNPwy";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>
    </div>
  )
}
