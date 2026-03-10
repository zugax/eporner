'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import SearchBox from '@/components/SearchBox'
import { useState } from 'react'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e50914" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AREABOKEP" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gradient-to-b from-dark to-dark/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">
                  AREA<span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded ml-1">BOKEP</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                <Link href="/" className="px-4 py-2 text-white hover:bg-primary/20 rounded-lg transition-all text-sm font-medium">
                  <i className="fas fa-home mr-1.5"></i> Home
                </Link>
                <Link href="/trending" className="px-4 py-2 text-white hover:bg-primary/20 rounded-lg transition-all text-sm font-medium">
                  <i className="fas fa-fire mr-1.5 text-orange-500"></i> Trending
                </Link>
                <Link href="/popular" className="px-4 py-2 text-white hover:bg-primary/20 rounded-lg transition-all text-sm font-medium">
                  <i className="fas fa-star mr-1.5 text-yellow-500"></i> Popular
                </Link>
                <Link href="/latest" className="px-4 py-2 text-white hover:bg-primary/20 rounded-lg transition-all text-sm font-medium">
                  <i className="fas fa-clock mr-1.5 text-green-500"></i> Latest
                </Link>
                <Link href="/channels" className="px-4 py-2 text-white hover:bg-primary/20 rounded-lg transition-all text-sm font-medium">
                  <i className="fas fa-tv mr-1.5"></i> Channels
                </Link>
                <div className="relative group">
                  <button className="px-4 py-2 text-white hover:bg-primary/20 rounded-lg transition-all text-sm font-medium flex items-center gap-1">
                    <i className="fas fa-th mr-1.5"></i> Categories 
                    <i className="fas fa-chevron-down ml-1 text-xs"></i>
                  </button>
                  <div className="absolute top-full left-0 mt-1 bg-dark-secondary border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-48 py-2 z-50">
                    <Link href="/categories" className="block px-4 py-2.5 text-gray-300 hover:bg-primary hover:text-white transition-colors text-sm">
                      <i className="fas fa-th-large mr-2"></i>All Categories
                    </Link>
                    <Link href="/pornstars" className="block px-4 py-2.5 text-gray-300 hover:bg-primary hover:text-white transition-colors text-sm">
                      <i className="fas fa-user-tie mr-2"></i>Pornstars
                    </Link>
                  </div>
                </div>
              </nav>

              {/* Desktop Search */}
              <div className="hidden md:block">
                <SearchBox />
              </div>

              {/* Mobile Menu Button */}
              <button 
                id="mobile-menu-btn"
                className="md:hidden p-2 text-white hover:bg-primary/20 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>

          {/* Mobile Search - Always visible below header */}
          <div className="md:hidden px-4 py-3 bg-dark-secondary border-t border-gray-800">
            <SearchBox />
          </div>

          {/* Mobile Menu */}
          <div id="mobile-menu" className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-dark-secondary border-t border-gray-800`}>
            <nav className="flex flex-col py-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:bg-primary/20 transition-colors">
                <i className="fas fa-home mr-3"></i> Home
              </Link>
              <Link href="/trending" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:bg-primary/20 transition-colors">
                <i className="fas fa-fire mr-3 text-orange-500"></i> Trending
              </Link>
              <Link href="/popular" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:bg-primary/20 transition-colors">
                <i className="fas fa-star mr-3 text-yellow-500"></i> Popular
              </Link>
              <Link href="/latest" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:bg-primary/20 transition-colors">
                <i className="fas fa-clock mr-3 text-green-500"></i> Latest
              </Link>
              <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:bg-primary/20 transition-colors">
                <i className="fas fa-th mr-3"></i> Categories
              </Link>
              <Link href="/pornstars" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:bg-primary/20 transition-colors">
                <i className="fas fa-user-tie mr-3"></i> Pornstars
              </Link>
              <Link href="/channels" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:bg-primary/20 transition-colors">
                <i className="fas fa-tv mr-3"></i> Channels
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-dark-secondary border-t border-gray-800 py-10 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <i className="fas fa-compass mr-2 text-primary"></i>Browse
                </h3>
                <ul className="space-y-2">
                  <li><Link href="/trending" className="text-gray-400 hover:text-primary transition-colors text-sm">Trending</Link></li>
                  <li><Link href="/popular" className="text-gray-400 hover:text-primary transition-colors text-sm">Popular</Link></li>
                  <li><Link href="/latest" className="text-gray-400 hover:text-primary transition-colors text-sm">Latest</Link></li>
                  <li><Link href="/categories" className="text-gray-400 hover:text-primary transition-colors text-sm">Categories</Link></li>
                  <li><Link href="/pornstars" className="text-gray-400 hover:text-primary transition-colors text-sm">Pornstars</Link></li>
                  <li><a href="https://avplusplus.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">Bokep Jepang</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <i className="fas fa-info-circle mr-2 text-primary"></i>Information
                </h3>
                <ul className="space-y-2">
                  <li><Link href="/terms" className="text-gray-400 hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
                  <li><Link href="/dmca" className="text-gray-400 hover:text-primary transition-colors text-sm">DMCA</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact</Link></li>
                </ul>
              </div>
              <div className="col-span-2">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <i className="fas fa-play-circle mr-2 text-primary"></i>AREA BOKEP
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Watch free HD porn videos online. Updated daily with new content across all categories.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    <i className="fab fa-twitter text-lg"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    <i className="fab fa-facebook text-lg"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    <i className="fab fa-instagram text-lg"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} AREA BOKEP. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </body>
    </html>
  )
}
