/**
 * Additional Eporner Pages Scraper
 * Scrapes: /cats/, /pornstar-list/, /channels/
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');

function fetch(url) {
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
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

function parseHTML(html) {
  return {
    html,
    
    getTitle() {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return match ? match[1].trim() : null;
    },
    
    getMeta(name) {
      let match = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
                  html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'));
      return match ? match[1] : null;
    },
    
    getCSSLinks() {
      const links = [];
      const regex = /<link[^>]+href=["']([^"']+\.css[^"']*)["'][^>]*>/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        if (!links.includes(match[1])) links.push(match[1]);
      }
      return links;
    },
    
    getLinks(pattern = null) {
      const links = [];
      const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        if (pattern) {
          if (match[1].includes(pattern)) links.push(match[1]);
        } else {
          links.push(match[1]);
        }
      }
      return [...new Set(links)];
    },
    
    getImages() {
      const images = [];
      const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        images.push(match[1]);
      }
      return [...new Set(images)];
    },
    
    getAllClasses() {
      const classes = [];
      const regex = /class=["']([^"']+)["']/g;
      let match;
      while ((match = regex.exec(html)) !== null) {
        match[1].split(/\s+/).forEach(c => classes.push(c));
      }
      return [...new Set(classes)];
    },
    
    getColors() {
      const colors = new Set();
      const hexRegex = /#([0-9a-fA-F]{3,8})/g;
      let match;
      while ((match = hexRegex.exec(html)) !== null) {
        colors.add(match[0]);
      }
      return [...colors];
    },
    
    getStructure() {
      return {
        hasHeader: html.includes('<header'),
        hasNav: html.includes('<nav'),
        hasMain: html.includes('<main'),
        hasFooter: html.includes('<footer'),
      };
    },
  };
}

async function scrapePages() {
  const baseUrl = 'https://www.eporner.com';
  const pages = [
    `${baseUrl}/cats/`,
    `${baseUrl}/pornstar-list/`,
    `${baseUrl}/channels/`,
  ];

  const results = {};

  console.log('='.repeat(60));
  console.log('SCRAPING ADDITIONAL EPORNER PAGES');
  console.log('='.repeat(60));

  for (const url of pages) {
    console.log(`\n📄 Scraping: ${url}`);
    
    try {
      const html = await fetch(url);
      const p = parseHTML(html);
      
      const pageData = {
        url: url,
        title: p.getTitle(),
        description: p.getMeta('description'),
        cssFiles: p.getCSSLinks(),
        structure: p.getStructure(),
        classes: p.getAllClasses(),
        colors: p.getColors(),
        
        // Extract relevant links based on page type
        categoryLinks: p.getLinks('/cat/').slice(0, 30),
        pornstarLinks: p.getLinks('/pornstar/').slice(0, 30),
        channelLinks: p.getLinks('/channel/').slice(0, 30),
        videoLinks: p.getLinks('/video/').slice(0, 30),
        
        // Images
        images: p.getImages().slice(0, 20),
      };
      
      results[url] = pageData;
      
      console.log(`   ✅ Title: ${pageData.title?.substring(0, 60)}`);
      console.log(`   ✅ Categories: ${pageData.categoryLinks.length}`);
      console.log(`   ✅ Pornstars: ${pageData.pornstarLinks.length}`);
      console.log(`   ✅ Channels: ${pageData.channelLinks.length}`);
      console.log(`   ✅ Classes: ${pageData.classes.length}`);
      console.log(`   ✅ Colors: ${pageData.colors.length}`);
      
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
      results[url] = { error: e.message };
    }
  }

  // Save results
  console.log('\n💾 Saving results...');
  fs.writeFileSync('eporner_extra_pages.json', JSON.stringify(results, null, 2));
  console.log('   ✅ eporner_extra_pages.json');
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  for (const [url, data] of Object.entries(results)) {
    if (!data.error) {
      console.log(`\n📌 ${url}`);
      console.log(`   Title: ${data.title}`);
      console.log(`   Categories: ${data.categoryLinks.length}`);
      console.log(`   Pornstars: ${data.pornstarLinks.length}`);
      console.log(`   Channels: ${data.channelLinks.length}`);
      console.log(`   Classes: ${data.classes.slice(0, 10).join(', ')}`);
      console.log(`   Colors: ${data.colors.join(', ')}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

scrapePages().catch(console.error);
