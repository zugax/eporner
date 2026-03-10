/**
 * Eporner Pornstar Detail Scraper
 * Scrapes detailed data (images, videos count, rating) from pornstar pages
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');

// Load existing pornstars
const existingData = JSON.parse(fs.readFileSync('eporner_pornstars.json', 'utf8'));
const pornstars = existingData.pornstars;

console.log('Loaded ' + pornstars.length + ' pornstars');

// Simple HTTP request helper
function fetch(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cookie': 'agever=1; ageaccess=1'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', (e) => {
      if (retries > 0) {
        setTimeout(() => resolve(fetch(url, retries - 1)), 1500);
      } else {
        reject(e);
      }
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// Parse pornstar detail page - improved
function parsePornstarDetail(html, url) {
  const result = {
    thumb: '',
    videos: 0,
    rating: 0,
    views: 0
  };
  
  // Look for profile image in various formats
  // Pattern 1: mbimg class
  let imgMatch = html.match(/<img[^>]+class="[^"]*mbimg[^"]*"[^>]+src="([^"]+)"[^>]*>/i);
  if (imgMatch) {
    result.thumb = imgMatch[1];
  }
  
  // Pattern 2: data-src attribute
  if (!result.thumb) {
    imgMatch = html.match(/<img[^>]+data-src="([^"]+avatar[^"]*)"[^>]*>/i);
    if (imgMatch) {
      result.thumb = imgMatch[1];
    }
  }
  
  // Pattern 3: Look in profile-info div
  if (!result.thumb) {
    imgMatch = html.match(/<div[^>]+class="[^"]*profile-info[^"]*"[^>]*>[\s]*<img[^>]+src="([^"]+)"[^>]*>/i);
    if (imgMatch) {
      result.thumb = imgMatch[1];
    }
  }
  
  // Pattern 4: Look for any avatar image
  if (!result.thumb) {
    imgMatch = html.match(/<img[^>]+src="(https:\/\/[^"]*\/avatar[^"]*)"[^>]*>/i);
    if (imgMatch) {
      result.thumb = imgMatch[1];
    }
  }
  
  // Pattern 5: epavatar class
  if (!result.thumb) {
    imgMatch = html.match(/<img[^>]+class="[^"]*epavatar[^"]*"[^>]+src="([^"]+)"[^>]*>/i);
    if (imgMatch) {
      result.thumb = imgMatch[1];
    }
  }
  
  // Look for video count
  const videosMatch = html.match(/(\d[\d,]*(?:\.\d+)?)\s*(?:videos|porn\s*videos)/i) ||
                      html.match(/(\d[\d,]*)\s*videos/i);
  if (videosMatch) {
    result.videos = parseInt(videosMatch[1].replace(/,/g, ''), 10);
  }
  
  // Look for rating
  const ratingMatch = html.match(/(\d+(?:\.\d+)?)\s*%?\s*(?:rating|rate)/i) ||
                     html.match(/rating["\s:]+(\d+(?:\.\d+)?)/i);
  if (ratingMatch) {
    result.rating = Math.round(parseFloat(ratingMatch[1]));
  }
  
  // Look for views
  const viewsMatch = html.match(/(\d[\d,]*(?:\.\d+)?)\s*(?:views|views?)/i);
  if (viewsMatch) {
    result.views = parseInt(viewsMatch[1].replace(/,/g, ''), 10);
  }
  
  return result;
}

// Main scraper - fetch details for first 50 pornstars
async function scrapeDetails() {
  console.log('============================================================');
  console.log('EPORNER PORNSTAR DETAIL SCRAPER');
  console.log('============================================================');
  
  const limit = Math.min(100, pornstars.length);
  
  for (let i = 0; i < limit; i++) {
    const ps = pornstars[i];
    console.log('\nFetching: ' + ps.name + ' (' + ps.url + ')');
    
    try {
      const html = await fetch(ps.url);
      const details = parsePornstarDetail(html, ps.url);
      
      // Update pornstar data
      if (details.thumb && details.thumb.startsWith('http')) {
        ps.thumb = details.thumb;
      }
      if (details.videos > 0) {
        ps.videos = details.videos;
      }
      if (details.rating > 0) {
        ps.rating = details.rating;
      }
      if (details.views > 0) {
        ps.views = details.views;
      }
      
      console.log('  Videos: ' + ps.videos);
      console.log('  Rating: ' + ps.rating);
      console.log('  Thumb: ' + (details.thumb ? details.thumb.substring(0, 50) + '...' : 'Not found'));
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 600));
      
    } catch (e) {
      console.log('  Error: ' + e.message);
    }
  }
  
  // Save updated data
  const result = {
    timestamp: new Date().toISOString(),
    total: pornstars.length,
    pornstars: pornstars
  };
  
  fs.writeFileSync('eporner_pornstars.json', JSON.stringify(result, null, 2));
  console.log('\n============================================================');
  console.log('Saved to eporner_pornstars.json');
  console.log('============================================================');
  
  return result;
}

scrapeDetails().catch(console.error);
