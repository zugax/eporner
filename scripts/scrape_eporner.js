/**
 * Eporner Web Scraper Tool (Node.js)
 * Scrapes eporner.com to extract HTML/CSS structure for styling reference
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Simple HTTP request helper
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

// Simple HTML parser (basic regex-based)
function parseHTML(html) {
  return {
    html,
    // Find title
    getTitle() {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return match ? match[1].trim() : null;
    },
    // Find meta description
    getMeta(name) {
      const match = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
                   html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'));
      return match ? match[1] : null;
    },
    // Find all CSS links
    getCSSLinks() {
      const links = [];
      const regex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi;
      let match;
      while ((match = regex.exec(html)) !== null) {
        links.push(match[1]);
      }
      // Also match href before rel
      const regex2 = /<link[^>]+href=["']([^"']+\.css[^"']*)["'][^>]*>/gi;
      while ((match = regex2.exec(html)) !== null) {
        if (!links.includes(match[1])) links.push(match[1]);
      }
      return links;
    },
    // Find all links matching pattern
    getLinks(pattern) {
      const links = [];
      const regex = new RegExp(`<a[^>]+href=["']([^"']*${pattern}[^"']*)["'][^>]*>`, 'gi');
      let match;
      while ((match = regex.exec(html)) !== null) {
        links.push(match[1]);
      }
      return [...new Set(links)];
    },
    // Find elements by class pattern
    getElementsByClass(pattern) {
      const regex = new RegExp(`<([a-z]+)[^>]+class=["'][^"']*${pattern}[^"']*["'][^>]*>`, 'gi');
      const elements = [];
      let match;
      while ((match = regex.exec(html)) !== null) {
        elements.push(match[1]);
      }
      return elements;
    },
    // Extract hex colors
    getColors() {
      const colors = new Set();
      const hexRegex = /#([0-9a-fA-F]{3,8})/g;
      let match;
      while ((match = hexRegex.exec(html)) !== null) {
        colors.add(match[0]);
      }
      // RGB colors
      const rgbRegex = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
      while ((match = rgbRegex.exec(html)) !== null) {
        colors.add(`rgb(${match[1]}, ${match[2]}, ${match[3]})`);
      }
      return [...colors].slice(0, 30);
    },
    // Find main structural elements
    getStructure() {
      const structure = {
        header: this.getElementsByClass('header').length > 0,
        nav: html.includes('<nav'),
        main: html.includes('<main'),
        footer: html.includes('<footer'),
        sidebar: this.getElementsByClass('sidebar').length > 0,
      };
      return structure;
    },
  };
}

async function scrapeEporner() {
  const baseUrl = 'https://www.eporner.com';
  
  console.log('='.repeat(60));
  console.log('SCRAPING EPORNER.COM');
  console.log('='.repeat(60));

  try {
    // Scrape homepage
    console.log('\n📌 Fetching homepage...');
    const homepageHtml = await fetch(baseUrl);
    const homepage = parseHTML(homepageHtml);
    
    console.log(`\n✅ Page Title: ${homepage.getTitle()}`);
    console.log(`📝 Meta Description: ${homepage.getMeta('description')?.substring(0, 100)}...`);
    
    // CSS Files
    console.log('\n📄 CSS Files:');
    const cssFiles = homepage.getCSSLinks();
    cssFiles.slice(0, 10).forEach((css, i) => {
      console.log(`  ${i + 1}. ${css}`);
    });
    
    // Main navigation
    console.log('\n🔗 Main Navigation Links:');
    const navLinks = homepage.getLinks('/(home|videos|categories|pornstars|trending|popular)');
    navLinks.slice(0, 10).forEach(link => {
      console.log(`  - ${link}`);
    });
    
    // Video links
    console.log('\n🎬 Sample Video Links:');
    const videoLinks = homepage.getLinks('/video/');
    videoLinks.slice(0, 5).forEach(link => {
      console.log(`  - ${link}`);
    });
    
    // Category links
    console.log('\n📂 Category Links:');
    const categoryLinks = homepage.getLinks('/(cat|category)');
    categoryLinks.slice(0, 8).forEach(link => {
      console.log(`  - ${link}`);
    });
    
    // Colors found
    console.log('\n🎨 Colors found:');
    const colors = homepage.getColors();
    colors.slice(0, 15).forEach(color => {
      console.log(`  - ${color}`);
    });
    
    // Structure
    console.log('\n🏗️ Page Structure:');
    const structure = homepage.getStructure();
    Object.entries(structure).forEach(([key, value]) => {
      console.log(`  ${key}: ${value ? '✓' : '✗'}`);
    });
    
    // Try to find video page structure
    if (videoLinks.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('SCRAPING VIDEO PAGE');
      console.log('='.repeat(60));
      
      const videoUrl = new URL(videoLinks[0], baseUrl).href;
      console.log(`\n📌 Fetching: ${videoUrl}`);
      
      try {
        const videoHtml = await fetch(videoUrl);
        const videoPage = parseHTML(videoHtml);
        
        console.log(`\n✅ Video Page Title: ${videoPage.getTitle()}`);
        
        // Video embed
        const iframeMatch = videoHtml.match(/<iframe[^>]+src=["']([^"']+)["']/i);
        if (iframeMatch) {
          console.log(`\n🎬 Video Embed: ${iframeMatch[1].substring(0, 80)}...`);
        }
        
        // Video info
        const titleMatch = videoHtml.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (titleMatch) {
          console.log(`\n📌 Video Title: ${titleMatch[1].trim()}`);
        }
        
        // Views, rating patterns
        const viewsMatch = videoHtml.match(/(\d+(?:\.\d+)?[KM]?)\s*views?/i);
        if (viewsMatch) {
          console.log(`\n👁️ Views pattern: ${viewsMatch[1]}`);
        }
        
        const ratingMatch = videoHtml.match(/(\d+)%\s*(?:rating|rate)/i);
        if (ratingMatch) {
          console.log(`\n⭐ Rating pattern: ${ratingMatch[1]}%`);
        }
        
      } catch (e) {
        console.log(`\n⚠️ Could not fetch video page: ${e.message}`);
      }
    }
    
    // Generate CSS reference
    console.log('\n' + '='.repeat(60));
    console.log('GENERATING CSS REFERENCE');
    console.log('='.repeat(60));
    
    const reference = {
      baseUrl,
      cssFiles: cssFiles.slice(0, 15),
      colors: colors.slice(0, 20),
      structure,
      sampleVideoLinks: videoLinks.slice(0, 10),
      categoryLinks: categoryLinks.slice(0, 15),
    };
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync('eporner_reference.json', JSON.stringify(reference, null, 2));
    console.log('\n💾 Reference saved to: eporner_reference.json');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SCRAPING COMPLETE');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the scraper
scrapeEporner();
