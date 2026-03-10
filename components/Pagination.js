export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  baseUrl = '/',
  onPageChange = null
}) {
  if (totalPages <= 1) return null

  // Helper to build page URL - handles baseUrl with existing query params
  const buildPageUrl = (page) => {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}page=${page}`
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-10 py-4">
      {/* Previous button */}
      {currentPage > 1 && (
        onPageChange ? (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-4 py-2 bg-dark-secondary text-white rounded-lg hover:bg-primary transition-all text-sm font-medium flex items-center gap-2"
          >
            <i className="fas fa-chevron-left"></i> Previous
          </button>
        ) : (
          <a
            href={buildPageUrl(currentPage - 1)}
            className="px-4 py-2 bg-dark-secondary text-white rounded-lg hover:bg-primary transition-all text-sm font-medium flex items-center gap-2"
          >
            <i className="fas fa-chevron-left"></i> Previous
          </a>
        )
      )}

      {/* Page numbers */}
      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 text-sm">...</span>
          ) : (
            onPageChange ? (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[40px] px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-dark-secondary text-white hover:bg-primary/80'
                }`}
              >
                {page}
              </button>
            ) : (
              <a
                key={page}
                href={buildPageUrl(page)}
                className={`min-w-[40px] px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-dark-secondary text-white hover:bg-primary/80'
                }`}
              >
                {page}
              </a>
            )
          )
        ))}
      </div>

      {/* Next button */}
      {currentPage < totalPages && (
        onPageChange ? (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-4 py-2 bg-dark-secondary text-white rounded-lg hover:bg-primary transition-all text-sm font-medium flex items-center gap-2"
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        ) : (
          <a
            href={buildPageUrl(currentPage + 1)}
            className="px-4 py-2 bg-dark-secondary text-white rounded-lg hover:bg-primary transition-all text-sm font-medium flex items-center gap-2"
          >
            Next <i className="fas fa-chevron-right"></i>
          </a>
        )
      )}
    </div>
  )
}
