'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCompanyById } from '@/services/UserService';
import type { CompanyProfile } from '@/types/AuthTypes';
import UserNavbar from '@/components/user/UserNavbar';

type CompanyTab = {
  id: 'overview' | 'projects' | 'team' | 'reviews';
  label: string;
  icon: string;
};

const resolveImageUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  return `${base}/${path}`;
};
export default function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get('id');

  const tabs: CompanyTab[] = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-info-circle' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-project-diagram' },
    { id: 'team', label: 'Team', icon: 'fas fa-users' },
    { id: 'reviews', label: 'Reviews', icon: 'fas fa-star' },
  ];

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
      } catch (err) {
        console.error('Failed to load company', err);
        setError((err as Error).message || 'Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [companyId]);

  const stats = [
    {
      value: company?.profile?.projectsCompleted?.toString() ?? '0',
      label: 'Projects Completed',
      icon: 'fas fa-home',
      color: 'gradient-bg',
    },
    {
      value: company?.profile?.happyCustomers?.toString() ?? '0',
      label: 'Happy Clients',
      icon: 'fas fa-users',
      color: 'gold-gradient',
    },
    {
      value: company?.profile?.awardsWon?.toString() ?? '0',
      label: 'Awards Won',
      icon: 'fas fa-award',
      color: 'gradient-bg',
    },
    {
      value: company?.profile?.establishedYear?.toString() ?? '—',
      label: 'Years Experience',
      icon: 'fas fa-calendar',
      color: 'gold-gradient',
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
        .image-overlay {
          position: relative;
          overflow: hidden;
        }
        .image-overlay::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(8, 28, 69, 0.2), rgba(30, 64, 175, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        .image-overlay:hover::before {
          opacity: 1;
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
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .parallax {
            background-attachment: scroll;
          }
        }
      `}</style>

      <UserNavbar />
      <div className="h-20 sm:h-24"></div>

      {/* Hero Banner */}
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
      />
      <div className="absolute inset-0 bg-black/30"></div>
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
        <button className="btn-primary text-lg px-8 py-4 flex items-center">
          <i className="fas fa-play mr-3" />
          Explore Projects
        </button>
        <button className="btn-gold text-lg px-8 py-4 flex items-center">
          <i className="fas fa-phone mr-3" />
          Get Free Quote
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
        {/* Stats Section */}
        <section className="mb-20 animate-on-scroll">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 md:p-6 bg-white rounded-2xl shadow-xl card-hover">
                <div className={`w-12 h-12 md:w-16 md:h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${stat.icon} text-white text-lg md:text-2xl`} />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
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
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
                <span className="text-white/50 text-xl font-bold">Architectural Excellence</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="glass-effect p-8 rounded-2xl text-center transform -rotate-1 shadow-2xl border-2 border-white/30">
               <h2 className="text-3xl sm:text-5xl font-extrabold text-white text-shadow tracking-tight">Excellence in Every Detail</h2>
               <div className="h-1 w-24 bg-[#EEB21B] mx-auto mt-4 rounded-full"></div>
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
                      <span
                        key={cat}
                        className="px-3 py-1 gradient-bg text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg"
                      >
                        {cat}
                      </span>
                    ))}
                    {company?.profile?.services?.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 text-base md:text-xl mr-2">
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
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
                <button className="btn-primary flex items-center justify-center gap-3 text-sm md:text-base">
                  <i className="fas fa-heart" />
                  Add to Favorites
                </button>
                <button className="px-4 py-2 md:px-6 md:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-sm md:text-base">
                  <i className="fas fa-comment" />
                  Live Chat
                </button>
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

        {/* Main Content */}
        <div className="mb-12">
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
              {/* Overview Content */}
              {activeTab === 'overview' && (
                <section className="mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Company Overview</h3>
                  <div className="prose max-w-none mb-8">
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                      {company?.profile?.overview}
                    </p>
                  </div>

                  {/* Company Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 hover-scale">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                          <span className="text-white">📍</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Location</div>
                          <div className="text-gray-600 text-sm">
                            {company?.location || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 hover-scale">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                          <i className="fas fa-users text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Company Size</div>
                          <div className="text-gray-600 text-sm">
                            {company?.profile?.companySize || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 hover-scale">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                          <i className="fas fa-phone text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Contact</div>
                          <div className="text-gray-600 text-xs break-all">
                            {company?.email}
                            <br />
                            {company?.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 hover-scale">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                          <i className="fas fa-video text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">Contact Options</div>
                          <div className="text-gray-600 text-xs">
                            Chat: {company?.profile?.contactOptions?.chatSupport ? 'Yes' : 'No'}
                            <br />
                            Video Calls:{' '}
                            {company?.profile?.contactOptions?.videoCalls ? 'Yes' : 'No'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {company?.profile?.awardsRecognition && (
                    <div className="mb-12">
                      <h4 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                        <i className="fas fa-trophy text-[#EEB21B]"></i>
                        Awards & Recognition
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {company.profile.awardsRecognition.split('\n').filter(a => a.trim()).map((award, idx) => (
                          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#EEB21B] hover-scale">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-medal text-white"></i>
                              </div>
                              <p className="text-gray-800 font-semibold leading-relaxed">
                                {award.trim().startsWith('-') ? award.trim().substring(1).trim() : award.trim()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Premium Services Section */}
                  <div className="pt-12 border-t border-gray-100">
                    <h3 className="text-2xl sm:text-4xl font-black mb-10 text-gray-900 text-center tracking-tight uppercase">
                      Our <span className="text-blue-600">Premium</span> Services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Mapping Categories */}
                      {company?.profile?.categories?.map((cat) => (
                        <div key={cat} className="group overflow-hidden rounded-3xl shadow-xl card-hover bg-white flex flex-col">
                           <div className="h-48 relative overflow-hidden">
                              <Image 
                                src={categoryDetails[cat]?.image || 'https://images.unsplash.com/photo-1541913057-2384ccf0882e?q=80&w=800&auto=format&fit=crop'} 
                                alt={cat} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="px-4 py-1.5 gradient-bg text-white text-xs font-bold rounded-full shadow-lg">CATEGORY</span>
                              </div>
                           </div>
                           <div className="p-6 flex flex-col flex-grow">
                              <h4 className="text-xl font-bold text-gray-900 mb-3">{cat}</h4>
                              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                {categoryDetails[cat]?.description || 'Expert solutions tailored specifically for ' + cat + ' requirements with a focus on quality and innovation.'}
                              </p>
                              <Link href="/User/Search" className="text-blue-600 font-bold text-sm hover:underline">Explore More →</Link>
                           </div>
                        </div>
                      ))}
                      {/* Mapping Services */}
                      {company?.profile?.services?.map((service) => (
                        <div key={service} className="group overflow-hidden rounded-3xl shadow-xl card-hover bg-white flex flex-col">
                           <div className="h-48 relative overflow-hidden">
                              <Image 
                                src={serviceDetails[service]?.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'} 
                                alt={service} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="px-4 py-1.5 gold-gradient text-white text-xs font-bold rounded-full shadow-lg">SERVICE</span>
                              </div>
                           </div>
                           <div className="p-6 flex flex-col flex-grow">
                              <h4 className="text-xl font-bold text-gray-900 mb-3">{service}</h4>
                              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                {serviceDetails[service]?.description || 'High-quality ' + service + ' provided by our skilled professionals using the latest techniques.'}
                              </p>
                              <Link href="/User/Search" className="text-blue-600 font-bold text-sm hover:underline">Explore More →</Link>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <section className="mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                    Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {company?.profile?.projects?.map((project) => (
                      <div
                        key={project.id}
                        className="group overflow-hidden rounded-2xl shadow-xl card-hover bg-white"
                      >
                        <div className="relative h-64 md:h-72 flex flex-col sm:flex-row overflow-hidden">
                          {project.beforeImage && (
                            <div className="flex-1 relative group/img">
                              <Image
                                src={resolveImageUrl(project.beforeImage) ?? ''}
                                alt={`${project.title} before`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded uppercase">Before</div>
                            </div>
                          )}
                          {project.afterImage && (
                            <div className="flex-1 relative group/img border-t-2 sm:border-t-0 sm:border-l-2 border-white">
                              <Image
                                src={resolveImageUrl(project.afterImage) ?? ''}
                                alt={`${project.title} after`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-2 right-2 px-2 py-1 bg-green-600/80 text-white text-[10px] font-bold rounded uppercase shadow-lg">After</div>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h5 className="font-bold text-gray-900 text-lg mb-2">
                            {project.title}
                          </h5>
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!company?.profile?.projects ||
                      company.profile.projects.length === 0) && (
                      <p className="text-sm text-gray-500">
                        This company has not added any projects yet.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <section className="mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                    Meet Our Expert Team
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {company?.profile?.teamMembers?.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white border border-gray-100 rounded-2xl p-6 text-center card-hover shadow-lg"
                      >
                        <div className="relative inline-block mb-4">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto bg-gradient-to-br from-blue-900 to-blue-700 shadow-xl overflow-hidden">
                            {member.photo && (
                              <Image
                                src={resolveImageUrl(member.photo) ?? ''}
                                alt={member.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </div>
                        <h5 className="font-bold text-lg md:text-xl text-gray-900 mb-1">
                          {member.name}
                        </h5>
                        <p className="text-blue-600 font-semibold mb-1 text-sm md:text-base">
                          {member.role}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          {member.qualification}
                        </p>
                      </div>
                    ))}
                    {(!company?.profile?.teamMembers ||
                      company.profile.teamMembers.length === 0) && (
                      <p className="text-sm text-gray-500">
                        Team members have not been added yet.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* Reviews Tab (placeholder) */}
              {activeTab === 'reviews' && (
                <section className="mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                    Reviews
                  </h3>
                  <p className="text-sm text-gray-500">
                    Reviews feature coming soon.
                  </p>
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
                <div className={`w-16 h-16 md:w-20 md:h-20 ${
                  index % 2 === 0 ? 'gradient-bg' : 'gold-gradient'
                } rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
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
              <button className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-yellow-50 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 text-sm md:text-base">
                <i className="fas fa-phone" />
                Call Now: {company?.phone || '+91987543210'}
              </button>
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
    </div>
  );
}