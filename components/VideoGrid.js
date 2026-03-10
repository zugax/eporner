import VideoCard from './VideoCard'

export default function VideoGrid({ videos, title, viewAllLink }) {
  if (!videos || videos.length === 0) {
    return null
  }

  return (
    <section className="mb-10">
      {title && (
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white flex items-center">{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center gap-1">
              View All <i className="fas fa-arrow-right ml-1"></i>
            </a>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  )
}
