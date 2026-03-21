"use client"

// app/page.tsx
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAllCompanies, getFavourites, toggleFavourite, getPublicStats } from '@/services/UserService'
import type { CompanyProfile } from '@/types/AuthTypes'
import UserNavbar from '@/components/user/UserNavbar'
import { toast } from 'react-toastify'

import { CompanyCard, type Company } from '@/components/user/CompanyCard' // optimized
import { CompanyCardSkeleton } from '@/components/ui/Skeleton' // spinners added
import { useCallback } from 'react'

export default function HomePage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favourites, setFavourites] = useState<string[]>([])

  const [searchCategory, setSearchCategory] = useState("");
  const [searchService, setSearchService] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const [stats, setStats] = useState({
    successfulProjects: 1200,
    happyCustomers: 800,
    expertConsultants: 150,
    yearsExperience: 25,
    ongoingProjects: 60
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies()
        // The API now returns a paginated object { data: Company[], total: number, ... }
        setCompanies(response.data || [])
      } catch (err) {
        console.error(err)
        setError((err as Error).message || 'Failed to load companies')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()

    getFavourites()
      .then(favs => {
        if (Array.isArray(favs)) {
          setFavourites(favs.map((f: { _id?: string, id?: string }) => f._id || f.id || ""));
        }
      })
      .catch(() => {});
    getPublicStats()
      .then(setStats)
      .catch(() => {});
  }, [])

  // optimized: useCallback to prevent unnecessary function recreation
  const handleToggleFavourite = useCallback(async (e: React.MouseEvent, companyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
        const updatedFavs = await toggleFavourite(companyId);
        setFavourites(updatedFavs);
        const isNowFav = updatedFavs.includes(companyId);
        toast.success(isNowFav ? "Added to favorites" : "Removed from favorites");
    } catch {
        toast.error("Please login to manage favorites");
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCategory) params.append("category", searchCategory);
    if (searchService) params.append("services", searchService);
    if (searchCity) params.append("query", searchCity);
    
    router.push(`/User/CompanyListing?${params.toString()}`);
  };

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
        onSubmit={handleSearch}
        className="backdrop-blur-md bg-transparent border border-white/20 rounded-2xl p-4 shadow-xl max-w-6xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category */}
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="px-3 py-2 border border-white/20 rounded w-full sm:w-52 bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[rgb(210,152,4)] focus:border-[rgb(210,152,4)]"
          >
            <option value="" disabled className="text-black">Choose Category</option>
            <option value="Residential" className="text-black">Residential</option>
            <option value="Commercial" className="text-black">Commercial</option>
            <option value="Villas" className="text-black">Villas</option>
          </select>
  
          {/* Service */}
          <select
            value={searchService}
            onChange={(e) => setSearchService(e.target.value)}
            className="px-3 py-2 border border-white/20 rounded w-full sm:w-60 bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[rgb(210,152,4)] focus:border-[rgb(210,152,4)]"
          >
            <option value="" disabled className="text-black">Choose Service</option>
            <option value="Architecture" className="text-black">Architecture</option>
            <option value="Interior Design" className="text-black">Interior Design</option>
            <option value="Renovation" className="text-black">Renovation</option>
          </select>
  
          {/* City */}
          <input 
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="flex-1 px-3 py-2 border border-white/20 rounded bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[rgb(210,152,4)] focus:border-[rgb(210,152,4)]" 
            placeholder="Enter City or Area (e.g., Bangalore)" 
          />
  
          {/* Button */}
          <button type="submit" className="bg-[rgb(0,14,41)] border-2 border-[rgb(210,152,4)] text-[rgb(210,152,4)] font-semibold px-6 py-2 rounded-xl hover:bg-[rgb(0,14,41)] hover:text-white transition">
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
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">{stats.successfulProjects}+</h2>
                <p className="text-sm sm:text-base text-gray-200">Successful Projects</p>
              </div>

              {/* Happy Customers */}
              <div>
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">{stats.happyCustomers}+</h2>
                <p className="text-sm sm:text-base text-gray-200">Happy Customers</p>
              </div>

              {/* Expert Consultants */}
              <div>
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">{stats.expertConsultants}+</h2>
                <p className="text-sm sm:text-base text-gray-200">Expert Consultants</p>
              </div>

              {/* Years of Experience */}
              <div>
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">{stats.yearsExperience}+</h2>
                <p className="text-sm sm:text-base text-gray-200">Years of Experience</p>
              </div>

              {/* Ongoing Projects */}
              <div>
                <h2 className="text-3xl font-extrabold text-[rgb(210,152,4)]">{stats.ongoingProjects}+</h2>
                <p className="text-sm sm:text-base text-gray-200">Ongoing Projects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick categories */}
      <section className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                unoptimized
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
              {/* <Link 
                href="/User/CompanyListing?category=Residential" 
                className="text-indigo-600 text-sm font-semibold inline-block"
              >
                Show Companies →
              </Link> */}
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
                unoptimized
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
              {/* <Link 
                href="/User/CompanyListing?category=Commercial" 
                className="text-indigo-600 text-sm font-semibold inline-block"
              >
                Show Companies →
              </Link> */}
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
                unoptimized
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
              {/* <Link 
                href="/User/CompanyListing?category=Villas" 
                className="text-indigo-600 text-sm font-semibold inline-block"
              >
                Show Companies →
              </Link> */}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
      {/* spinners added: Using Skeletons for premium loading feel */}
      {[...Array(3)].map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
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
    {companies.map((company, index) => (
      <CompanyCard 
        key={company.id}
        company={company as unknown as Company} // optimized: proper casting
        index={index}
        isFavourite={favourites.includes(company.id)}
        onToggleFavourite={handleToggleFavourite}
      />
    ))}
  </div>
</section>

      {/* Success Stories (Admin highlighted) */}
      {/* <section className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Story 1 */}
          {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
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
          </div> */}

          {/* Story 2 */}
          {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
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
          </div> */}

          {/* Story 3 */}
          {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
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
          </div> */}

          {/* Story 4 */}
          {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
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
          </div> */}

          {/* Story 5 */}
          {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group">
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
      //     </div> */}
        
     

      {/* Testimonials */}
      {/* <section className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-[rgb(0,14,41)]">What Homeowners Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Testimonial 1 */}
          {/* <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                alt="Customer avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-[rgb(210,152,4)]"
                unoptimized
              />
              <div className="font-bold text-[rgb(210,152,4)]">R. Mehta</div>
            </div>
            <p className="italic text-[rgb(0,14,41)]">Kitchen renovation delivered ahead of schedule with premium finishes.</p>
          </div> */}
{/* 
          Testimonial 2 */}
          {/* <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
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
          </div> */}

          {/* Testimonial 3 */}
          {/* <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
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
          </div> */}

          {/* Testimonial 4 */}
          {/* <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
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
          </div> */}

          {/* Testimonial 5 */}
          {/* <div className="bg-white p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-2xl rounded-bl-2xl flex flex-col">
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
          </div> */}
         <footer className="bg-gradient-to-br from-[#000E29] to-[#081C45] text-white py-14 px-6 md:px-10 lg:px-16">
  <div className="max-w-7xl mx-auto">
    {/* Top Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

      {/* Brand Column */}
      <div className="sm:col-span-2 lg:col-span-2">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-5">
          <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D29804" />
                <stop offset="100%" stopColor="#EEB21B" />
              </linearGradient>
            </defs>
            <ellipse cx="8" cy="10" rx="7" ry="7" stroke="url(#logoGrad)" strokeWidth="2.2" fill="none" />
            <ellipse cx="22" cy="10" rx="7" ry="7" stroke="url(#logoGrad)" strokeWidth="2.2" fill="none" />
          </svg>
          <span className="text-white text-2xl font-extrabold tracking-widest">
            GRA
            <span className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">
              VI
            </span>
            TY
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-7">
          Revolutionizing the construction industry by connecting homeowners with trusted builders and experts.
          Building dreams, delivering excellence.
        </p>

        {/* Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D29804" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <span>contact@gravity.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EEB21B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D29804" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>123 Construction Ave, Building City, BC 12345</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent font-semibold text-base mb-5">
          Quick Links
        </h4>
        <ul className="space-y-3">
          {["About GRAVITY", "Our Services", "Find Builders", "Join as Company", "Customer Support"].map((item) => (
            <li key={item}>
              <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors duration-200">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h4 className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent font-semibold text-base mb-5">
          Legal
        </h4>
        <ul className="space-y-3">
          {["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Support Center", "Careers"].map((item) => (
            <li key={item}>
              <a href="#" className="text-gray-300 text-sm hover:text-white transition-colors duration-200">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Divider */}
    <div className="border-t border-white/10 mt-12 mb-8" />

    {/* Bottom Section */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <h5 className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent font-semibold text-base mb-1">
          Stay Connected
        </h5>
        <p className="text-gray-400 text-sm">Follow us for the latest updates and success stories</p>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-3">
        {/* Facebook */}
        <a href="#" aria-label="Facebook" className="w-11 h-11 rounded-full bg-[#0a1a3a] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#EEB21B]/40 hover:bg-[#0f2350] transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
        {/* Twitter / X */}
        <a href="#" aria-label="Twitter" className="w-11 h-11 rounded-full bg-[#0a1a3a] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#EEB21B]/40 hover:bg-[#0f2350] transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
          </svg>
        </a>
        {/* Instagram */}
        <a href="#" aria-label="Instagram" className="w-11 h-11 rounded-full bg-[#0a1a3a] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#EEB21B]/40 hover:bg-[#0f2350] transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        </a>
        {/* LinkedIn */}
        <a href="#" aria-label="LinkedIn" className="w-11 h-11 rounded-full bg-[#0a1a3a] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#EEB21B]/40 hover:bg-[#0f2350] transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>
    </div>
  )
}