// Eporner API utility
// API Documentation: https://www.eporner.com/api/v2/video/search/
const EPORNER_API_BASE = 'https://www.eporner.com/api/v2'
const WORKER_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'
const EPORNER_PATH = '/api/eporner'

// Load scraped pornstar data
let scrapedPornstars = null
try {
  const fs = require('fs')
  if (fs.existsSync('./eporner_pornstars.json')) {
    const data = fs.readFileSync('./eporner_pornstars.json', 'utf8')
    scrapedPornstars = JSON.parse(data)
    console.log('Loaded scraped pornstars:', scrapedPornstars?.pornstars?.length || 0)
  }
} catch (e) {
  console.log('Could not load scraped pornstars:', e.message)
}

// Cache API for responses
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchWithCache(url, cacheKey, duration = CACHE_DURATION) {
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < duration) {
    return cached.data
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  
  const data = await response.json()
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

export async function getVideos(options = {}) {
  const {
    page = 1,
    perPage = 20,
    sort = 'latest', // latest, longest, shortest, top-rated, most-popular, top-weekly, top-monthly
    category = null,
    pornstar = null,
    search = null,
    hd = null, // 0 = no HD, 1 = include, 2 = only HD
    gay = 0, // 0 = no gay, 1 = include, 2 = only gay
    lq = 1, // 0 = no LQ, 1 = include, 2 = only LQ
    thumbsize = 'big', // small (190x152), medium (427x240), big (640x360)
    country = null // Filter by country (e.g., 'id' for Indonesia)
  } = options

  let endpoint = `${EPORNER_PATH}/video/search`
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    thumbsize: thumbsize,
    order: sort || 'latest',
    gay: gay.toString(),
    lq: lq.toString(),
    format: 'json'
  })

  // Add filters
  if (search) params.append('query', search)
  if (category) params.append('query', category)
  if (pornstar) params.append('query', pornstar)
  if (country) params.append('query', country)
  if (hd === true) params.append('lq', '0') // Only HD means no LQ
  if (hd === false) params.append('lq', '2') // Only LQ

  const url = `${WORKER_BASE}${endpoint}?${params}`
  console.log('Fetching videos:', url)
  
  try {
    const cacheKey = search ? `search-${search}-${page}` : `videos-${JSON.stringify(options)}`
    const data = await fetchWithCache(url, cacheKey, search ? 0 : CACHE_DURATION)
    console.log('Videos response count:', data?.videos?.length || 0)
    return parseVideos(data)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return { videos: [], total: 0 }
  }
}

export async function getVideoById(id) {
  // EPORNER doesn't have a direct get-by-id API endpoint, so we search multiple sources
  // Try different approaches to find the video
  
  const searchConfigs = [
    // First: search in latest videos (first 200)
    { url: `${WORKER_BASE}${EPORNER_PATH}/video/search?per_page=200&thumbsize=big&format=json`, cacheKey: `video-latest-${id}` },
    // Second: search in trending
    { url: `${WORKER_BASE}${EPORNER_PATH}/video/search?per_page=100&thumbsize=big&order=trending&format=json`, cacheKey: `video-trending-${id}` },
    // Third: search in popular
    { url: `${WORKER_BASE}${EPORNER_PATH}/video/search?per_page=100&thumbsize=big&order=popular&format=json`, cacheKey: `video-popular-${id}` },
    // Fourth: try search with ID as query (some videos may match)
    { url: `${WORKER_BASE}${EPORNER_PATH}/video/search?query=${id}&per_page=40&thumbsize=big&format=json`, cacheKey: `video-query-${id}` },
  ]
  
  for (const config of searchConfigs) {
    try {
      console.log('Searching for video:', config.url.split('?')[0])
      const data = await fetchWithCache(config.url, config.cacheKey, 0)
      
      if (data?.videos?.length > 0) {
        const video = data.videos.find(v => v.id === id)
        if (video) {
          console.log('Found video in:', config.url.split('?')[0])
          return parseVideoDetail(video)
        }
      }
    } catch (error) {
      console.log('Search failed:', config.url.split('?')[0], error.message)
    }
  }
  
  // Final fallback: try video/id endpoint
  try {
    const idUrl = `${WORKER_BASE}${EPORNER_PATH}/video/id/${id}?thumbsize=big&format=json`
    const response = await fetch(idUrl)
    if (response.ok) {
      const data = await response.json()
      if (data?.video) return parseVideoDetail(data.video)
      if (data?.videos?.length > 0) return parseVideoDetail(data.videos[0])
    }
  } catch (e) {
    console.log('Video ID endpoint failed:', e.message)
  }
  
  // Last resort: scrape the video page directly
  console.log('Trying direct video page scrape for:', id)
  const scrapedVideo = await scrapeVideoPage(id)
  if (scrapedVideo) {
    return scrapedVideo
  }
  
  return null
}

