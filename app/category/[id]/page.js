import { getVideos, getCategories } from '@/lib/eporner'
import VideoGrid from '@/components/VideoGrid'
import Pagination from '@/components/Pagination'
import { notFound } from 'next/navigation'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

// Indonesian category name mappings
const categoryNames = {
  'indonesian': 'Bokep Indonesia',
  'indo': 'Bokep Indo',
  'hijab': 'Bokep Hijab',
  'japanese': 'Bokep Jepang',
  'jepang': 'Bokep Jepang',
  'malaysia': 'Bokep Malaysia',
  'thailand': 'Bokep Thailand',
  'vietnam': 'Bokep Vietnam',
  'filipina': 'Bokep Filipina',
  'korea': 'Bokep Korea',
  'china': 'Bokep China',
  'singapore': 'Bokep Singapore',
  'asian': 'Bokep Asia',
  'milf': 'Bokep MILF',
  'teen': 'Bokep Teen',
  'big-tits': 'Video Big Tits',
  'anal': 'Video Anal',
  'blowjob': 'Video Blowjob',
  'hardcore': 'Video Hardcore',
  'amateur': 'Video Amateur',
  'massage': 'Video Massage',
  'lesbian': 'Video Lesbian',
  'threesome': 'Video Threesome',
  'group-sex': 'Video Group Sex',
  'public': 'Video Public',
  'office': 'Video Office',
  'hotel': 'Video Hotel',
  'vr-porn': 'Video VR Porn',
}

const categoryDescriptions = {
  'indonesian': 'Koleksi video bokep indonesia terbaru dan terupdate. Nonton bokep indo gratis kualitas HD.',
  'indo': 'Video bokep indo hot dan viral. Nikmati koleksi bokep indonesia gratis.',
  'hijab': 'Video bokep hijab muslimah terbaru. Koleksi bokep hijab india dan malaysia.',
  'japanese': 'Video bokep jepang jav uncensored. Koleksi japanese porn HD gratis.',
  'jepang': 'Nonton bokep jepang jav gratis. Koleksi video japan porn terupdate.',
  'malaysia': 'Video bokep malaysia dan melayu hot. Koleksi video asian paling lengkap.',
  'thailand': 'Video bokep thailand geyang dan thai. Koleksi thai porn HD.',
  'vietnam': 'Video bokep vietnam việt. Koleksi vietnamese porn.',
  'filipina': 'Video bokep filipina pinay dan pinoy. Koleksi filipina porn.',
  'korea': 'Video bokep korea dan korean porn. Koleksi korean sex video.',
  'china': 'Video bokep cina chinese porn. Koleksi china sex video.',
  'singapore': 'Video bokep singapore dan.singapore porn.',
  'asian': 'Video bokep asian paling lengkap. Koleksi porn asia HD.',
  'milf': 'Video bokep MILF dan mature women. Koleksi older women porn.',
  'teen': 'Video bokep teen dan young girls. Koleksi young porn HD.',
  'big-tits': 'Video bokep big tits dan breast. Koleksi big breast porn.',
  'anal': 'Video bokep anal dan anal sex. Koleksi anal porn HD.',
  'blowjob': 'Video bokep blowjob dan oral sex. Koleksi oral porn HD.',
  'hardcore': 'Video bokep hardcore dan rough sex. Koleksi hardcore porn HD.',
  'amateur': 'Video bokep amateur dan homemade. Koleksi amateur porn.',
  'massage': 'Video bokep massage dan erotic massage. Koleksi erotic porn.',
  'lesbian': 'Video bokep lesbian dan girls. Koleksi lesbian porn HD.',
  'threesome': 'Video bokep threesome dan 3 way. Koleksi threesome porn.',
  'group-sex': 'Video bokep group sex dan orgy. Koleksi group porn.',
  'public': 'Video bokep public dan outdoor. Koleksi public porn.',
  'office': 'Video bokep office dan workplace. Koleksi office porn.',
  'hotel': 'Video bokep hotel dan room. Koleksi hotel porn.',
  'vr-porn': 'Video bokep VR dan virtual reality. Koleksi VR porn.',
}

export async function generateMetadata({ params }) {
  const categories = await getCategories()
  const categoryId = params.id
  const category = categories?.find(c => c.id === categoryId)
  const categoryName = categoryNames[categoryId] || category?.name || 'Category'
  const categoryDesc = categoryDescriptions[categoryId] || `Watch ${categoryName} videos on AREA BOKEP`
  
  return {
    title: `${categoryName} - Video Bokep Gratis HD | AREA BOKEP`,
    description: categoryDesc,
    keywords: [
      'bokep',
      'video bokep',
      categoryName.toLowerCase(),
      'bokep gratis',
      'hd porn',
      'streaming bokep',
      'nonton bokep'
    ],
    openGraph: {
      title: `${categoryName} - Video Bokep Gratis HD | AREA BOKEP`,
      description: categoryDesc,
    }
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const categories = await getCategories()
  const categoryId = params.id
  const category = categories?.find(c => c.id === categoryId)
  const categoryName = categoryNames[categoryId] || category?.name || 'Category'
  
  if (!category && !categoryNames[categoryId]) {
    notFound()
  }

  const page = parseInt(searchParams?.page || '1')
  const perPage = 40
  const data = await getVideos({ category: categoryId, page, perPage })
  const videos = data.videos || []
  const hasMore = videos.length === perPage
  const totalPages = hasMore ? page + 2 : page

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center">
          <i className="fas fa-th text-primary mr-3"></i>{categoryName}
        </h1>
        <p className="text-gray-400">
          <i className="fas fa-video mr-2"></i>
          {data.total || videos.length} videos found
        </p>
      </div>
      
      <VideoGrid videos={videos} />
      <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/category/${params.id}`} />

      {/* In-Page Push Ad */}
      <Script id="push-ad-category" strategy="afterInteractive">
        {`(function(lxye){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = lxye || {};
s.src = "\/\/swift-weird.com\/bTX\/Vgs.duGwl\/0\/YuWVcf\/xeOmD9XuUZMUBl-kUPxTnYf4VNHDzcD4iMbTocLtWNcjQgq0rNtzfggybM\/QG";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>

      {/* Popunder Ad */}
      <Script id="popunder-ad-category" strategy="afterInteractive">
        {`(function(mbvwp){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = mbvwp || {};
s.src = "\/\/perfumed-development.com\/cNDe9A6.bN2_5GlbS\/WXQZ9rNwjVgr0SNyzCg\/wROFS\/0X2ZOAD\/QH3mOxDHEbzJ";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>

      {/* Banner Ad */}
      <Script id="banner-ad-category" strategy="afterInteractive">
        {`(function(cobz){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = cobz || {};
s.src = "\/\/swift-weird.com\/b.XzVksKdEGWlP0UYyWZcS\/Uermg9nuVZ_Udl\/k\/PcTGY_z\/NDjOgZzHNsjWYRtuNJj\/Mk2tOHDLMg2NNswP";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>

      {/* Multitag VAST Ad */}
      <Script id="vast-ad-category" strategy="afterInteractive">
        {`(function(asoi){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = asoi || {};
s.src = "\/\/swift-weird.com\/bNXFV\/s.dFG\/lJ0tYLWGcx\/Ce\/mu9Gu\/ZzUxlwkYPNTfYPz\/NojxgKzHMRzrYptLN\/jUMF2\/OLDQM\/zbNPwy";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
      </Script>
    </div>
  )
}
