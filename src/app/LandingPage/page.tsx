'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const GravityLandingPage = () => {
  const [activeText, setActiveText] = useState('HomeOwners');
  const [showModal, setShowModal] = useState(false);
  const [userType, setUserType] = useState<'user' | 'company' | null>(null);
  const router = useRouter();
  
   const handleSelect = (type: 'user' | 'company') => {
    setUserType(type);
    // Navigate to sign-up page with type as query param
    router.push(`/signup?userType=${type}`);
  };
  // Mock data for top rated companies
  const topCompanies = [
    {
      id: 1,
      name: 'Elite Builders Inc.',
      rating: 4.9,
      projects: 1200,
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Dream Home Constructors',
      rating: 4.8,
      projects: 950,
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Premium Structures Ltd.',
      rating: 4.9,
      projects: 1500,
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      name: 'Quality Build Group',
      rating: 4.7,
      projects: 800,
      image: '/api/placeholder/300/200'
    }
  ];

  // Text animation effect
  useEffect(() => {
    const texts = ['HomeOwners', 'HomeDreamers'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setActiveText(texts[currentIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProfileClick = () => {
    router.push('/UserProfile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000E29] to-[#081C45] text-white">
      <Head>
        <title>GRAVITY - Connecting HomeOwners with Trusted Builders & Experts</title>
        <meta name="description" content="The future of home construction is here. Connect with verified builders, get transparent pricing, and build your dream home with confidence." />
      </Head>
      {JSON.stringify(userType)}

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#000E29]/90 backdrop-blur-sm z-50 border-b border-[#D29804]/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">
              GRAVITY
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('about')} className="hover:text-[#EEB21B] transition-colors">About</button>
              <button onClick={() => scrollToSection('why')} className="hover:text-[#EEB21B] transition-colors">Why Choose Us</button>
              <button onClick={() => scrollToSection('companies')} className="hover:text-[#EEB21B] transition-colors">Top Companies</button>
            </div>
            <div className="flex items-center space-x-4">
              {/* Profile Icon */}
              <button 
                onClick={handleProfileClick}
                className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                aria-label="User Profile"
              >
                <svg 
                  className="w-6 h-6 text-gray-300 group-hover:text-[#EEB21B] transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              </button>
              
              <button 
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] text-[#000E29] px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-[#D29804]/30 transition-all"
              >
                Find a Builder
              </button>
              <button className="border border-[#D29804] text-[#D29804] px-6 py-2 rounded-full font-semibold hover:bg-[#D29804] hover:text-[#000E29] transition-all">
                Join as Company
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Rest of the component remains the same */}
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            GRAVITY – Connecting{' '}
            <span className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">
              {activeText}
            </span>{' '}
            with Trusted Builders & Experts
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
            The future of home construction is here. Connect with verified builders, get transparent pricing, and build your dream home with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] text-[#000E29] px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-[#D29804]/40 transition-all transform hover:scale-105"
            >
              Find a Builder
            </button>
            <button className="border-2 border-[#D29804] text-[#D29804] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#D29804] hover:text-[#000E29] transition-all">
              Join as Company
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-[#D29804]/30 transition-all">
              <div className="text-3xl md:text-4xl font-bold text-[#EEB21B] mb-2">50K+</div>
              <div className="text-gray-300">Trusted Companies</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-[#D29804]/30 transition-all">
              <div className="text-3xl md:text-4xl font-bold text-[#EEB21B] mb-2">100K+</div>
              <div className="text-gray-300">Projects Completed</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-[#D29804]/30 transition-all">
              <div className="text-3xl md:text-4xl font-bold text-[#EEB21B] mb-2">99%</div>
              <div className="text-gray-300">Happy Homeowners</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About GRAVITY</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              GRAVITY revolutionizes the construction industry by creating seamless connections between homeowners and the most trusted builders and experts in the field.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#000E29] to-[#081C45] border border-[#D29804]/30 rounded-3xl p-8 md:p-12 shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">
                Building Trust, Delivering Dreams
              </h3>
              <p className="text-lg md:text-xl text-gray-300 text-center mb-12 leading-relaxed">
                Founded with the vision to transform how homes are built, GRAVITY serves as the ultimate bridge between ambitious homeowners and skilled construction professionals. Our platform ensures every project is executed with precision, transparency, and trust.
              </p>
              <p className="text-lg md:text-xl text-gray-300 text-center mb-12 leading-relaxed">
                We understand that building a home is more than construction its about creating spaces where memories are made, families grow, and dreams come to life. Thats why weve assembled a network of verified professionals who share our commitment to excellence.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-[#EEB21B] mb-2">50,000+</div>
                  <div className="text-gray-300 text-sm">Trusted Companies</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-[#EEB21B] mb-2">99.8%</div>
                  <div className="text-gray-300 text-sm">Customer Satisfaction</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-[#EEB21B] mb-2">150,000+</div>
                  <div className="text-gray-300 text-sm">Projects Completed</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-[#EEB21B] mb-2">24/7</div>
                  <div className="text-gray-300 text-sm">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mission Box */}
            <div className="bg-gradient-to-br from-[#000E29] to-[#081C45] border-2 border-[#D29804] rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-[#D29804]/20 transition-all">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">
                Our Mission
              </h3>
              <p className="text-lg md:text-xl text-gray-300 text-center leading-relaxed">
                To revolutionize the construction industry by creating the most trusted platform that seamlessly connects homeowners with verified builders, ensuring every project is built with excellence, transparency, and unmatched quality.
              </p>
            </div>

            {/* Vision Box */}
            <div className="bg-gradient-to-br from-[#000E29] to-[#081C45] border-2 border-[#D29804] rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-[#D29804]/20 transition-all">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">
                Our Vision
              </h3>
              <p className="text-lg md:text-xl text-gray-300 text-center leading-relaxed">
                To become the worlds most trusted construction platform where every homeowner can confidently build their dream home, and every builder can showcase their expertise in a transparent, fair, and rewarding ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GRAVITY Section */}
      <section id="why" className="py-20 px-6 bg-white/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose GRAVITY?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of home construction with our revolutionary platform that puts trust, quality, and transparency at the forefront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Verified Builders',
                description: 'Every builder in our network is thoroughly vetted and verified for quality and reliability.'
              },
              {
                title: 'Quality Guarantee',
                description: 'We ensure every project meets our high standards with comprehensive quality checks.'
              },
              {
                title: 'Expert Support',
                description: 'Our team of construction experts provides guidance throughout your building journey.'
              },
              {
                title: 'Full Transparency',
                description: 'Complete visibility into costs, timelines, and progress with real-time project updates.'
              },
              {
                title: 'Customer First',
                description: 'Your satisfaction is our priority. We\'re committed to making your dream home a reality.'
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock customer support to address your concerns and queries anytime.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-[#000E29] to-[#081C45] border border-white/10 rounded-2xl p-8 hover:border-[#D29804]/50 hover:shadow-2xl hover:shadow-[#D29804]/10 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4 text-[#EEB21B]">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-[#EEB21B] mb-2">100%</div>
              <div className="text-gray-300">Satisfaction Rate</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-[#EEB21B] mb-2">24/7</div>
              <div className="text-gray-300">Customer Support</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-[#EEB21B] mb-2">0%</div>
              <div className="text-gray-300">Hidden Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Companies */}
      <section id="companies" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Top Rated Companies</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our most trusted construction partners with proven track records of excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {topCompanies.map((company) => (
              <div 
                key={company.id}
                className="bg-gradient-to-br from-[#000E29] to-[#081C45] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D29804]/50 hover:shadow-2xl hover:shadow-[#D29804]/10 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-48 bg-gray-600 relative">
                  {/* Placeholder for company image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D29804] to-[#EEB21B] opacity-20"></div>
                  <div className="absolute bottom-4 left-4 bg-[#EEB21B] text-[#000E29] px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ {company.rating}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{company.projects.toLocaleString()}+ Projects</p>
                  <button className="w-full bg-gradient-to-r from-[#D29804] to-[#EEB21B] text-[#000E29] py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000E29] border-t border-[#D29804]/20 py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent mb-6">
            GRAVITY
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Building the future of home construction, one dream home at a time. Join thousands of satisfied homeowners who trust GRAVITY for their construction needs.
          </p>
          <div className="flex justify-center space-x-6">
            <button className="text-gray-400 hover:text-[#EEB21B] transition-colors">Privacy Policy</button>
            <button className="text-gray-400 hover:text-[#EEB21B] transition-colors">Terms of Service</button>
            <button className="text-gray-400 hover:text-[#EEB21B] transition-colors">Contact Us</button>
          </div>
          <div className="mt-8 text-gray-500 text-sm">
            © 2024 GRAVITY. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#000E29] to-[#081C45] border-2 border-[#D29804] rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-center mb-6 text-white">
              What describes you the best?
            </h3>
            
            <div className="space-y-4 mb-8">
              {/* Homeowner Option */}
              <button
                onClick={() => handleSelect('user')}
                className={`w-full p-6 rounded-2xl border-2 transition-all ${
                  userType === 'user' 
                    ? 'border-[#EEB21B] bg-[#EEB21B]/10' 
                    : 'border-white/20 bg-white/5 hover:border-[#EEB21B]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-lg font-semibold text-white">HomeOwner/HomeDreamer</div>
                    <div className="text-sm text-gray-300 mt-1">Looking to build your dream home</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D29804] to-[#EEB21B] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#000E29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Builder Option */}
              <button
                onClick={() => handleSelect('company')}
                className={`w-full p-6 rounded-2xl border-2 transition-all ${
                  userType === 'company' 
                    ? 'border-[#EEB21B] bg-[#EEB21B]/10' 
                    : 'border-white/20 bg-white/5 hover:border-[#EEB21B]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-lg font-semibold text-white">Builder</div>
                    <div className="text-sm text-gray-300 mt-1">Professional construction expert</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D29804] to-[#EEB21B] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#000E29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-white/20 text-white py-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle continue action based on userType
                  setShowModal(false);
                }}
                disabled={!userType}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  userType 
                    ? 'bg-gradient-to-r from-[#D29804] to-[#EEB21B] text-[#000E29] hover:shadow-lg' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GravityLandingPage;