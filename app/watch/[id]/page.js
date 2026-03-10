import { getVideoById, getVideos } from '@/lib/eporner'
import VideoCard from '@/components/VideoCard'
import Link from 'next/link'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

// Generate metadata for SEO with JSON-LD
export async function generateMetadata({ params }) {
  const { id } = params
  
  let video = null
  try {
    video = await getVideoById(id)
  } catch (error) {
    console.error('generateMetadata error:', error)
  }

  const baseUrl = 'https://pornxsearch.dpdns.org'
  const videoUrl = `${baseUrl}/watch/${id}`
  
  // Format duration for ISO 8601 duration
  const formatISODuration = (seconds) => {
    if (!seconds) return null
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `PT${mins}M${secs}S`
  }

  // Build structured data for video
  const structuredData = video ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title || 'Video',
    "description": video.description || `Watch ${video.title} on AREA BOKEP - Free HD porn videos`,
    "thumbnailUrl": video.thumbs?.[0] || null,
    "uploadDate": video.added ? new Date(video.added).toISOString() : null,
    "duration": formatISODuration(video.duration),
    "contentUrl": video.embed || videoUrl,
    "embedUrl": video.embed || null,
    "publisher": {
      "@type": "Organization",
      "name": "AREA BOKEP",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/icon.svg`
      }
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WatchAction",
      "userInteractionCount": video.views || 0
    },
    "keywords": video.tags?.join(', ') || video.categories?.join(', ') || 'adult video, free porn'
  } : null

  return {
    title: video?.title ? `${video.title} - Watch Free HD Video | AREA BOKEP` : 'Watch Video | AREA BOKEP',
    description: video?.description || `Watch free HD porn video on AREA BOKEP. ${video?.title || 'Best adult videos updated daily.'}`,
    keywords: video?.tags || video?.categories || ['bokep', 'free porn', 'hd video'],
    openGraph: {
      title: video?.title || 'Watch Video | AREA BOKEP',
      description: video?.description || 'Watch free HD porn videos on AREA BOKEP',
      url: videoUrl,
      type: 'video.other',
      video: {
        tag: video?.tags || [],
        duration: formatISODuration(video?.duration),
        release_date: video?.added,
        actor: video?.pornstars?.map(ps => ({
          '@type': 'Person',
          name: typeof ps === 'string' ? ps : ps.name
        }))
      },
      images: video?.thumbs ? video.thumbs.map(thumb => ({
        url: thumb,
        width: 640,
        height: 360,
        alt: video.title
      })) : []
    },
    twitter: {
      card: 'player',
      title: video?.title || 'Watch Video | AREA BOKEP',
      description: video?.description || 'Watch free HD porn videos',
      player: {
        url: video?.embed || videoUrl,
        width: 640,
        height: 360
      },
      images: video?.thumbs || []
    },
    alternates: {
      canonical: videoUrl
    },
    other: structuredData ? {
      'script:ld+json': JSON.stringify(structuredData)
    } : {}
  }
}

export default async function WatchPage({ params }) {
  const { id } = params
  console.log('WatchPage id:', id)
  
  let video = null
  try {
    video = await getVideoById(id)
    console.log('WatchPage video:', video)
  } catch (error) {
    console.error('WatchPage error:', error)
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-dark-secondary rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Video Not Found</h1>
          <p className="text-gray-400">The video you're looking for could not be found or is unavailable.</p>
          <a href="/" className="text-primary hover:underline mt-4 inline-block">
            Go back home
          </a>
        </div>
      </div>
    )
  }

  // Get related videos
  const relatedData = await getVideos({ perPage: 40, category: video.categories?.[0] })
  const relatedVideos = relatedData.videos?.filter(v => v.id !== id).slice(0, 10) || []

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views) => {
    if (!views) return '0'
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toLocaleString()
  }

  // Get rating color based on percentage
  const getRatingColor = (rating) => {
    if (!rating) return 'text-gray-400'
    if (rating >= 80) return 'text-green-400'
    if (rating >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* JSON-LD Structured Data for Video */}
      {video && (
        <Script
          id="video-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": video.title,
              "description": video.description || `Watch ${video.title} on AREA BOKEP`,
              "thumbnailUrl": video.thumbs?.[0],
              "uploadDate": video.added ? new Date(video.added).toISOString() : null,
              "duration": formatDuration(video.duration) ? `PT${Math.floor(video.duration/60)}M${video.duration%60}S` : null,
              "contentUrl": video.embed,
              "embedUrl": video.embed,
              "publisher": {
                "@type": "Organization",
                "name": "AREA BOKEP"
              },
              "interactionStatistic": {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/WatchAction",
                "userInteractionCount": video.views || 0
              }
            })
          }}
        />
      )}

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
                "name": video?.categories?.[0] ? video.categories[0].charAt(0).toUpperCase() + video.categories[0].slice(1) : 'Videos',
                "item": video?.categories?.[0] ? `${baseUrl}/category/${video.categories[0]}` : `${baseUrl}/latest`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": video?.title?.substring(0, 50) || 'Video',
                "item": videoUrl
              }
            ]
          })
        }}
      />

      {/* Video Player - Eporner style */}
      <div className="mb-6">
        <div className="bg-black rounded-lg overflow-hidden shadow-xl">
          <div className="aspect-video relative">
            {video.embed ? (
              <iframe
                src={video.embed}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full absolute inset-0"
                allow="autoplay; fullscreen"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-900 text-gray-500">
                <div className="text-center">
                  <i className="fas fa-video-slash text-4xl mb-2"></i>
                  <p>Video not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Details - Eporner style */}
      <div className="mb-8">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
          {video.title}
        </h1>
        
        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2 text-gray-300">
            <i className="fas fa-eye text-gray-500"></i>
            <span>{formatViews(video?.views)} views</span>
          </div>
          <div className="flex items-center gap-2">
            <i className={`fas fa-thumbs-up ${getRatingColor(video?.rating)}`}></i>
            <span className="text-white font-semibold">{video?.rating ? Math.round(video.rating) : 0}%</span>
            <span className="text-gray-500 text-xs">({video?.votes || 0} votes)</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <i className="fas fa-clock text-gray-500"></i>
            <span>{video?.durationFormatted || formatDuration(video?.duration)}</span>
          </div>
          {video?.hd && (
            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
              HD
            </span>
          )}
          {video?.added && (
            <div className="flex items-center gap-2 text-gray-300">
              <i className="fas fa-calendar-alt text-gray-500"></i>
              <span>{new Date(video.added).toLocaleDateString()}</span>
            </div>
          )}
          {video.epornerUrl && (
            <a 
              href={video.epornerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
            >
              <i className="fas fa-external-link-alt"></i> 
              <span>View on Eporner</span>
            </a>
          )}
        </div>

        {/* Description */}
        {video.description && (
          <div className="mb-6">
            <p className="text-gray-400 text-sm leading-relaxed">{video.description}</p>
          </div>
        )}

        {/* Categories */}
        {video.categories && video.categories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {video.categories.map((cat) => (
                <Link 
                  key={cat} 
                  href={`/category/${cat}`}
                  className="bg-dark-secondary text-gray-300 px-4 py-1.5 rounded-full text-sm hover:bg-primary hover:text-white transition-all duration-200"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pornstars */}
        {video.pornstars && video.pornstars.length > 0 && (
          <div className="mb-6 p-4 bg-dark-secondary rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-user text-primary"></i>
              <span className="text-gray-300 font-medium">Models:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {video.pornstars.map((model, index) => (
                <span 
                  key={index} 
                  className="text-primary font-medium hover:underline cursor-pointer"
                >
                  {typeof model === 'string' ? model : model.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              <i className="fas fa-tags text-gray-500 mt-1"></i>
              {video.tags.slice(0, 15).map((tag) => (
                <Link 
                  key={tag} 
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-gray-500 text-sm hover:text-primary transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Videos */}
      {relatedVideos.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white mb-5 pb-3 border-b border-gray-800">
            <i className="fas fa-random mr-2 text-primary"></i>Related Videos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {relatedVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}

      {/* In-Page Push Ad */}
      <Script id="push-ad-watch" strategy="afterInteractive">
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
      <Script id="popunder-ad-watch" strategy="afterInteractive">
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
      <Script id="banner-ad-watch" strategy="afterInteractive">
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
      <Script id="vast-ad-watch" strategy="afterInteractive">
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