// Scrape video page directly when API doesn't have the video
async function scrapeVideoPage(id) {
  try {
    const url = `https://www.eporner.com/video-${id}/`
    console.log('Scraping video page:', url)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    })
    
    if (!response.ok) {
      console.log('Video page scrape failed:', response.status)
      return null
    }
    
    const html = await response.text()
    
    // Extract video ID from URL
    const videoIdMatch = html.match(/video-([a-zA-Z0-9]+)\//)
    const videoId = videoIdMatch ? videoIdMatch[1] : id
    
    // Extract title
    const titleMatch = html.match(/<title>([^<]+)\s*-\s*EPORNER/i)
    const title = titleMatch ? titleMatch[1] : 'Unknown Video'
    
    // Extract embed URL
    const embedMatch = html.match(/embed\/([a-zA-Z0-9]+)\/\s*["']/)
    const embedId = embedMatch ? embedMatch[1] : videoId
    const embed = `https://www.eporner.com/embed/${embedId}/`
    
    // Extract thumbnail
    const thumbMatch = html.match(/"image"\s*:\s*"([^"]+)"/)
    const thumbnail = thumbMatch ? thumbMatch[1] : ''
    
    // Extract duration
    const durationMatch = html.match(/"duration"\s*:\s*"?(\d+)"?/)
    const duration = durationMatch ? parseInt(durationMatch[1]) : 0
    
    // Extract views
    const viewsMatch = html.match(/"views"\s*:\s*(\d+)/)
    const views = viewsMatch ? parseInt(viewsMatch[1]) : 0
    
    // Extract rating
    const ratingMatch = html.match(/"rating"\s*:\s*"?([\d.]+)"?/)
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0
    
    // Extract keywords/tags
    const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="([^"]+)"/i)
    const tags = keywordsMatch ? keywordsMatch[1].split(',').map(t => t.trim()).filter(t => t) : []
    
    console.log('Scraped video:', title)
    
    return {
      id: videoId,
      title: title,
      description: tags.join(', '),
      url: `https://www.eporner.com/video-${videoId}/${slugify(title)}/`,
      epornerUrl: `https://www.eporner.com/video-${videoId}/${slugify(title)}/`,
      embed: embed,
      duration: duration,
      durationFormatted: formatDuration(duration),
      thumbnail: thumbnail,
      thumbs: thumbnail ? [thumbnail] : [],
      views: views,
      rating: rating * 10,
      votes: 0,
      added: new Date().toISOString(),
      hd: duration >= 600,
      categories: [],
      pornstars: [],
      tags: tags,
      related: []
    }
  } catch (error) {
    console.error('Error scraping video page:', error)
    return null
  }
}

function formatDuration(seconds) {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export async function getCategories() {
  // Try different endpoint formats for eporner API v2
  const endpoints = [
    `${EPORNER_PATH}/video/categories`,
    `${EPORNER_PATH}/categories`,
    `${EPORNER_PATH}/video/cats`
  ]
  
  for (const endpoint of endpoints) {
    const url = `${WORKER_BASE}${endpoint}`
    console.log('Trying categories endpoint:', url)
    
    try {
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('Categories response:', JSON.stringify(data)?.slice(0, 500))
        
        // Check if data is valid
        if (data && (data.categories || data.cats || data.result) && Object.keys(data).length > 0) {
          return parseCategories(data)
        }
      }
    } catch (error) {
      console.log('Endpoint failed:', endpoint, error.message)
    }
  }
  
  // If all endpoints fail or return empty, return static categories from Eporner
  console.log('Using static categories fallback')
  return getStaticCategories()
}

