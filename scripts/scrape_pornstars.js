/**
 * Eporner Pornstar List Scraper - Complete Version
 * Scrapes all pornstar data from https://www.eporner.com/pornstar-list/
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');

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

// Parse pornstar list from HTML - fixed version
function parsePornstarList(html) {
  const pornstars = [];
  
  // Find all pornstar links using different patterns
  const patterns = [
    /<a[^>]+href="(\/pornstar\/[^"]+)"[^>]*>/gi,
    /href="(\/pornstar\/[^"]+)"/gi
  ];
  
  const links = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const link = match[1];
      if (link.includes('/pornstar/') && !link.includes('/cat/') && !link.includes('/video/')) {
        links.push(link);
      }
    }
  }
  
  // Get unique links
  const uniqueLinks = [...new Set(links)];
  console.log('Found ' + uniqueLinks.length + ' pornstar links');
  
  // Find pagination - look for /pornstar-list/X/ pattern
  const pagePattern = /<a[^>]+href="(\/pornstar-list\/\d+\/)"[^>]*>/gi;
  const pages = [];
  let match;
  while ((match = pagePattern.exec(html)) !== null) {
    pages.push(match[1]);
  }
  
  // Also check for "next" link
  const nextPattern = /<link[^>]+rel="next"[^>]+href="([^"]+)"[^>]*>/i;
  const nextMatch = html.match(nextPattern);
  if (nextMatch) {
    const nextUrl = new URL(nextMatch[1]);
    const nextPage = nextUrl.pathname;
    if (!pages.includes(nextPage)) {
      pages.push(nextPage);
    }
  }
  
  const uniquePages = [...new Set(pages)];
  console.log('Pagination pages: ' + uniquePages.length);
  
  return {
    links: uniqueLinks,
    pagination: uniquePages
  };
}

// Extract pornstar ID from URL
function extractPornstarId(url) {
  const match = url.match(/\/pornstar\/([^/]+)\/?$/);
  return match ? match[1] : url.replace('/pornstar/', '').replace('/', '');
}

// Main scraper - scrape all pages
async function scrapePornstarList() {
  const baseUrl = 'https://www.eporner.com';
  const maxPages = 20; // Scrape up to 20 pages
  const allLinks = [];
  
  console.log('============================================================');
  console.log('EPORNER PORNSTAR LIST SCRAPER - COMPLETE');
  console.log('============================================================');
  
  // Scrape first page
  let currentPage = 1;
  let hasMore = true;
  let pageUrl = baseUrl + '/pornstar-list/';
  
  while (hasMore && currentPage <= maxPages) {
    console.log('\n--- Page ' + currentPage + ' ---');
    console.log('Scraping: ' + pageUrl);
    
    try {
      const html = await fetch(pageUrl);
      console.log('Fetched ' + html.length + ' bytes');
      
      const data = parsePornstarList(html);
      
      // Add links to our collection
      allLinks.push(...data.links);
      console.log('Total links so far: ' + allLinks.length);
      
      // Check for next page
      if (data.pagination.length > 0 && currentPage < maxPages) {
        const nextPage = data.pagination[0];
        pageUrl = baseUrl + nextPage;
        currentPage++;
        console.log('Next page: ' + pageUrl);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        hasMore = false;
        console.log('No more pages or reached max pages');
      }
      
    } catch (e) {
      console.log('Error: ' + e.message);
      hasMore = false;
    }
  }
  
  // Remove duplicates
  const uniqueLinks = [...new Set(allLinks)];
  console.log('\nTotal unique pornstars: ' + uniqueLinks.length);
  
  // Build pornstar data
  const pornstars = uniqueLinks.map(function(link) {
    const id = extractPornstarId(link);
    const name = id.replace(/-[a-zA-Z0-9]+$/, '').replace(/-/g, ' ');
    
    return {
      id: id,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      url: baseUrl + link,
      thumb: 'https://placehold.co/300x300/1a1a2e/ffffff?text=' + encodeURIComponent(name),
      videos: 0,
      rating: 0,
      views: 0
    };
  });
  
  // Save to file
  const result = {
    timestamp: new Date().toISOString(),
    total: pornstars.length,
    pornstars: pornstars
  };
  
  fs.writeFileSync('eporner_pornstars.json', JSON.stringify(result, null, 2));
  console.log('\n============================================================');
  console.log('Saved ' + pornstars.length + ' pornstars to eporner_pornstars.json');
  console.log('============================================================');
  
  // Print sample
  console.log('\nSample pornstars:');
  for (let i = 0; i < Math.min(15, pornstars.length); i++) {
    console.log('  ' + (i + 1) + '. ' + pornstars[i].name + ' (' + pornstars[i].id + ')');
  }
  
  return result;
}

scrapePornstarList().catch(console.error);
