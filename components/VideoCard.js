import Link from 'next/link'
import Image from 'next/image'

export default function VideoCard({ video }) {
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
    return views.toString()
  }

  // Get rating color based on percentage - Eporner style
  const getRatingColor = (rating) => {
    if (rating >= 80) return 'text-green-400'
    if (rating >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <Link href={`/watch/${video.id}`} className="group block">
      <div className="bg-dark-secondary rounded-lg overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 card-hover">
        {/* Thumbnail Container */}
        <div className="relative aspect-video bg-gray-900 overflow-hidden">
          {video.thumbnail && (
            <Image
              src={video.thumbnail}
              alt={`${video.title || 'Video'} - Watch free ${video.categories?.[0] || 'adult'} video on AREA BOKEP`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 video-thumb"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
            />
          )}
          
          {/* Hover Overlay with Play Button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 play-button">
              <i className="fas fa-play text-white text-xl ml-1"></i>
            </div>
          </div>

          {/* Duration Badge - Bottom Right */}
          <div className="absolute bottom-2 right-2 badge-duration">
            {video.durationFormatted || formatDuration(video.duration)}
          </div>

          {/* HD/4K Badge - Top Left */}
          {video.hd && (
            <div className="absolute top-2 left-2 badge-hd">
              HD
            </div>
          )}

          {/* Rating Badge - Top Right */}
          <div className="absolute top-2 right-2 flex items-center gap-1 badge-rating">
            <i className={`fas fa-thumbs-up ${getRatingColor(video.rating)}`}></i>
            <span className="text-white font-medium">{video.rating ? Math.round(video.rating) : 0}%</span>
          </div>
        </div>
        
        {/* Video Info */}
        <div className="p-3">
          {/* Title */}
          <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-tight mb-2">
            {video.title}
          </h3>
          
          {/* Meta Info Row */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="flex items-center">
              <i className="fas fa-eye mr-1.5 text-gray-500"></i>
              {formatViews(video.views)}
            </span>
            <span className="flex items-center">
              <i className="fas fa-calendar-alt mr-1.5 text-gray-500"></i>
              {video.added ? new Date(video.added).toLocaleDateString() : 'Recently'}
            </span>
          </div>
          
          {/* Pornstars */}
          {video.pornstars && video.pornstars.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <i className="fas fa-user-circle text-gray-500 text-xs"></i>
              <span className="text-xs text-gray-400 truncate">
                {video.pornstars.slice(0, 3).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