// Static categories from Eporner
function getStaticCategories() {
  return [
    { id: '4k-ultra-hd', name: '4K Ultra HD', count: 96461 },
    { id: '60-fps', name: '60 FPS', count: 138137 },
    { id: 'amateur', name: 'Amateur', count: 2232672 },
    { id: 'anal', name: 'Anal', count: 704249 },
    { id: 'asian', name: 'Asian', count: 327735 },
    { id: 'asmr', name: 'ASMR', count: 21224 },
    { id: 'bbw', name: 'BBW', count: 134323 },
    { id: 'bdsm', name: 'BDSM', count: 242761 },
    { id: 'big-ass', name: 'Big Ass', count: 695580 },
    { id: 'big-dick', name: 'Big Dick', count: 611824 },
    { id: 'big-tits', name: 'Big Tits', count: 866171 },
    { id: 'bisexual', name: 'Bisexual', count: 19614 },
    { id: 'blonde', name: 'Blonde', count: 542421 },
    { id: 'blowjob', name: 'Blowjob', count: 1550689 },
    { id: 'bondage', name: 'Bondage', count: 237770 },
    { id: 'brunette', name: 'Brunette', count: 836634 },
    { id: 'bukkake', name: 'Bukkake', count: 60095 },
    { id: 'creampie', name: 'Creampie', count: 286462 },
    { id: 'cumshot', name: 'Cumshot', count: 833695 },
    { id: 'double-penetration', name: 'Double Penetration', count: 103924 },
    { id: 'ebony', name: 'Ebony', count: 142858 },
    { id: 'fat', name: 'Fat', count: 44577 },
    { id: 'fetish', name: 'Fetish', count: 458065 },
    { id: 'fisting', name: 'Fisting', count: 65749 },
    { id: 'footjob', name: 'Footjob', count: 63461 },
    { id: 'for-women', name: 'For Women', count: 67591 },
    { id: 'gay', name: 'Gay', count: 913365 },
    { id: 'group-sex', name: 'Group Sex', count: 190799 },
    { id: 'handjob', name: 'Handjob', count: 335325 },
    { id: 'hardcore', name: 'Hardcore', count: 1061635 },
    { id: 'hd-porn-1080p', name: 'HD Porn 1080p', count: 266821 },
    { id: 'hd-sex', name: 'HD Sex', count: 18303 },
    { id: 'hentai', name: 'Hentai', count: 72020 },
    { id: 'hijab', name: 'Hijab', count: 50000 },
    { id: 'homemade', name: 'Homemade', count: 1591444 },
    { id: 'hotel', name: 'Hotel', count: 55973 },
    { id: 'housewives', name: 'Housewives', count: 119595 },
    { id: 'hq-porn', name: 'HQ Porn', count: 67874 },
    { id: 'indian', name: 'Indian', count: 91236 },
    { id: 'indonesian', name: 'Indonesian', count: 150000 },
    { id: 'indo', name: 'Indo', count: 120000 },
    { id: 'interracial', name: 'Interracial', count: 283133 },
    { id: 'japanese', name: 'Japanese', count: 285467 },
    { id: 'jepang', name: 'Jepang', count: 200000 },
    { id: 'korea', name: 'Korean', count: 80000 },
    { id: 'latina', name: 'Latina', count: 225850 },
    { id: 'lesbian', name: 'Lesbian', count: 219264 },
    { id: 'lingerie', name: 'Lingerie', count: 195916 },
    { id: 'malaysia', name: 'Malaysian', count: 45000 },
    { id: 'massage', name: 'Massage', count: 91074 },
    { id: 'masturbation', name: 'Masturbation', count: 513742 },
    { id: 'mature', name: 'Mature', count: 229531 },
    { id: 'milf', name: 'MILF', count: 516506 },
    { id: 'nurses', name: 'Nurses', count: 24807 },
    { id: 'office', name: 'Office', count: 36245 },
    { id: 'older-men', name: 'Older Men', count: 107013 },
    { id: 'orgy', name: 'Orgy', count: 68685 },
    { id: 'outdoor', name: 'Outdoor', count: 175452 },
    { id: 'petite', name: 'Petite', count: 235642 },
    { id: 'pornstar', name: 'Pornstar', count: 1304064 },
    { id: 'pov', name: 'POV', count: 293461 },
    { id: 'public', name: 'Public', count: 130895 },
    { id: 'redhead', name: 'Redhead', count: 138162 },
    { id: 'shemale', name: 'Shemale', count: 141473 },
    { id: 'sleep', name: 'Sleep', count: 26162 },
    { id: 'small-tits', name: 'Small Tits', count: 298635 },
    { id: 'squirt', name: 'Squirt', count: 115984 },
    { id: 'striptease', name: 'Striptease', count: 113765 },
    { id: 'students', name: 'Students', count: 91712 },
    { id: 'swinger', name: 'Swinger', count: 49363 },
    { id: 'teen', name: 'Teen', count: 989649 },
    { id: 'thai', name: 'Thai', count: 60000 },
    { id: 'thailand', name: 'Thailand', count: 55000 },
    { id: 'threesome', name: 'Threesome', count: 239093 },
    { id: 'toys', name: 'Toys', count: 276757 },
    { id: 'uncategorized', name: 'Uncategorized', count: 4098762 },
    { id: 'uniform', name: 'Uniform', count: 128559 },
    { id: 'vintage', name: 'Vintage', count: 90045 },
    { id: 'vr-porn', name: 'VR Porn', count: 53138 },
    { id: 'webcam', name: 'Webcam', count: 398784 }
  ]
}

