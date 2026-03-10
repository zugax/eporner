import { getVideos } from '@/lib/eporner'
import VideoGrid from '@/components/VideoGrid'
import Pagination from '@/components/Pagination'
import Link from 'next/link'

export const metadata = {
  title: 'Channels - AREA BOKEP',
  description: 'Browse porn channels and studios on AREA BOKEP'
}

// Channel data from eporner
const channels = [
  { id: 'blacked', name: 'Blacked', slug: 'blacked' },
  { id: 'tushy', name: 'Tushy', slug: 'tushy' },
  { id: 'vixen', name: 'Vixen', slug: 'vixen' },
  { id: 'scoreland', name: 'ScoRelaND', slug: 'scoreland' },
  { id: 'bangbros-videos', name: 'BangBros', slug: 'bangbros-videos' },
  { id: 'perved-family', name: 'PervED Family', slug: 'perved-family' },
  { id: 'new-sensations', name: 'New Sensations', slug: 'new-sensations' },
  { id: 'brazzers-network', name: 'Brazzers Network', slug: 'brazzers-network' },
  { id: 'nebraskacoeds', name: 'Nebraska Coeds', slug: 'nebraskacoeds' },
  { id: 'springbreaklife', name: 'Spring Break Life', slug: 'springbreaklife' },
  { id: 'reality-kings-videos', name: 'Reality Kings', slug: 'reality-kings-videos' },
  { id: 'xprime', name: 'XPrime', slug: 'xprime' },
  { id: 'blackedraw', name: 'BlackedRaw', slug: 'blackedraw' },
  { id: 'evil-angel-network', name: 'Evil Angel', slug: 'evil-angel-network' },
  { id: 'brazzers-videos', name: 'Brazzers', slug: 'brazzers-videos' },
  { id: 'xl-girls', name: 'XL Girls', slug: 'xl-girls' },
  { id: 'teamskeet', name: 'TeamSkeet', slug: 'teamskeet' },
  { id: 'adult-time', name: 'Adult Time', slug: 'adult-time' },
  { id: 'nookies', name: 'Nookies', slug: 'nookies' },
  { id: 'df-exxxtra', name: 'DF XX xtra', slug: 'df-exxxtra' },
  { id: 'gangbang-secrets', name: 'Gangbang Secrets', slug: 'gangbang-secrets' },
  { id: 'freecam8', name: 'FreeCam8', slug: 'freecam8' },
  { id: 'jacquie-et-michel-tv', name: 'Jacquie et Michel TV', slug: 'jacquie-et-michel-tv' },
  { id: 'erocom', name: 'EroCom', slug: 'erocom' },
  { id: 'naughty-america', name: 'Naughty America', slug: 'naughty-america' },
  { id: 'faphouse', name: 'FapHouse', slug: 'faphouse' },
  { id: 'reality-kings-clips', name: 'Reality Kings Clips', slug: 'reality-kings-clips' },
  { id: 'nubile-films', name: 'Nubile Films', slug: 'nubile-films' },
]

export default async function ChannelsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const perPage = 40
  const data = await getVideos({ page, perPage, sort: 'newest' })
  const videos = data.videos || []
  const hasMore = videos.length === perPage
  const totalPages = hasMore ? page + 2 : page

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
          <i className="fas fa-tv text-primary mr-3"></i>Porn Channels
        </h1>
        <p className="text-gray-400">
          <i className="fas fa-film mr-2"></i>
          Browse XXX studios and porn channels
        </p>
      </div>

      {/* Channel Grid - Eporner style */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {channels.map((channel) => (
            <Link 
              key={channel.id} 
              href={`/search?q=${encodeURIComponent(channel.name)}`}
              className="group"
            >
              <div className="bg-dark-secondary rounded-lg p-4 text-center hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 card-hover">
                {/* Channel Icon */}
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-dark flex items-center justify-center group-hover:bg-primary transition-colors">
                  <i className="fas fa-play-circle text-3xl text-primary group-hover:text-white transition-colors"></i>
                </div>
                {/* Channel Name */}
                <h3 className="text-white font-semibold text-sm group-hover:text-primary transition-colors">
                  {channel.name}
                </h3>
                {/* View Button */}
                <span className="text-xs text-gray-500 mt-1 block group-hover:text-primary-light">
                  View Channel
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Videos from Channels */}
      <div className="mb-6 pb-3 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <i className="fas fa-clock text-green-500 mr-2"></i>Latest from Channels
        </h2>
      </div>
      
      <VideoGrid videos={videos} />
      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/channels" />
    </div>
  )
}
