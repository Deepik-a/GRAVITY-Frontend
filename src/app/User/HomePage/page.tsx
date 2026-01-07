"use client"

// app/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAllCompanies } from '@/services/UserService'
import type { CompanyProfile } from '@/types/AuthTypes'
import UserNavbar from '@/components/user/UserNavbar'

const resolveImageUrl = (path?: string | null): string | null => {
  if (!path) return null
  if (path.startsWith('http')) return path
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
  return `${base}/${path}`
}

export default function HomePage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getAllCompanies()
        setCompanies(data)
      } catch (err) {
        console.error(err)
        setError((err as Error).message || 'Failed to load companies')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  return (
    <div className="bg-gray-50 text-gray-800">
      <UserNavbar />
      {/* Hero Section */}
      <section className="relative">
        {/* Background with overlay */}
        <div className="h-[650px] relative overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1541913057-2384ccf0882e?q=80&w=2000&auto=format&fit=crop"
            alt="Construction site at sunset"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>

          {/* Content */}
        <div 
  className="relative z-10 h-full flex items-center"
  style={{
    backgroundImage: "url('/assets/construction-site-sunset.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
  {/* Optional: Add a semi-transparent overlay for better text readability */}
  <div className="absolute inset-0 bg-black/50"></div>
  
  <div className="relative z-20 max-w-6xl mx-auto px-6 text-white">
    {/* Headline */}
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
      <span className="text-[rgb(210,152,4)]">Redefining</span> 
      <span className="text-white"> Modern</span> 
      <span className="text-[rgb(210,152,4)]"> Construction</span>
    </h1>

    {/* Sub text */}
    <p className="text-lg sm:text-xl max-w-3xl mb-10 text-gray-200">
      Blending <span className="text-[rgb(210,152,4)] font-semibold">Cutting-Edge Technology</span> 
      with <span className="text-white font-semibold">Timeless Craftsmanship</span> 
      to deliver exceptional construction solutions for homeowners & dreamers.
    </p>

    {/* Search bar (Transparent + Blur) */}
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        router.push('/User/Search')
      }}
      className="backdrop-blur-md bg-transparent border border-white/20 rounded-2xl p-4 shadow-xl max-w-6xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category */}
        <select
          defaultValue=""
          className="px-3 py-2 border border-white/20 rounded w-full sm:w-52 bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[rgb(210,152,4)] focus:border-[rgb(210,152,4)]"
        >
          <option value="" disabled>Choose Category</option>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Villas</option>
        </select>

        {/* Service */}
        <select
          defaultValue=""
          className="px-3 py-2 border border-white/20 rounded w-full sm:w-60 bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[rgb(210,152,4)] focus:border-[rgb(210,152,4)]"
        >
          <option value="" disabled>Choose Service</option>
          <option>Architecture</option>
          <option>Interior Design</option>
          <option>Renovation</option>
        </select>

        {/* City */}
        <input 
          className="flex-1 px-3 py-2 border border-white/20 rounded bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[rgb(210,152,4)] focus:border-[rgb(210,152,4)]" 
          placeholder="Enter City or Area (e.g., Bangalore)" 
        />

        {/* Button */}
        <button className="bg-[rgb(0,14,41)] border-2 border-[rgb(210,152,4)] text-[rgb(210,152,4)] font-semibold px-6 py-2 rounded-xl hover:bg-[rgb(0,14,41)] hover:text-white transition">
          Find a Professional
        </button>
      </div>
    </form>
  </div>
</div>
        </div>

        {/* Stats Section (smaller height, closer to image) */}
        <div className="bg-[rgb(0,14,41)] py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
              {/* Successful Projects */}
              <div>
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">1200+</h2>
                <p className="text-sm sm:text-base text-gray-200">Successful Projects</p>
              </div>

              {/* Happy Customers */}
              <div>
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">800+</h2>
                <p className="text-sm sm:text-base text-gray-200">Happy Customers</p>
              </div>

              {/* Expert Consultants */}
              <div>
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">150+</h2>
                <p className="text-sm sm:text-base text-gray-200">Expert Consultants</p>
              </div>

              {/* Years of Experience */}
              <div>
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">25+</h2>
                <p className="text-sm sm:text-base text-gray-200">Years of Experience</p>
              </div>

              {/* Ongoing Projects */}
              <div>
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">60+</h2>
                <p className="text-sm sm:text-base text-gray-200">Ongoing Projects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick categories */}
      <section className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Residential */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border-2 border-[rgb(0,14,41)] relative"
            style={{ boxShadow: '0 0 8px rgb(210,152,4)' }}
          >
            <div className="flex items-center gap-4">
              <Image 
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&q=60&w=400&fit=crop" 
                alt="Residential"
                width={112}
                height={112}
                className="w-28 h-28 rounded object-cover border-2 border-[rgb(210,152,4)]"
              />
              <div>
                <h3 className="font-bold text-lg text-[rgb(0,14,41)]">Residential</h3>
                <p className="text-sm text-gray-600">Homes, villas and private residences</p>
              </div>
            </div>
            <ul className="mt-4 list-disc list-inside text-gray-500 text-sm space-y-1">
              <li>Custom home design</li>
              <li>Luxury interiors</li>
              <li>Renovation services</li>
            </ul>
            <div className="mt-6">
              <Link 
                href="/search" 
                className="text-indigo-600 text-sm font-semibold inline-block"
              >
                Show Companies →
              </Link>
            </div>
          </div>

          {/* Commercial */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border-2 border-[rgb(0,14,41)] relative"
            style={{ boxShadow: '0 0 8px rgb(210,152,4)' }}
          >
            <div className="flex items-center gap-4">
              <Image 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop" 
                alt="Commercial"
                width={112}
                height={112}
                className="w-28 h-28 rounded object-cover border-2 border-[rgb(210,152,4)]"
              />
              <div>
                <h3 className="font-bold text-lg text-[rgb(0,14,41)]">Commercial</h3>
                <p className="text-sm text-gray-600">Shops, offices and commercial projects</p>
              </div>
            </div>
            <ul className="mt-4 list-disc list-inside text-gray-500 text-sm space-y-1">
              <li>Office interiors</li>
              <li>Retail space design</li>
              <li>Corporate spaces</li>
            </ul>
            <div className="mt-6">
              <Link 
                href="/search" 
                className="text-indigo-600 text-sm font-semibold inline-block"
              >
                Show Companies →
              </Link>
            </div>
          </div>

          {/* Villas */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border-2 border-[rgb(0,14,41)] relative"
            style={{ boxShadow: '0 0 8px rgb(210,152,4)' }}
          >
            <div className="flex items-center gap-4">
              <Image 
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&q=60&w=400&fit=crop" 
                alt="Villas"
                width={112}
                height={112}
                className="w-28 h-28 rounded object-cover border-2 border-[rgb(210,152,4)]"
              />
              <div>
                <h3 className="font-bold text-lg text-[rgb(0,14,41)]">Villas</h3>
                <p className="text-sm text-gray-600">Luxury homes & villas</p>
              </div>
            </div>
            <ul className="mt-4 list-disc list-inside text-gray-500 text-sm space-y-1">
              <li>Exclusive villa designs</li>
              <li>High-end architecture</li>
              <li>Premium furnishing</li>
            </ul>
            <div className="mt-6">
              <Link 
                href="/search" 
                className="text-indigo-600 text-sm font-semibold inline-block"
              >
                Show Companies →
              </Link>
            </div>
          </div>

          {/* Apartments */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border-2 border-[rgb(0,14,41)] relative"
            style={{ boxShadow: '0 0 8px rgb(210,152,4)' }}
          >
            <div className="flex items-center gap-4">
              <Image 
                src="https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&q=60&w=400&fit=crop" 
                alt="Apartments"
                width={112}
                height={112}
                className="w-28 h-28 rounded object-cover border-2 border-[rgb(210,152,4)]"
              />
              <div>
                <h3 className="font-bold text-lg text-[rgb(0,14,41)]">Apartments</h3>
                <p className="text-sm text-gray-600">Apartment renovations & interiors</p>
              </div>
            </div>
            <ul className="mt-4 list-disc list-inside text-gray-500 text-sm space-y-1">
              <li>Modern apartment layouts</li>
              <li>Space optimization</li>
              <li>Contemporary designs</li>
            </ul>
            <div className="mt-6">
              <Link 
                href="/search" 
                className="text-indigo-600 text-sm font-semibold inline-block"
              >
                Show Companies →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="max-w-7xl mx-auto p-6">
  <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Featured Companies</h2>
  {error && (
    <p className="text-center text-red-500 mb-4 text-sm">
      {error}
    </p>
  )}
  {loading && (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(210,152,4)]"></div>
    </div>
  )}
  {!loading && !error && companies.length === 0 && (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-2">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <p className="text-gray-500 text-sm">
        No companies available yet. Please check back later.
      </p>
    </div>
  )}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
    {companies.map((company) => {
      // Try to get banner image from brandIdentity (banner1 -> profilePicture -> logo)
      const banner1 = company.profile?.brandIdentity?.banner1;
      const profilePicture = company.profile?.brandIdentity?.profilePicture;
      const logo = company.profile?.brandIdentity?.logo;
      
      const bannerUrl =
        (banner1 && resolveImageUrl(banner1)) ||
        (profilePicture && resolveImageUrl(profilePicture)) ||
        (logo && resolveImageUrl(logo)) ||
        null;

      return (
        <div
          key={company.id}
          className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col border border-gray-100"
        >
          {/* Banner Image Section */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {bannerUrl ? (
              <Image
                src={bannerUrl}
                alt={`${company.name} banner`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Company Logo Overlay */}
          
            
            {/* Location Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  {company.location || 'Location'}
                </span>
              </div>
            </div>
          </div>

          {/* Company Info Section */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="mb-4">
              <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1">
                {company.name}
              </h3>
              <div className="flex flex-wrap gap-1">
                {company.profile?.categories?.slice(0, 3).map((category, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs font-medium bg-[rgb(210,152,4,0.1)] text-[rgb(210,152,4)] rounded-full"
                  >
                    {category}
                  </span>
                ))}
                {(company.profile?.categories?.length ?? 0) > 3 && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    +{(company.profile?.categories?.length ?? 0) - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="text-2xl font-bold text-[rgb(0,14,41)]">
                  {company.profile?.projectsCompleted ?? 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Projects</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="text-2xl font-bold text-[rgb(0,14,41)]">
                  {company.profile?.happyCustomers ?? 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Customers</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="text-2xl font-bold text-[rgb(0,14,41)]">
                  {company.profile?.establishedYear ?? 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Since</div>
              </div>
            </div>

            {/* Latest Project Preview */}
            {company.profile?.projects && company.profile.projects.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Latest Project</p>
                  <span className="text-xs text-gray-400">
                    {company.profile.projects[0].date 
                      ? new Date(company.profile.projects[0].date).getFullYear()
                      : 'Recent'
                    }
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {company.profile.projects[0].beforeImage && (
                    <div className="relative h-24 rounded-lg overflow-hidden group">
                      <Image 
                        src={resolveImageUrl(company.profile.projects[0].beforeImage) ?? ''} 
                        alt="Before" 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <span className="text-xs font-semibold text-white">Before</span>
                      </div>
                    </div>
                  )}
                  {company.profile.projects[0].afterImage && (
                    <div className="relative h-24 rounded-lg overflow-hidden group">
                      <Image 
                        src={resolveImageUrl(company.profile.projects[0].afterImage) ?? ''} 
                        alt="After" 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <span className="text-xs font-semibold text-white">After</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => router.push(`/User/CompanyPage?id=${company.id}`)}
                className="flex-1 px-4 py-3 text-sm font-medium text-[rgb(0,14,41)] bg-transparent border border-[rgb(0,14,41)] rounded-xl hover:bg-[rgb(0,14,41)] hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/User/BookSlots?companyId=${company.id}`);
                }}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[rgb(210,152,4)] rounded-xl hover:bg-[rgb(180,132,4)] hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Now
              </button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>

      {/* Success Stories (Admin highlighted) */}
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Story 1 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
            <div className="relative h-48 flex">
              <div className="flex-1 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" 
                  alt="Villa success before"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 text-[8px] text-white font-bold rounded">BEFORE</div>
              </div>
              <div className="flex-1 relative border-l-2 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop" 
                  alt="Villa success after"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-600/80 px-2 py-0.5 text-[8px] text-white font-bold rounded shadow-lg">AFTER</div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Heritage Villa, Coorg</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">Complete restoration of a 1960s manor into a sustainable luxury retreat.</p>
            </div>
          </div>

          {/* Story 2 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
            <div className="relative h-48 flex">
              <div className="flex-1 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" 
                  alt="Office success before"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 text-[8px] text-white font-bold rounded">BEFORE</div>
              </div>
              <div className="flex-1 relative border-l-2 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" 
                  alt="Office success after"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-600/80 px-2 py-0.5 text-[8px] text-white font-bold rounded shadow-lg">AFTER</div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Tech HQ, Bengaluru</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">Transformation of an old warehouse into a LEED Gold certified workspace.</p>
            </div>
          </div>

          {/* Story 3 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
            <div className="relative h-48 flex">
              <div className="flex-1 relative text-center flex items-center justify-center bg-gray-200">
                <span className="text-[10px] text-gray-500 font-bold">LEGACY<br/>STRUCTURE</span>
              </div>
              <div className="flex-1 relative border-l-2 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop" 
                  alt="Apartment success after"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-600/80 px-2 py-0.5 text-[8px] text-white font-bold rounded shadow-lg">AFTER</div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Riverside Lofts</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">Sustainable retrofitting for 120 urban apartments with smart energy.</p>
            </div>
          </div>

          {/* Story 4 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
            <div className="relative h-48 flex">
              <div className="flex-1 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" 
                  alt="Resort success before"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 text-[8px] text-white font-bold rounded">BEFORE</div>
              </div>
              <div className="flex-1 relative border-l-2 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1510627489930-0c1b0baead43?q=80&w=800&auto=format&fit=crop" 
                  alt="Resort success after"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-600/80 px-2 py-0.5 text-[8px] text-white font-bold rounded shadow-lg">AFTER</div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Azure Beach Cottages</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">Zero-impact coastal foundations meeting premium living standards.</p>
            </div>
          </div>

          {/* Story 5 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
            <div className="relative h-48 flex">
              <div className="flex-1 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?q=80&w=800&auto=format&fit=crop" 
                  alt="Retail success before"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 text-[8px] text-white font-bold rounded">BEFORE</div>
              </div>
              <div className="flex-1 relative border-l-2 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1527030280862-64139fba04ca?q=80&w=800&auto=format&fit=crop" 
                  alt="Retail success after"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-600/80 px-2 py-0.5 text-[8px] text-white font-bold rounded shadow-lg">AFTER</div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Skyline Mall</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">Redevelopment that saw a 40% increase in visitor engagement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(0,14,41)]">What Homeowners Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                alt="Customer avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-[rgb(210,152,4)]"
              />
              <div className="font-bold text-[rgb(210,152,4)]">R. Mehta</div>
            </div>
            <p className="italic text-[rgb(0,14,41)]">Kitchen renovation delivered ahead of schedule with premium finishes.</p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop" 
                alt="Customer avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-[rgb(210,152,4)]"
              />
              <div className="font-bold text-[rgb(210,152,4)]">Priya K.</div>
            </div>
            <p className="italic text-[rgb(0,14,41)]">Our office fit-out was seamless. Transparent pricing and great communication.</p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop" 
                alt="Customer avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-[rgb(210,152,4)]"
              />
              <div className="font-bold text-[rgb(210,152,4)]">Ankit S.</div>
            </div>
            <p className="italic text-[rgb(0,14,41)]">Consultation helped us plan budgets realistically. Highly recommend!</p>
          </div>

          {/* Testimonial 4 */}
          <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" 
                alt="Customer avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-[rgb(210,152,4)]"
              />
              <div className="font-bold text-[rgb(210,152,4)]">S. Iyer</div>
            </div>
            <p className="italic text-[rgb(0,14,41)]">Attention to detail and a team that genuinely cares about quality.</p>
          </div>

          {/* Testimonial 5 */}
          <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop" 
                alt="Customer avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-[rgb(210,152,4)]"
              />
              <div className="font-bold text-[rgb(210,152,4)]">Leena V.</div>
            </div>
            <p className="italic text-[rgb(0,14,41)]">They transformed our outdated apartment into a bright, functional home.</p>
          </div>
        </div>
      </section>
    </div>
  )
}