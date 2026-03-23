'use client';

import { useState, useEffect, useCallback, Suspense } from 'react'
import { getAllCompanies, getFavourites, toggleFavourite } from '@/services/UserService'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { CompanyCard, type Company } from '@/components/user/CompanyCard' // optimized
import { CompanyCardSkeleton } from '@/components/ui/Skeleton' // spinners added



function CompanyListingContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<Company[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [totalPages, setTotalPages] = useState(0)
  const [fadeIn, setFadeIn] = useState(false)
  const [favourites, setFavourites] = useState<string[]>([])
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState(0)
  const [companySize, setCompanySize] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Initialize filters from URL params
  useEffect(() => {
    const query = searchParams.get('query')
    const categories = searchParams.getAll('category')
    const services = searchParams.getAll('services')

    if (query) {
      setSearchQuery(query)
      setDebouncedQuery(query)
    }
    if (categories.length > 0) setSelectedCategories(categories)
    if (services.length > 0) setSelectedServices(services)
  }, [searchParams])

  // Debounce search query
  useEffect(() => {
    if (searchQuery === debouncedQuery) return

    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setPage(1)
    }, 500)

    return () => clearTimeout(handler)
  }, [searchQuery, debouncedQuery])

  useEffect(() => {
    setFadeIn(true)
    // Fetch favourites
    getFavourites()
      .then(favs => {
          if (Array.isArray(favs)) {
              setFavourites(favs.map((f: { _id?: string, id?: string }) => f._id || f.id || ""));
          }
      })
      .catch(() => {
          // Ignore error (likely not logged in)
      });
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

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        query: debouncedQuery,
        page,
        limit,
        category: selectedCategories.length > 0 ? selectedCategories : undefined,
        services: selectedServices.length > 0 ? selectedServices : undefined,
        companySize: companySize !== 'All' ? companySize : undefined,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        minExperience: experienceLevel > 0 ? experienceLevel : undefined,
        sortBy,
        sortOrder,
      }

      const response = await getAllCompanies(params)
      setCompanies(response.companies as unknown as Company[])
      setTotal(response.total)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Failed to fetch companies:", error)
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, page, limit, selectedCategories, selectedServices, companySize, minPrice, maxPrice, experienceLevel, sortBy, sortOrder])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  // optimized: useCallback for handlers
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
    setPage(1)
  }, []);

  const handleServiceChange = useCallback((service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    )
    setPage(1)
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'rating') {
      setSortBy('rating')
      setSortOrder('desc')
    } else if (value === 'experience') {
      setSortBy('experience')
      setSortOrder('desc')
    } else if (value === 'price_asc') {
      setSortBy('price')
      setSortOrder('asc')
    } else if (value === 'price_desc') {
      setSortBy('price')
      setSortOrder('desc')
    } else {
      setSortBy('createdAt')
      setSortOrder('desc')
    }
    setPage(1)
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedServices([])
    setExperienceLevel(0)
    setCompanySize('All')
    setMinPrice('')
    setMaxPrice('')
    setSearchQuery('')
    setPage(1)
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div 
        className="relative h-80 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: "url('/assets/high-building-construction-city.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 transition-all duration-700"></div>

        {/* Hero Content */}
        <div className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-shadow mb-6 leading-tight">
              <span className="text-white bg-clip-text bg-gradient-to-r from-white to-gray-300">Find </span>
              <span className="text-[#FFD700] drop-shadow-lg animate-pulse">Premium</span>
              <span className="text-white bg-clip-text bg-gradient-to-r from-gray-300 to-white"> Construction</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#FFD700] mb-8 max-w-2xl mx-auto drop-shadow-lg">
              Discover exceptional construction companies and architectural services for your dream project
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto animate-fadeInUp">
              <div className="glass-effect rounded-2xl p-6 shadow-2xl transform transition-all duration-500 hover:shadow-3xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <div className="relative group">
                      <input 
                        type="text" 
                        placeholder="Search companies by name or services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-12 py-4 rounded-xl border-2 border-transparent bg-white/95 text-gray-800 focus:ring-4 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none transition-all duration-300 group-hover:border-[#FFD700]/50"
                      />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="group">
                    <button 
                      onClick={() => fetchCompanies()}
                      className="w-full px-6 py-4 bg-gradient-to-r from-[#0F1E50] via-[#1A3A8F] to-[#0F1E50] text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:from-[#1A3A8F] hover:via-[#0F1E50] hover:to-[#1A3A8F] group-hover:shadow-[0_0_30px_rgba(238,178,27,0.4)]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Search
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Advanced Filters */}
          <aside className="lg:col-span-1">
            <div className="glass-effect rounded-2xl p-6 sticky top-6 shadow-xl transition-all duration-500 hover:shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                  </svg>
                </span>
                Advanced Filters
              </h3>

              <div className="space-y-6">
                <div className="animate-fadeIn">
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Project Category</label>
                  <div className="space-y-2">
                    {['Residential', 'Commercial', 'Villas'].map((category) => (
                      <label 
                        key={category} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50/80 cursor-pointer transition-all duration-300 hover:translate-x-1 animate-fadeInUp"
                      >
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="w-5 h-5 appearance-none border-2 border-gray-300 rounded checked:border-[#FFD700] checked:bg-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 transition-all duration-300"
                          />
                          {selectedCategories.includes(category) && (
                            <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="animate-fadeIn">
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Specialized Services</label>
                  <div className="space-y-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {['Architecture', 'Interior Design', 'Renovation'].map((service) => (
                      <label 
                        key={service} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50/80 cursor-pointer transition-all duration-300 hover:translate-x-1"
                      >
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={selectedServices.includes(service)}
                            onChange={() => handleServiceChange(service)}
                            className="w-5 h-5 appearance-none border-2 border-gray-300 rounded checked:border-[#FFD700] checked:bg-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/50 transition-all duration-300"
                          />
                          {selectedServices.includes(service) && (
                            <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="animate-fadeIn">
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    Experience: <span className="text-[#FFD700]">{experienceLevel}+ years</span>
                  </label>
                  <div className="px-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={experienceLevel}
                      onChange={(e) => {
                        setExperienceLevel(parseInt(e.target.value))
                        setPage(1)
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider transition-all duration-300 hover:bg-gray-300"
                      style={{
                        background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${(experienceLevel/30)*100}%, #E5E7EB ${(experienceLevel/30)*100}%, #E5E7EB 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>0 yrs</span>
                      <span>30+ yrs</span>
                    </div>
                  </div>
                </div>

                <div className="animate-fadeIn">
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Company Size</label>
                  <div className="relative group">
                    <select 
                      value={companySize}
                      onChange={(e) => {
                        setCompanySize(e.target.value)
                        setPage(1)
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] outline-none transition-all duration-300 group-hover:border-[#FFD700]/50 appearance-none"
                    >
                      <option value="All">All Sizes</option>
                      <option value="1-10 employees">Small (1-10)</option>
                      <option value="11-50 employees">Medium (11-50)</option>
                      <option value="50+ employees">Large (50+)</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>

                <div className="animate-fadeIn">
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Consultation Fee Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(e.target.value)
                          setPage(1)
                        }}
                        className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 bg-white text-gray-800 rounded-lg focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] outline-none transition-all duration-300 group-hover:border-[#FFD700]/50"
                      />
                    </div>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(e.target.value)
                          setPage(1)
                        }}
                        className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 bg-white text-gray-800 rounded-lg focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] outline-none transition-all duration-300 group-hover:border-[#FFD700]/50"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleResetFilters}
                  className="w-full px-6 py-3 border-2 border-[#0F1E50] bg-transparent text-[#0F1E50] font-bold rounded-xl hover:bg-[#0F1E50] hover:text-white shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 animate-fadeInUp"
                >
                  <span className="flex items-center justify-center gap-2">
                    Reset Filters
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </aside>

          {/* Search Results */}
          <section className="lg:col-span-3">
            {/* Results Header */}
            <div className="glass-effect rounded-2xl p-6 mb-8 shadow-xl transition-all duration-500 hover:shadow-2xl animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Verified Construction Professionals</h2>
                  <p className="text-gray-700 mt-1 font-medium">
                    {loading ? 'Searching...' : `Found ${total} verified professionals`}
                  </p>
                </div>
                <div className="relative group">
                  <select 
                    onChange={handleSortChange}
                    className="px-4 py-2 border-2 border-gray-200 bg-white text-gray-800 rounded-lg focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] outline-none transition-all duration-300 group-hover:border-[#FFD700]/50 appearance-none pr-8"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="experience">Most Experienced</option>
                  </select>
                  <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-[#FFD700] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Company Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* spinners added: Using Skeletons for premium loading feel */}
                {[...Array(6)].map((_, i) => (
                  <CompanyCardSkeleton key={i} />
                ))}
              </div>
            ) : total === 0 ? (
              <div className="glass-effect rounded-2xl p-12 text-center shadow-xl animate-bounceIn">
                <div className="w-24 h-24 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <svg className="w-12 h-12 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">No companies found</h3>
                <p className="text-gray-600 mt-3 max-w-md mx-auto">
                  Try adjusting your filters or search query to find what you&apos;re looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {companies.map((company, index) => (
                  <CompanyCard 
                    key={company.id}
                    company={company}
                    index={index}
                    isFavourite={favourites.includes(company.id)}
                    onToggleFavourite={handleToggleFavourite}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center animate-fadeInUp">
                <nav className="glass-effect rounded-2xl p-2 shadow-xl">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-[#0F1E50] font-semibold rounded-xl hover:bg-[#0F1E50]/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                          page === i + 1 
                            ? 'bg-gradient-to-r from-[#0F1E50] to-[#1A3A8F] text-white shadow-lg' 
                            : 'text-[#0F1E50] hover:bg-[#0F1E50]/10'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 text-[#0F1E50] font-semibold rounded-xl hover:bg-[#0F1E50]/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              </div>
            )}
          </section>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
          80% {
            opacity: 1;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.3);
        }
        
        .text-shadow {
          text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #FFD700, #FFA500);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #FFA500, #FF8C00);
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFD700;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: all 0.3s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: #FFA500;
          transform: scale(1.1);
        }
        
        .slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFD700;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: all 0.3s;
        }
        
        .slider::-moz-range-thumb:hover {
          background: #FFA500;
          transform: scale(1.1);
        }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#0F1E50]"></div>
          <p className="text-[#0F1E50] font-bold animate-pulse">Loading Premium Professionals...</p>
        </div>
      </div>
    }>
      <CompanyListingContent />
    </Suspense>
  );
}
