"use client"

// app/page.tsx
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { getAllCompanies, getFavourites, toggleFavourite, getPublicStats } from '@/services/UserService'
import type { CompanyProfile } from '@/types/AuthTypes'
import { toast } from 'react-toastify'
import { CompanyCard, type Company } from '@/components/user/CompanyCard'
import { CompanyCardSkeleton } from '@/components/ui/Skeleton'
import HeroCarousel from '@/components/user/HeroCarousel'
import { motion, useInView, useAnimation } from 'framer-motion'
import { useCallback, Suspense } from 'react'
import { Building2, CheckCircle, Users, Award, Clock, Star, Sparkles, TrendingUp, Calendar, Home as HomeIcon, Castle } from 'lucide-react'

// CountUp Animation Component with enhanced animation
const CountUp = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, end, duration, controls]);

  return (
    <motion.h2 
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={controls}
      variants={{
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
      }}
      className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1"
    >
      {count}{suffix}
    </motion.h2>
  );
};

// Animated Stat Card Component
const StatCard = ({ stat, index }: { stat: { icon: React.ReactNode; label: string; value: number; suffix: string; color: string }; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });
  
  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 150 }}
      whileHover={{ 
        y: -5,
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="relative group cursor-pointer"
    >
      <div className={`p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${stat.color} backdrop-blur-md border border-white/10 shadow-xl sm:shadow-2xl hover:shadow-[#EEB21B]/20 transition-all duration-500 flex flex-col items-center text-center h-full relative z-10 overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <motion.div 
          className="flex justify-center mb-2"
          animate={isInView ? { rotate: [0, 360] } : {}}
          transition={{ duration: 0.8, delay: index * 0.1 }}
        >
          {stat.icon}
        </motion.div>
        <CountUp end={stat.value} suffix={stat.suffix} />
        <p className="text-[8px] sm:text-[9px] md:text-[10px] text-white/70 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2 group-hover:text-[#EEB21B] transition-colors duration-300">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
};

function HomePageContent() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favourites, setFavourites] = useState<string[]>([])

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
        setCompanies(response.companies || [])
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

  // Gradient for stats section
  const statsGradient = "linear-gradient(to right, #020D2E, #0F2FA8)";

  const statItems = [
    { label: "SUCCESSFUL PROJECTS", value: stats.successfulProjects, suffix: "+", icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#EEB21B]" />, color: "from-blue-900/40 to-blue-800/20" },
    { label: "HAPPY CUSTOMERS", value: stats.happyCustomers, suffix: "+", icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#EEB21B]" />, color: "from-blue-900/40 to-blue-800/20" },
    { label: "EXPERT CONSULTANTS", value: stats.expertConsultants, suffix: "+", icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#EEB21B]" />, color: "from-blue-900/40 to-blue-800/20" },
    { label: "YEARS OF EXCELLENCE", value: stats.yearsExperience, suffix: "+", icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#EEB21B]" />, color: "from-blue-900/40 to-blue-800/20" },
    { label: "ONGOING PROJECTS", value: stats.ongoingProjects, suffix: "", icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#EEB21B]" />, color: "from-blue-900/40 to-blue-800/20" }
  ];

  const expertiseItems = [
    {
      title: "Residential",
      icon: HomeIcon,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&q=80&w=800&fit=crop",
      features: ["Custom Home Designs", "Apartment Complexes", "Luxury Penthouses", "Sustainable Living"],
      stat: "5000+ Homes Built",
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Commercial",
      icon: Building2,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
      features: ["Corporate Offices", "Retail Spaces", "Hotels & Hospitality", "LEED Certified"],
      stat: "2M+ Sq Ft Built",
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Villas",
      icon: Castle,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&q=80&w=800&fit=crop",
      features: ["Custom Villa Design", "Smart Home Tech", "Private Pools", "Premium Materials"],
      stat: "200+ Luxury Villas",
      color: "from-amber-600 to-orange-600"
    }
  ];

  return (
    <div className="bg-gray-50 text-gray-800 overflow-x-hidden">
      
      {/* Hero Section with Carousel */}
      <section className="relative group">
        <HeroCarousel />

        {/* Stats Section - Reduced Height with Gradient Background */}
        <div 
          className="relative z-20 overflow-hidden"
          style={{ background: statsGradient }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, -50, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#EEB21B]/5 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 relative z-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {statItems.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section with Animations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#020D2E] to-[#0F2FA8] rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#EEB21B]" />
            </div>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#000E29] mb-3 sm:mb-4">
            Our <span className="bg-gradient-to-r from-[#020D2E] to-[#0F2FA8] bg-clip-text text-transparent">Expertise</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#020D2E] to-[#0F2FA8] mx-auto mb-4 sm:mb-6 rounded-full"></div>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Specialized solutions tailored to your unique needs across residential, 
            commercial, and luxury villa projects
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {expertiseItems.map((item, index) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image 


                  src={item.image} 
                  alt={item.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Animated overlay on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-[#020D2E]/50 to-[#0F2FA8]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#020D2E] to-[#0F2FA8] rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#EEB21B]" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{item.title}</h3>
                </div>
              </div>
              
              <div className="p-5 sm:p-6">
                <p className="text-gray-600 text-sm sm:text-base mb-4">{`Creating ${item.title.toLowerCase()} spaces that inspire and delight`}</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
                  {item.features.map((feature, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-center gap-1 sm:gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#EEB21B] flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600">{feature}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                  <motion.span 
                    className="text-xs sm:text-sm font-bold bg-gradient-to-r from-[#020D2E] to-[#0F2FA8] bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.stat}
                  </motion.span>
             
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4"
          >
            <Star className="w-12 h-12 text-[#EEB21B] mx-auto" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Featured <span className="bg-gradient-to-r from-[#020D2E] to-[#0F2FA8] bg-clip-text text-transparent">Companies</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#020D2E] to-[#0F2FA8] mx-auto rounded-full"></div>
        </motion.div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500 mb-4 text-sm"
          >
            {error}
          </motion.p>
        )}
        
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-4">
            {[...Array(3)].map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        )}
        
        {!loading && !error && companies.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No companies available yet. Please check back later.</p>
          </motion.div>
        )}
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {companies.map((company, index) => (
            <CompanyCard 
              key={company.id}
              company={company as unknown as Company}
              index={index}
              isFavourite={favourites.includes(company.id)}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
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
      <HomePageContent />
    </Suspense>
  );
}