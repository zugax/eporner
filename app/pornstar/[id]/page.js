import { getPornstarById, getVideos } from '@/lib/eporner'
import VideoGrid from '@/components/VideoGrid'
import Pagination from '@/components/Pagination'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const pornstar = await getPornstarById(params.id)
  const baseUrl = 'https://pornxsearch.dpdns.org'
  const pornstarUrl = `${baseUrl}/pornstar/${params.id}`
  
  // Structured data for pornstar
  const structuredData = pornstar ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": pornstar.name,
    "description": pornstar.bio || `Watch videos featuring ${pornstar.name} on AREA BOKEP`,
    "url": pornstarUrl,
    "image": pornstar.thumb || null,
    "knowsAbout": pornstar.videos ? ` ${pornstar.videos} videos` : null,
    "interactionStatistic": pornstar.views ? {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WatchAction",
      "userInteractionCount": pornstar.views
    } : null
  } : null
  
  return {
    title: pornstar?.name ? `${pornstar.name} - ${pornstar.videos || 0} Videos | AREA BOKEP` : 'Pornstar | AREA BOKEP',
    description: pornstar?.bio || `Watch videos featuring ${pornstar?.name || 'pornstar'} on AREA BOKEP - Free HD adult videos`,
    keywords: [pornstar?.name, 'pornstar', 'adult video', 'free porn', 'hd porn'],
    openGraph: {
      title: pornstar?.name ? `${pornstar.name} - ${pornstar.videos || 0} Videos | AREA BOKEP` : 'Pornstar | AREA BOKEP',
      description: pornstar?.bio || `Watch videos featuring ${pornstar?.name || 'pornstar'} on AREA BOKEP`,
      url: pornstarUrl,
      type: 'profile',
      images: pornstar?.thumb ? [pornstar.thumb] : []
    },
    alternates: {
      canonical: pornstarUrl
    },
    other: structuredData ? {
      'script:ld+json': JSON.stringify(structuredData)
    } : {}
  }
}

export default async function PornstarPage({ params, searchParams }) {
  const baseUrl = 'https://pornxsearch.dpdns.org'
  const pornstar = await getPornstarById(params.id)
  
  if (!pornstar) {
    notFound()
  }

  const page = parseInt(searchParams?.page || '1')
  const perPage = 40
  const data = await getVideos({ pornstar: pornstar.name, page, perPage })
  const videos = data.videos || []
  const hasMore = videos.length === perPage
  const totalPages = hasMore ? page + 2 : page

  return (
    <div className="container mx-auto px-4 py-6">
      {/* JSON-LD Structured Data for Pornstar */}
      <Script
        id="pornstar-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": pornstar.name,
            "description": pornstar.bio || `Watch videos featuring ${pornstar.name} on AREA BOKEP`,
            "url": `${baseUrl}/pornstar/${params.id}`,
            "image": pornstar.thumb || null
          })
        }}
      />

      {/* BreadcrumbList Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Pornstars",
                "item": `${baseUrl}/pornstars`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": pornstar.name,
                "item": `${baseUrl}/pornstar/${params.id}`
              }
            ]
          })
        }}
      />

      {/* Pornstar Profile - Eporner style */}
      <div className="bg-dark-secondary rounded-lg p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            {pornstar.thumb ? (
              <Image
                src={pornstar.thumb}
                alt={`${pornstar.name} - Watch ${pornstar.videos || 0} videos on AREA BOKEP`}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-800">
                <i className="fas fa-user text-6xl text-gray-600"></i>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{pornstar.name}</h1>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm mb-6">
              {pornstar.videos > 0 && (
                <div className="flex items-center gap-2 text-gray-300">
                  <i className="fas fa-video text-primary"></i>
                  <span className="font-medium">{pornstar.videos}</span>
                  <span className="text-gray-500">videos</span>
                </div>
              )}
              {pornstar.rating > 0 && (
                <div className="flex items-center gap-2">
                  <i className="fas fa-star text-yellow-500"></i>
                  <span className="text-white font-semibold">{pornstar.rating}%</span>
                  <span className="text-gray-500">rating</span>
                </div>
              )}
              {pornstar.views > 0 && (
                <div className="flex items-center gap-2 text-gray-300">
                  <i className="fas fa-eye text-gray-500"></i>
                  <span className="font-medium">{pornstar.views.toLocaleString()}</span>
                  <span className="text-gray-500">views</span>
                </div>
              )}
            </div>
            {pornstar.bio && (
              <p className="text-gray-400 leading-relaxed">{pornstar.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center pb-3 border-b border-gray-800">
          <i className="fas fa-video text-primary mr-2"></i>Videos ({pornstar.videos || videos.length})
        </h2>
      </div>
      <VideoGrid videos={videos} />
      <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/pornstar/${params.id}`} />

      {/* In-Page Push Ad */}
      <Script id="push-ad-pornstar" strategy="afterInteractive">
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
      <Script id="popunder-ad-pornstar" strategy="afterInteractive">
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
      <Script id="banner-ad-pornstar" strategy="afterInteractive">
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
      <Script id="vast-ad-pornstar" strategy="afterInteractive">
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
