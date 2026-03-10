/**
 * Comprehensive Eporner Web Scraper v2
 * Scrapes all page types to extract complete HTML/CSS structure
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');

// Simple HTTP request helper
function fetch(url, retries = 2) {
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

    req.on('error', (e) => {
      if (retries > 0) {
        setTimeout(() => resolve(fetch(url, retries - 1)), 1000);
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

// Parse HTML with regex
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
      const rgbRegex = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
      while ((match = rgbRegex.exec(html)) !== null) {
        colors.add(`rgb(${match[1]}, ${match[2]}, ${match[3]})`);
      }
      return [...colors];
    },
    
    getStructure() {
      return {
        hasHeader: html.includes('<header'),
        hasNav: html.includes('<nav'),
        hasMain: html.includes('<main'),
        hasFooter: html.includes('<footer'),
        hasAside: html.includes('<aside'),
        hasSection: html.includes('<section'),
      };
    },
  };
}

// Main scraper
async function scrapeEporner() {
  const baseUrl = 'https://www.eporner.com';
  const results = {
    timestamp: new Date().toISOString(),
    pages: {},
  };

  const pages = [
    { url: baseUrl, name: 'homepage' },
    { url: `${baseUrl}/cat/all/`, name: 'categories' },
    { url: `${baseUrl}/latest/`, name: 'latest' },
    { url: `${baseUrl}/pornstars/`, name: 'pornstars' },
  ];

  console.log('='.repeat(60));
  console.log('COMPREHENSIVE EPORNER SCRAPER');
  console.log('='.repeat(60));

  for (const page of pages) {
    console.log(`\n📄 Scraping: ${page.name}`);
    console.log(`   URL: ${page.url}`);
    
    try {
      const html = await fetch(page.url);
      const p = parseHTML(html);
      
      const pageData = {
        url: page.url,
        title: p.getTitle(),
        description: p.getMeta('description'),
        cssFiles: p.getCSSLinks(),
        videoLinks: p.getLinks('/video/').slice(0, 20),
        categoryLinks: p.getLinks('/cat/').slice(0, 20),
        pornstarLinks: p.getLinks('/pornstar/').slice(0, 15),
        images: p.getImages().slice(0, 15),
        structure: p.getStructure(),
        classes: p.getAllClasses().slice(0, 50),
        colors: p.getColors().slice(0, 30),
      };
      
      results.pages[page.name] = pageData;
      
      console.log(`   ✅ Title: ${pageData.title?.substring(0, 50)}`);
      console.log(`   ✅ Videos: ${pageData.videoLinks.length}`);
      console.log(`   ✅ Categories: ${pageData.categoryLinks.length}`);
      console.log(`   ✅ Classes: ${pageData.classes.length}`);
      console.log(`   ✅ Colors: ${pageData.colors.length}`);
      
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
      results.pages[page.name] = { error: e.message };
    }
  }

  // Video page
  console.log('\n🎬 Scraping video page...');
  try {
    const homeHtml = await fetch(baseUrl);
    const home = parseHTML(homeHtml);
    const videoLinks = home.getLinks('/video/');
    
    if (videoLinks.length > 0) {
      const videoUrl = new URL(videoLinks[0], baseUrl).href;
      const videoHtml = await fetch(videoUrl);
      const v = parseHTML(videoHtml);
      
      results.pages.video = {
        url: videoUrl,
        title: v.getTitle(),
        cssFiles: v.getCSSLinks(),
        images: v.getImages().slice(0, 15),
        structure: v.getStructure(),
        classes: v.getAllClasses().slice(0, 30),
        colors: v.getColors().slice(0, 20),
      };
      console.log(`   ✅ Video page scraped`);
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }

  // Category page
  console.log('\n📂 Scraping category page...');
  try {
    const catHtml = await fetch(`${baseUrl}/cat/anal/`);
    const c = parseHTML(catHtml);
    
    results.pages.category = {
      url: `${baseUrl}/cat/anal/`,
      title: c.getTitle(),
      cssFiles: c.getCSSLinks(),
      videoLinks: c.getLinks('/video/').slice(0, 20),
      structure: c.getStructure(),
      classes: c.getAllClasses().slice(0, 30),
      colors: c.getColors().slice(0, 20),
    };
    console.log(`   ✅ Category page scraped`);
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }

  // Pornstar detail
  console.log('\n👤 Scraping pornstar page...');
  try {
    const psHtml = await fetch(`${baseUrl}/pornstars/`);
    const ps = parseHTML(psHtml);
    const psLinks = ps.getLinks('/pornstar/');
    
    if (psLinks.length > 0) {
      const psUrl = new URL(psLinks[0], baseUrl).href;
      const psDetailHtml = await fetch(psUrl);
      const psd = parseHTML(psDetailHtml);
      
      results.pages.pornstar = {
        url: psUrl,
        title: psd.getTitle(),
        cssFiles: psd.getCSSLinks(),
        images: psd.getImages().slice(0, 15),
        structure: psd.getStructure(),
        classes: psd.getAllClasses().slice(0, 30),
        colors: psd.getColors().slice(0, 20),
      };
      console.log(`   ✅ Pornstar page scraped`);
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }

  // Aggregate all colors and classes
  const allColors = new Set();
  const allClasses = new Set();
  const allCssFiles = new Set();
  
  for (const data of Object.values(results.pages)) {
    if (data.colors) data.colors.forEach(c => allColors.add(c));
    if (data.classes) data.classes.forEach(c => allClasses.add(c));
    if (data.cssFiles) data.cssFiles.forEach(c => allCssFiles.add(c));
  }
  
  results.summary = {
    cssFiles: [...allCssFiles],
    colors: [...allColors],
    classes: [...allClasses],
  };

  // Save files
  console.log('\n💾 Saving...');
  fs.writeFileSync('eporner_full_scrape.json', JSON.stringify(results, null, 2));
  fs.writeFileSync('eporner_structure.json', JSON.stringify(results.pages, null, 2));
  
  const cssRef = {
    cssFiles: results.summary.cssFiles,
    colors: results.summary.colors,
  };
  fs.writeFileSync('eporner_css_reference.json', JSON.stringify(cssRef, null, 2));
  
  console.log('   ✅ eporner_full_scrape.json');
  console.log('   ✅ eporner_structure.json');
  console.log('   ✅ eporner_css_reference.json');
  
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n📄 Pages scraped: ${Object.keys(results.pages).length}`);
  console.log(`🎨 Colors found: ${results.summary.colors.length}`);
  console.log(`📦 CSS files: ${results.summary.cssFiles.length}`);
  console.log(`🔤 Classes: ${results.summary.classes.length}`);
  
  console.log('\n🎨 Top colors:');
  results.summary.colors.slice(0, 15).forEach(c => console.log(`   - ${c}`));
  
  console.log('\n📄 CSS files:');
  results.summary.cssFiles.forEach(c => console.log(`   - ${c}`));
  
  console.log('\n🔑 Key classes:');
  results.summary.classes.slice(0, 20).forEach(c => console.log(`   - ${c}`));
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ SCRAPING COMPLETE');
  console.log('='.repeat(60));
}

scrapeEporner().catch(console.error);
