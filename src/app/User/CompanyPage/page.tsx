'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCompanyById, getFavourites, toggleFavourite } from '@/services/UserService';
import type { CompanyProfile } from '@/types/AuthTypes';
import { toast } from 'react-toastify';
import ReviewsSection from '@/components/ReviewsSection';
import ChatWindow from '@/components/chat/ChatWindow';
import { Sparkles, MapPin, Users as UsersIcon, Globe, Layers } from 'lucide-react';

type CompanyTab = {
  id: 'overview' | 'projects' | 'team' | 'reviews' | 'gallery';
  label: string;
  icon: string;
};

import { resolveImageUrl } from "@/utils/urlHelper";

function CompanyProfileContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: "user" | "company" } | null>(null);
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});
  const sliderDragging = useRef<string | null>(null);

  const tabsSectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get('id');
  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (tabParam && ['overview', 'projects', 'gallery', 'team', 'reviews'].includes(tabParam)) {
      setActiveTab(tabParam as 'overview' | 'projects' | 'gallery' | 'team' | 'reviews');
      
      // Optionally scroll to tabs section if tab is set
      setTimeout(() => {
        tabsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [tabParam, tabsSectionRef]);

  const tabs: CompanyTab[] = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-info-circle' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-project-diagram' },
    { id: 'gallery', label: 'Gallery', icon: 'fas fa-images' },
    { id: 'team', label: 'Team', icon: 'fas fa-users' },
    { id: 'reviews', label: 'Reviews', icon: 'fas fa-star' },
  ];

  const scrollToTabsAndSet = (tab: 'overview' | 'projects' | 'gallery' | 'team' | 'reviews') => {
    setActiveTab(tab);
    setTimeout(() => {
      tabsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Client-side only animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadCompany = async () => {
      if (!companyId) {
        setError('No company selected');
        setLoading(false);
        return;
      }

      try {
        const data = await getCompanyById(companyId);
        setCompany(data);
      } catch {
        console.error('Failed to load company');
        setError('Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser({ ...user, role: user.role || 'user' });
    }

    if (companyId) {
      getFavourites()
        .then((favs) => {
          if (Array.isArray(favs)) {
            const isFav = favs.some((f: { _id?: string, id?: string }) => (f._id || f.id) === companyId);
            setIsFavourite(isFav);
          }
        })
        .catch(() => {});
    }
  }, [companyId]);

  // Before/after slider mouse handlers
  const handleSliderMouseDown = (projectId: number | string, e: React.MouseEvent | React.TouchEvent) => {
    sliderDragging.current = String(projectId);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!sliderDragging.current) return;
      const id = sliderDragging.current;
      const container = document.getElementById(`ba-container-${id}`);
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const pos = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      setSliderPositions(prev => ({ ...prev, [id]: pos }));
    };
    const handleUp = () => { sliderDragging.current = null; };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  const handleLiveChat = () => {
    if (!currentUser) { toast.error("Please login to chat with the company"); return; }
    setIsChatOpen(true);
  };

  const handleToggleFav = async () => {
    if (!companyId) return;
    setTogglingFav(true);
    try {
      const updatedFavs = await toggleFavourite(companyId);
      if (Array.isArray(updatedFavs)) {
        setIsFavourite(updatedFavs.some((id: string) => id === companyId));
      }
      toast.success(isFavourite ? "Removed from favorites" : "Added to favorites");
    } catch {
      toast.error("Please login to manage favorites");
    } finally {
      setTogglingFav(false);
    }
  };

  const stats = [
    {
      value: company?.profile?.projectsCompleted?.toString() ?? '0',
      label: 'Projects Completed',
      color: 'gradient-bg',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      value: company?.profile?.happyCustomers?.toString() ?? '0',
      label: 'Happy Clients',
      color: 'gold-gradient',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
    },
    {
      value: company?.profile?.awardsWon?.toString() ?? '0',
      label: 'Awards Won',
      color: 'gradient-bg',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      ),
    },
    {
      value: company?.profile?.establishedYear?.toString() ?? '—',
      label: 'Est. Year',
      color: 'gold-gradient',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ];

  const processSteps = [
    { number: 1, title: 'Consultation', description: 'Understanding your vision, requirements, and budget to create the perfect plan.' },
    { number: 2, title: 'Design & Planning', description: 'Our expert architects create detailed plans and 3D visualizations.' },
    { number: 3, title: 'Construction', description: 'Skilled craftsmen and project managers ensure quality execution.' },
    { number: 4, title: 'Handover', description: 'Final quality checks, documentation, and ongoing support.' },
  ];

  const categoryDetails: Record<string, { description: string, image: string }> = {
    'Residential': {
      description: 'Turning houses into homes with personalized designs and quality construction.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
    },
    'Commercial': {
      description: 'Functional and aesthetic spaces designed to boost productivity and brand presence.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
    },
    'Villas': {
      description: 'Luxury living spaces that blend comfort with sophisticated architectural elegance.',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop'
    },
    'Apartments': {
      description: 'Modern urban living solutions focused on space optimization and contemporary style.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
    }
  };

  const serviceDetails: Record<string, { description: string, image: string }> = {
    'Architecture': {
      description: 'Innovative blueprints today for the landmarks of tomorrow.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop'
    },
    'Interior Design': {
      description: 'Creating interiors that reflect your personality and enhance your lifestyle.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop'
    },
    'Renovation': {
      description: 'Breathe new life into your existing structures with our expert touch.',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

        .gradient-bg {
          background: linear-gradient(135deg, rgb(8, 28, 69) 0%, rgb(30, 64, 175) 100%);
        }
        .gold-gradient {
          background: linear-gradient(135deg, #EEB21B 0%, #D4A017 100%);
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .parallax {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .btn-primary {
          background: linear-gradient(135deg, rgb(8, 28, 69) 0%, rgb(30, 64, 175) 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(8, 28, 69, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(8, 28, 69, 0.4);
        }
        .btn-gold {
          background: linear-gradient(135deg, #EEB21B 0%, #D4A017 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(238, 178, 27, 0.3);
        }
        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(238, 178, 27, 0.4);
        }
        .card-hover {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card-hover:hover {
          transform: translateY(-10px) rotateX(5deg);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        @keyframes iconGlow {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 18px 6px rgba(255,255,255,0.25); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .stat-icon-wrap {
          animation: iconPulse 3s ease-in-out infinite, iconGlow 3s ease-in-out infinite;
        }
        .stat-value {
          animation: countUp 0.8s ease-out both;
        }

        /* Before/After Slider */
        .ba-slider-wrapper {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
          cursor: col-resize;
          user-select: none;
          border-radius: 16px 16px 0 0;
        }
        .ba-after {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .ba-before {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 2;
        }
        .ba-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: white;
          z-index: 4;
          cursor: col-resize;
          transform: translateX(-50%);
          box-shadow: 0 0 8px rgba(0,0,0,0.4);
        }
        .ba-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 12px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: col-resize;
        }
        .ba-label {
          position: absolute;
          top: 10px;
          z-index: 5;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .ba-label-before {
          left: 10px;
          background: rgba(0,0,0,0.55);
          color: white;
        }
        .ba-label-after {
          right: 10px;
          background: rgba(16, 185, 129, 0.85);
          color: white;
        }

        @media (max-width: 768px) {
          .parallax { background-attachment: scroll; }
        }
      `}</style>

      {/* Hero Banner */}
      <section className="relative h-screen overflow-hidden">
        {company?.profile?.brandIdentity?.banner1 ? (
          <div className="absolute inset-0 parallax">
            <Image
              src={resolveImageUrl(company.profile.brandIdentity.banner1) ?? ''}
              alt="Company Banner"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : (
          <div className="absolute inset-0 parallax bg-gradient-to-br from-blue-900 to-blue-700" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 animate-fade-in-up z-10">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 text-shadow">
              {company?.name || 'Company Details'}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Explore Projects — scrolls to projects tab */}
              <button
                onClick={() => scrollToTabsAndSet('projects')}
                className="btn-primary text-lg px-8 py-4 flex items-center"
              >
                <i className="fas fa-play mr-3" />
                Explore Projects
              </button>
              {/* More About the Company — scrolls to overview tab */}
              <button
                onClick={() => scrollToTabsAndSet('overview')}
                className="btn-gold text-lg px-8 py-4 flex items-center"
              >
                <i className="fas fa-building mr-3" />
                More About the Company
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-10">
          <i className="fas fa-chevron-down text-2xl" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {!loading && error && (
          <p className="mb-6 text-center text-red-500 text-sm">{error}</p>
        )}

        {/* Stats Section — professional SVG icons with animation */}
        <section className="mb-20 animate-on-scroll">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 md:p-6 bg-white rounded-2xl shadow-xl card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 stat-icon-wrap`}
                  style={{ animationDelay: `${index * 0.4}s` }}
                >
                  {stat.svgIcon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 stat-value"
                  style={{ animationDelay: `${index * 0.15}s` }}>
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Company Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-20 animate-on-scroll">
          <div className="h-[400px] sm:h-[500px] relative overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="flex-1 relative group overflow-hidden">
              {company?.profile?.brandIdentity?.banner2 ? (
                <Image
                  src={resolveImageUrl(company.profile.brandIdentity.banner2) ?? ''}
                  alt="Banner 2"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
                  <span className="text-white/50 text-xl font-bold">Architectural Excellence</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="glass-effect p-8 rounded-2xl text-center transform -rotate-1 shadow-2xl border-2 border-white/30">
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white text-shadow tracking-tight">Excellence in Every Detail</h2>
                <div className="h-1 w-24 bg-[#EEB21B] mx-auto mt-4 rounded-full" />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl shadow-2xl bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
                    {company?.profile?.brandIdentity?.profilePicture && (
                      <Image
                        src={resolveImageUrl(company.profile.brandIdentity.profilePicture) ?? ''}
                        alt={company.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {company?.name || 'Company Name'}
                  </h2>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
                    {company?.profile?.categories?.map((cat) => (
                      <span key={cat} className="px-3 py-1 gradient-bg text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">{cat}</span>
                    ))}
                    {company?.profile?.services?.map((service) => (
                      <span key={service} className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">{service}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 text-base md:text-xl mr-2">
                        {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star" />)}
                      </div>
                      <span className="font-bold text-lg md:text-xl">4.9</span>
                      <span className="ml-2 text-gray-500 text-sm md:text-base">(500+ reviews)</span>
                    </div>
                  </div>
                  {company?.profile?.consultationFee && (
                    <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 gold-gradient text-white rounded-xl font-bold shadow-xl text-sm md:text-base">
                      <i className="fas fa-indian-rupee-sign mr-2 md:mr-3" />
                      Consultation Fee: ₹{company.profile.consultationFee}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <button
                  onClick={handleToggleFav}
                  disabled={togglingFav}
                  className={`${isFavourite ? 'bg-red-50 text-red-600 border-red-100' : 'btn-primary'} flex items-center justify-center gap-3 text-sm md:text-base transition-all active:scale-95`}
                >
                  <i className={`${isFavourite ? 'fas fa-heart text-red-500' : 'fas fa-heart'}`} />
                  {isFavourite ? 'In Favorites' : 'Add to Favorites'}
                </button>
                {company?.profile?.contactOptions?.chatSupport !== false && (
                  <button
                    onClick={handleLiveChat}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-sm md:text-base"
                  >
                    <i className="fas fa-comment" />
                    Live Chat
                  </button>
                )}
                <button
                  onClick={() => router.push(`/User/BookSlots?companyId=${companyId}`)}
                  className="btn-gold flex items-center justify-center gap-3 text-sm md:text-base cursor-pointer"
                >
                  <i className="fas fa-calendar-check" />
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-12" ref={tabsSectionRef}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex min-w-max">
                {tabs.map((tab: CompanyTab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 sm:px-6 py-4 font-semibold whitespace-nowrap flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <i className={tab.icon} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <section className="mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Company Overview</h3>
                  <div className="prose max-w-none mb-8">
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                      {company?.profile?.overview}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:shadow-2xl transition-all duration-500 group">
                      <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <MapPin className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 opacity-60">HQ Location</div>
                        <div className="text-2xl font-black text-gray-900 tracking-tight">{company?.location || 'Not specified'}</div>
                        <p className="text-sm text-gray-500 mt-2">Serving premium clients globally with architectural excellence.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:shadow-2xl transition-all duration-500 group">
                      <div className="w-20 h-20 gold-gradient rounded-3xl flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <UsersIcon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2 opacity-60">Company Scale</div>
                        <div className="text-2xl font-black text-gray-900 tracking-tight">{company?.profile?.companySize || 'Boutique'}</div>
                        <p className="text-sm text-gray-500 mt-2">Scale of operations ensuring personalized attention to every project.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:shadow-2xl transition-all duration-500 group">
                      <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <i className="fas fa-phone text-white text-3xl" />
                      </div>
                      <div className="text-center sm:text-left flex-1 min-w-0">
                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 opacity-60">Direct Contact</div>
                        <div className="text-2xl font-black text-gray-900 tracking-tight truncate">{company?.phone}</div>
                        <div className="text-sm text-gray-500 mt-1 truncate">{company?.email}</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:shadow-2xl transition-all duration-500 group">
                      <div className="w-20 h-20 gold-gradient rounded-3xl flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <Globe className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2 opacity-60">Communication</div>
                        <div className="flex flex-col gap-1 mt-1">
                           <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              {company?.profile?.contactOptions?.chatSupport ? 'Real-time Chat Support' : 'Email only'}
                           </div>
                           <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {company?.profile?.contactOptions?.videoCalls ? 'Virtual Consultations' : 'In-person visits'}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {company?.profile?.awardsRecognition && (
                    <div className="mb-20">
                      <div className="flex flex-col items-center mb-10 text-center">
                         <span className="text-blue-600 font-black tracking-widest uppercase text-xs mb-2">Recognition</span>
                         <h4 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Awards & Accolades</h4>
                         <div className="h-1.5 w-20 gold-gradient rounded-full mt-4" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {company.profile.awardsRecognition.split('\n').filter(a => a.trim()).slice(0, 5).map((award, idx) => (
                          <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-50 flex flex-col items-center text-center group hover:bg-gradient-to-br hover:from-blue-900 hover:to-blue-700 transition-all duration-500 card-hover">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                               <Sparkles className="w-6 h-6 text-amber-500 group-hover:text-amber-200" />
                            </div>
                            <h5 className="text-lg font-black text-gray-900 group-hover:text-white mb-3 transition-colors">
                               {award.trim().startsWith('-') ? award.trim().substring(1).trim() : award.trim()}
                            </h5>
                            <p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors leading-relaxed">
                               Recognized for outstanding architectural implementation and project management excellence.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Premium Services */}
                  <div className="pt-20 border-t border-gray-100">
                    <div className="text-center mb-16">
                       <span className="text-blue-600 font-black tracking-widest uppercase text-xs mb-2">Excellence</span>
                       <h3 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight uppercase">
                         Our <span className="text-blue-600">Solutions</span>
                       </h3>
                       <div className="h-1.5 w-24 gold-gradient rounded-full mt-4 mx-auto" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                      {/* Filtered Categories */}
                      {company?.profile?.categories?.filter(cat => ['Commercial', 'Villas', 'Residential'].includes(cat)).map((cat) => (
                        <div key={cat} className="group overflow-hidden rounded-[2.5rem] shadow-2xl card-hover bg-white flex flex-col border border-gray-100">
                          <div className="h-64 relative overflow-hidden">
                            <Image 
                              src={categoryDetails[cat]?.image || 'https://images.unsplash.com/photo-1541913057-2384ccf0882e?q=80&w=800&auto=format&fit=crop'} 
                              alt={cat} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-700" 
                              unoptimized 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6">
                              <span className="px-5 py-2 gradient-bg text-white text-[10px] font-black tracking-[0.2em] rounded-full shadow-2xl uppercase">Expertise</span>
                              <h4 className="text-2xl font-black text-white mt-2">{cat}</h4>
                            </div>
                          </div>
                          <div className="p-8 flex flex-col flex-grow">
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                              {categoryDetails[cat]?.description || 'Expert solutions tailored specifically for ' + cat + ' requirements.'}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Filtered Services */}
                      {company?.profile?.services?.filter(s => ['Architecture', 'Renovation', 'Interior Design'].includes(s)).map((service) => (
                        <div key={service} className="group overflow-hidden rounded-[2.5rem] shadow-2xl card-hover bg-white flex flex-col border border-gray-100">
                          <div className="h-64 relative overflow-hidden">
                            <Image 
                              src={serviceDetails[service]?.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'} 
                              alt={service} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6">
                              <span className="px-5 py-2 gold-gradient text-white text-[10px] font-black tracking-[0.2em] rounded-full shadow-2xl uppercase">Service</span>
                              <h4 className="text-2xl font-black text-white mt-2">{service}</h4>
                            </div>
                          </div>
                          <div className="p-8 flex flex-col flex-grow">
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                              {serviceDetails[service]?.description || 'High-quality ' + service + ' by skilled professionals.'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Projects Tab — Before/After Slider */}
              {activeTab === 'projects' && (
                <section className="mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Projects</h3>
                  <p className="text-gray-500 text-sm mb-8">Drag the slider on each project to compare before &amp; after.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {company?.profile?.projects?.map((project) => {
                      const pos = sliderPositions[project.id] ?? 50;
                      const hasBoth = project.beforeImage && project.afterImage;
                      const hasBefore = !!project.beforeImage;
                      const hasAfter = !!project.afterImage;

                      return (
                        <div key={project.id} className="group overflow-hidden rounded-2xl shadow-xl bg-white flex flex-col card-hover">
                          {hasBoth ? (
                            // Draggable before/after slider
                            <div
                              id={`ba-container-${project.id}`}
                              className="ba-slider-wrapper"
                              onMouseDown={(e) => handleSliderMouseDown(project.id, e)}
                              onTouchStart={(e) => handleSliderMouseDown(project.id, e)}
                            >
                              {/* After image — full width, behind */}
                              <div className="ba-after">
                                <Image
                                  src={resolveImageUrl(project.afterImage!) || ''}
                                  alt={`${project.title} after`}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                                <span className="ba-label ba-label-after">After</span>
                              </div>
                              {/* Before image — clipped to left side */}
                              <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                                <Image
                                  src={resolveImageUrl(project.beforeImage!) || ''}
                                  alt={`${project.title} before`}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                                <span className="ba-label ba-label-before">Before</span>
                              </div>
                              {/* Divider line + handle */}
                              <div className="ba-divider" style={{ left: `${pos}%` }}>
                                <div className="ba-handle">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2.5" className="w-5 h-5">
                                    <polyline points="15 18 9 12 15 6" />
                                    <polyline points="9 18 15 12 9 6" transform="translate(0,0)" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ) : hasBefore ? (
                            <div className="relative h-[280px] rounded-t-2xl overflow-hidden">
                              <Image src={resolveImageUrl(project.beforeImage!) || ''} alt={`${project.title}`} fill className="object-cover" unoptimized />
                              <span className="ba-label ba-label-before" style={{ position: 'absolute', top: 10, left: 10 }}>Before</span>
                            </div>
                          ) : hasAfter ? (
                            <div className="relative h-[280px] rounded-t-2xl overflow-hidden">
                              <Image src={resolveImageUrl(project.afterImage!) || ''} alt={`${project.title}`} fill className="object-cover" unoptimized />
                              <span className="ba-label ba-label-after" style={{ position: 'absolute', top: 10, right: 10 }}>After</span>
                            </div>
                          ) : (
                            <div className="h-[280px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-t-2xl flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No images</span>
                            </div>
                          )}

                          <div className="p-5 flex-1 flex flex-col">
                            <h5 className="font-bold text-gray-900 text-lg mb-2">{project.title}</h5>
                            <p className="text-sm text-gray-500 leading-relaxed flex-1">{project.description}</p>
                            {hasBoth && (
                              <p className="mt-3 text-xs text-blue-400 font-medium flex items-center gap-1">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                  <path d="M8 3H5a2 2 0 00-2 2v3"/><path d="M21 8V5a2 2 0 00-2-2h-3"/><path d="M3 16v3a2 2 0 002 2h3"/><path d="M16 21h3a2 2 0 002-2v-3"/>
                                </svg>
                                Drag to compare
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {(!company?.profile?.projects || company.profile.projects.length === 0) && (
                      <p className="text-sm text-gray-500">This company has not added any projects yet.</p>
                    )}
                  </div>
                </section>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <section className="mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Meet Our Expert Team</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {company?.profile?.teamMembers?.map((member) => (
                      <div key={member.id} className="bg-white border border-gray-100 rounded-2xl p-6 text-center card-hover shadow-lg">
                        <div className="relative inline-block mb-4">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto bg-gradient-to-br from-blue-900 to-blue-700 shadow-xl overflow-hidden">
                            {member.photo && (
                              <Image src={resolveImageUrl(member.photo) || ''} alt={member.name} width={96} height={96} className="w-full h-full object-cover" unoptimized />
                            )}
                          </div>
                        </div>
                        <h5 className="font-bold text-lg md:text-xl text-gray-900 mb-1">{member.name}</h5>
                        <p className="text-blue-600 font-semibold mb-1 text-sm md:text-base">{member.role}</p>
                        <p className="text-xs md:text-sm text-gray-600">{member.qualification}</p>
                      </div>
                    ))}
                    {(!company?.profile?.teamMembers || company.profile.teamMembers.length === 0) && (
                      <p className="text-sm text-gray-500">Team members have not been added yet.</p>
                    )}
                  </div>
                </section>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <section className="mb-12">
                  {companyId && <ReviewsSection companyId={companyId} isUser={true} />}
                </section>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <section className="mb-12 animate-fade-in-up">
                   <div className="flex flex-col items-center mb-12 text-center">
                         <span className="text-blue-600 font-black tracking-widest uppercase text-[10px] mb-2 px-4 py-1.5 bg-blue-50 rounded-full shadow-sm">Portfolio Visuals</span>
                         <h3 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">Project Masterpieces</h3>
                         <div className="h-1.5 w-24 gold-gradient rounded-full mt-5 shadow-lg" />
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Brand Identity Images first */}
                      {company?.profile?.brandIdentity?.banner2 && (
                         <div className="group relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl hover-scale bg-white">
                            <Image 
                              src={resolveImageUrl(company.profile.brandIdentity.banner2) || ''} 
                              alt="Brand Presentation" 
                              fill
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                              unoptimized 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                               <span className="px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl bg-blue-600 text-white">Brand Highlight</span>
                               <h5 className="text-white font-black text-xl tracking-tight leading-tight mt-3">Architectural Vision</h5>
                            </div>
                         </div>
                      )}

                      {/* Project Portfolio Images */}
                      {company?.profile?.projects?.flatMap((project) => {
                         const projectMedia = [];
                         if (project.beforeImage) projectMedia.push({ url: project.beforeImage, label: 'Before Completion' });
                         if (project.afterImage) projectMedia.push({ url: project.afterImage, label: 'Architectural Result' });
                         
                         return projectMedia.map((img, i) => (
                            <div key={`${project.id}-img-${i}`} className="group relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl hover-scale ring-1 ring-gray-100 bg-white">
                               <Image 
                                 src={resolveImageUrl(img.url) || ''} 
                                 alt={`${project.title} ${img.label}`} 
                                 fill
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                 unoptimized 
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                               <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                  <div className="flex items-center gap-2 mb-3">
                                     <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl ${img.label.includes('Result') ? 'bg-green-500 text-white' : 'bg-amber-600 text-white'}`}>
                                        {img.label}
                                     </span>
                                  </div>
                                  <h5 className="text-white font-black text-xl tracking-tight leading-tight">{project.title}</h5>
                                  <p className="text-white/70 text-xs mt-2 line-clamp-2 italic">Captured on: {project.date || 'N/A'}</p>
                               </div>
                            </div>
                         ));
                      })}
                      {(!company?.profile?.projects || company.profile.projects.length === 0) && (
                        <div className="col-span-full py-32 bg-gray-100/50 rounded-[4rem] border-4 border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
                           <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl mb-6">
                              <Layers className="w-12 h-12 text-gray-200" />
                           </div>
                           <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">No visual assets found</p>
                        </div>
                      )}
                   </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Process Section */}
        <section className="mb-20 animate-on-scroll">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Construction Process</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Systematic approach ensuring excellence at every step
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 md:w-20 md:h-20 ${index % 2 === 0 ? 'gradient-bg' : 'gold-gradient'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                  <span className="text-white font-bold text-xl md:text-2xl">{step.number}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="gradient-bg rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden animate-on-scroll">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-6">Ready to Build Your Dream Home?</h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get a free consultation with our expert team and turn your vision into architectural reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <a 
                href={`tel:${company?.phone || '987543210'}`}
                className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-yellow-50 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 text-sm md:text-base no-underline"
              >
                <i className="fas fa-phone" />
                Call Now: {company?.phone || '+91 9875 43210'}
              </a>
              <button
                onClick={() => router.push(`/User/BookSlots?companyId=${companyId}`)}
                className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 gold-gradient text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-sm md:text-base cursor-pointer"
              >
                <i className="fas fa-calendar-check" />
                Book Free Consultation
              </button>
            </div>
            <div className="mt-6 text-sm md:text-base opacity-75">
              <i className="fas fa-clock mr-2" />
              Available Mon-Sat: 9:00 AM - 7:00 PM
            </div>
          </div>
        </section>
      </div>

      {isChatOpen && currentUser && company && (
        <ChatWindow
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          currentUser={{ id: currentUser.id, name: currentUser.name, role: currentUser.role as "user" | "company" }}
          otherParticipant={{ id: companyId || '', name: company.name, role: 'company' }}
        />
      )}
    </div>
  );
}

export default function CompanyProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-900" />
      </div>
    }>
      <CompanyProfileContent />
    </Suspense>
  );
}