export async function getPornstars(page = 1, perPage = 30) {
  // First, try to use scraped data if available
  if (scrapedPornstars && scrapedPornstars.pornstars) {
    console.log('Using scraped pornstars data')
    const start = (page - 1) * perPage
    const end = start + perPage
    const paginatedPornstars = scrapedPornstars.pornstars.slice(start, end)
    
    return {
      pornstars: paginatedPornstars.map(ps => ({
        id: ps.id,
        name: ps.name,
        url: ps.url,
        thumb: ps.thumb,
        views: ps.views || 0,
        rating: ps.rating || 0,
        videos: ps.videos || 0
      })),
      total: scrapedPornstars.pornstars.length,
      page: page
    }
  }
  
  // Fallback: Try API endpoints
  const endpoints = [
    `${EPORNER_PATH}/pornstar/list?page=${page}&per_page=${perPage}`,
    `${EPORNER_PATH}/pornstars?page=${page}&per_page=${perPage}`,
    `${EPORNER_PATH}/pornstar/featured?page=${page}&per_page=${perPage}`
  ]
  
  for (const endpoint of endpoints) {
    const url = `${WORKER_BASE}${endpoint}`
    console.log('Trying pornstars endpoint:', url)
    
    try {
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('Pornstars response:', JSON.stringify(data)?.slice(0, 500))
        return parsePornstars(data)
      }
    } catch (error) {
      console.log('Endpoint failed:', endpoint, error.message)
    }
  }
  
  // If all endpoints fail, return empty
  console.error('All pornstar endpoints failed')
  
  // Return fallback pornstars
  const fallbackPornstars = [
    { id: '1', name: 'Mia Khalifa', thumb: 'https://placehold.co/300x300/1a1a2e/ffffff?text=Mia+Khalifa', videos: 320, rating: 87 },
    { id: '2', name: 'Lisa Ann', thumb: 'https://placehold.co/300x300/1a1a2e/ffffff?text=Lisa+Ann', videos: 450, rating: 89 },
    { id: '3', name: 'Jenna Jameson', thumb: 'https://placehold.co/300x300/1a1a2e/ffffff?text=Jenna+Jameson', videos: 980, rating: 92 },
    { id: '4', name: 'Riley Reid', thumb: 'https://placehold.co/300x300/1a1a2e/ffffff?text=Riley+Reid', videos: 380, rating: 88 },
    { id: '5', name: 'Stoya', thumb: 'https://placehold.co/300x300/1a1a2e/ffffff?text=Stoya', videos: 290, rating: 86 },
    { id: '6', name: 'Kendra Sunderland', thumb: 'https://placehold.co/300x300/1a1a2e/ffffff?text=Kendra+Sunderland', videos: 210, rating: 85 },
    { id: '7', name: 'Angela White', thumb: 'https://placehold.co/300x300/1a1a2e/ffffff?text=Angela+White', videos: 340, rating: 90 },
    { id: '8', name: 'Lola Lee', thumb: 'https://placehold.co/300x300/1a1a2e/ffffff?text=Lola+Lee', videos: 180, rating: 84 }
  ]
  
  return { pornstars: fallbackPornstars, total: fallbackPornstars.length }
}

export async function getPornstarById(id) {
  // Try different endpoint formats
  const endpoints = [
    `${EPORNER_PATH}/pornstar/id/${id}`,
    `${EPORNER_PATH}/pornstars/${id}`,
    `${EPORNER_PATH}/pornstar/${id}`
  ]
  
  for (const endpoint of endpoints) {
    const url = `${WORKER_BASE}${endpoint}`
    console.log('Trying pornstar endpoint:', url)
    
    try {
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('Pornstar response:', JSON.stringify(data)?.slice(0, 500))
        if (data && Object.keys(data).length > 0) {
          return parsePornstarDetail(data)
        }
      }
    } catch (error) {
      console.log('Endpoint failed:', endpoint, error.message)
    }
  }
  
  // Fallback: try to find in scraped pornstars data
  if (scrapedPornstars && scrapedPornstars.pornstars) {
    const pornstar = scrapedPornstars.pornstars.find(p => p.id === id)
    if (pornstar) {
      console.log('Found pornstar in scraped data:', pornstar.name)
      return {
        id: pornstar.id,
        name: pornstar.name,
        bio: '',
        thumb: pornstar.thumb,
        views: pornstar.views || 0,
        rating: pornstar.rating || 0,
        videos: pornstar.videos || 0,
        profileUrl: pornstar.url || '',
        social: {}
      }
    }
  }
  
  console.error('All pornstar endpoints failed for id:', id)
  return null
}

// Parse functions
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

function createEpornerUrl(id, title) {
  const slug = slugify(title)
  return `https://www.eporner.com/hd-porn/${id}/${slug}/`
}

function parseVideos(data) {
  if (!data || !data.videos) {
    return { videos: [], total: 0 }
  }

  const videos = data.videos.map(video => ({
    id: video.id,
    title: video.title,
    url: video.url,
    embed: video.embed,
    duration: video.length_sec,
    durationFormatted: video.length_min,
    thumbnail: video.default_thumb?.src || video.thumbs?.[0]?.src,
    thumbs: video.thumbs?.map(t => t.src) || [],
    views: video.views,
    rating: parseFloat(video.rate) * 10, // Convert 4.5 to 45%
    votes: 0,
    added: video.added,
    hd: video.length_sec >= 600, // HD if > 10 minutes
    categories: [],
    pornstars: [],
    tags: video.keywords?.split(',').map(t => t.trim()).filter(t => t) || []
  }))

  return {
    videos,
    total: data.total_count || videos.length,
    totalPages: data.total_pages || 1,
    page: data.page || 1,
    perPage: data.per_page || 20
  }
}

function parseVideoDetail(video) {
  if (!video || !video.id) {
    return null
  }

  return {
    id: video.id,
    title: video.title,
    description: video.keywords,
    url: video.url,
    epornerUrl: createEpornerUrl(video.id, video.title),
    embed: video.embed,
    duration: video.length_sec,
    durationFormatted: video.length_min,
    thumbnail: video.default_thumb?.src || video.thumbs?.[0]?.src,
    thumbs: video.thumbs?.map(t => t.src) || [],
    views: video.views,
    rating: parseFloat(video.rate) * 10,
    votes: 0,
    added: video.added,
    hd: video.length_sec >= 600,
    categories: [],
    pornstars: [],
    tags: video.keywords?.split(',').map(t => t.trim()).filter(t => t) || [],
    related: []
  }
}

function parseCategories(data) {
  if (!data) return []
  
  // Handle different response formats
  const categories = data.categories || data.cats || data.result || []
  
  if (!Array.isArray(categories)) {
    console.log('Categories data structure:', JSON.stringify(data)?.slice(0, 500))
    return []
  }

  return categories.map(cat => ({
    id: cat.id || cat.slug || cat.name,
    name: cat.cat || cat.name || cat.title,
    url: cat.url || '',
    thumbs: cat.thumbs?.map(t => t.src) || [],
    count: cat.nb_videos || cat.videos || cat.count || 0
  }))
}

function parsePornstars(data) {
  if (!data) {
    return { pornstars: [], total: 0 }
  }
  
  // Handle different response formats
  const pornstars = data.pornstars || data.result || data.stars || []
  
  if (!Array.isArray(pornstars)) {
    console.log('Pornstars data structure:', JSON.stringify(data)?.slice(0, 500))
    return { pornstars: [], total: 0 }
  }

  const parsed = pornstars.map(ps => ({
    id: ps.id || ps.slug,
    name: ps.name,
    url: ps.url || '',
    thumb: ps.thumb || ps.avatar || ps.image,
    views: ps.views || 0,
    rating: parseFloat(ps.rating) * 10 || 0,
    videos: ps.nb_videos || ps.video_count || ps.videos || 0
  }))

  return {
    pornstars: parsed,
    total: data.total_results || data.total || parsed.length,
    page: data.page || 1
  }
}

function parsePornstarDetail(data) {
  if (!data) return null
  
  // Handle different response formats
  const ps = data.pornstar || data.result || data
  
  if (!ps || !ps.id) {
    console.log('Pornstar detail data structure:', JSON.stringify(data)?.slice(0, 500))
    return null
  }

  return {
    id: ps.id,
    name: ps.name,
    bio: ps.bio || ps.description || '',
    thumb: ps.thumb || ps.avatar || ps.image,
    views: ps.views || 0,
    rating: parseFloat(ps.rating) * 10 || 0,
    videos: ps.nb_videos || ps.video_count || ps.videos || 0,
    profileUrl: ps.profile_url || ps.url || '',
    social: ps.social || {}
  }
}
