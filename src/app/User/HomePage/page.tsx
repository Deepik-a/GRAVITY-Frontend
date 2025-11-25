// HomePage.tsx
"use client"

import React from 'react';
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/20 sticky top-0 z-30 border-b border-[rgb(210,152,4)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo + Brand */}
            <div className="flex items-center gap-2">
              <a href="index.html" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="./assets/Logo.png" 
                  alt="Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg object-cover"
                />
                <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl">
                  <span className="text-[rgb(0,14,41)]">GRA</span>
                  <span className="text-[rgb(210,152,4)]">VITY</span>
                </h1>
              </a>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a 
                href="index.html" 
                className="text-sm lg:text-base font-semibold bg-gradient-to-r from-[rgb(0,14,41)] to-[rgb(210,152,4)] bg-clip-text text-transparent hover:from-[rgb(210,152,4)] hover:to-[rgb(0,14,41)] transition-all duration-300"
              >
                Home
              </a>
              <a 
                href="builders.html" 
                className="text-sm lg:text-base font-semibold bg-gradient-to-r from-[rgb(0,14,41)] to-[rgb(210,152,4)] bg-clip-text text-transparent hover:from-[rgb(210,152,4)] hover:to-[rgb(0,14,41)] transition-all duration-300"
              >
                Find Builders
              </a>
  
              {/* Notifications Icon */}
              <a href="notifications.html" className="relative hover:text-[rgb(210,152,4)] transition-colors">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 sm:h-6 sm:w-6 text-[rgb(0,14,41)] hover:text-[rgb(210,152,4)]" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 24c1.104 0 2-.897 2-2h-4c0 1.103.896 2 2 2zm6.364-6V11c0-3.309-2.691-6-6-6s-6 2.691-6 6v7L4 20v2h16v-2l-1.636-2z"/>
                </svg>
                <span className="absolute -top-1 -right-1 bg-[rgb(210,152,4)] text-[rgb(0,14,41)] text-xs font-bold px-1.5 py-0.5 rounded-full">
                  3
                </span>
              </a>
  
              {/* Profile Icon */}
          <Link href="/User/UserProfile" className="flex items-center">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src="./assets/profile.jpg"
    alt="Profile"
    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-[rgb(210,152,4)] object-cover object-center shadow-md"
  />
</Link>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-[rgb(0,14,41)]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        {/* Background with overlay */}
        <div 
          className="h-[500px] sm:h-[600px] lg:h-[650px] bg-cover bg-center relative"
          style={{ backgroundImage: "url('./assets/construction-site-sunset.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/70"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-white w-full">
              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6">
                <span className="text-[rgb(210,152,4)]">Redefining</span> 
                <span className="text-white"> Modern</span> 
                <span className="text-[rgb(210,152,4)]"> Construction</span>
              </h1>

              {/* Sub text */}
              <p className="text-base sm:text-lg lg:text-xl max-w-3xl mb-6 sm:mb-10 text-gray-200">
                Blending <span className="text-[rgb(210,152,4)] font-semibold">Cutting-Edge Technology</span> 
                with <span className="text-white font-semibold">Timeless Craftsmanship</span> 
                to deliver exceptional construction solutions for homeowners & dreamers.
              </p>

              {/* Search bar */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = 'search.html';
                }} 
                className="backdrop-blur-md bg-transparent border border-white/20 rounded-xl lg:rounded-2xl p-3 sm:p-4 shadow-xl max-w-6xl mx-auto"
              >
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {/* Category */}
                  <select className="px-3 py-2 text-sm sm:text-base border border-white/20 rounded w-full sm:w-40 lg:w-52 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[rgb(210,152,4)] focus:border-[rgb(210,152,4)]">
                    <option defaultValue="" disabled>Choose Category</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Villas</option>
                  </select>

                  {/* Service */}
                  <select className="px-3 py-2 text-sm sm:text-base border border-white/20 rounded w-full sm:w-48 lg:w-60 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[rgb(210,152,4)] focus:border-[rgb(210,152,4)]">
                    <option defaultValue="" disabled>Choose Service</option>
                    <option>Architecture</option>
                    <option>Interior Design</option>
                    <option>Renovation</option>
                  </select>

                  {/* City */}
                  <input 
                    className="flex-1 px-3 py-2 text-sm sm:text-base border border-white/20 rounded bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[rgb(210,152,4)] focus:border-[rgb(210,152,4)]" 
                    placeholder="Enter City or Area (e.g., Bangalore)" 
                  />

                  {/* Button */}
                  <button className="bg-[rgb(0,14,41)] border-2 border-[rgb(210,152,4)] text-[rgb(210,152,4)] font-semibold px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl hover:bg-[rgb(0,14,41)] hover:text-white transition text-sm sm:text-base">
                    Find a Professional
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-[rgb(0,14,41)] py-4 sm:py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 text-center">
              {[
                { number: "1200+", label: "Successful Projects" },
                { number: "800+", label: "Happy Customers" },
                { number: "150+", label: "Expert Consultants" },
                { number: "25+", label: "Years of Experience" },
                { number: "60+", label: "Ongoing Projects" }
              ].map((stat, index) => (
                <div key={index}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[rgb(210,152,4)]">{stat.number}</h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: "Residential",
              description: "Homes, villas and private residences",
              image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&q=60&w=400&fit=crop",
              features: ["Custom home design", "Luxury interiors", "Renovation services"]
            },
            {
              title: "Commercial",
              description: "Shops, offices and commercial projects",
              image: "./assets/glassclad-skyscrapers-central-mumbai-reflecting-sunset-hues-blue-hour.jpg",
              features: ["Office interiors", "Retail space design", "Corporate spaces"]
            },
            {
              title: "Villas",
              description: "Luxury homes & villas",
              image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&q=60&w=400&fit=crop",
              features: ["Exclusive villa designs", "High-end architecture", "Premium furnishing"]
            },
            {
              title: "Apartments",
              description: "Apartment renovations & interiors",
              image: "https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&q=60&w=400&fit=crop",
              features: ["Modern apartment layouts", "Space optimization", "Contemporary designs"]
            }
          ].map((category, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 flex flex-col justify-between border-2 border-[rgb(0,14,41)] hover:shadow-xl transition-shadow duration-300"
              style={{ boxShadow: '0 0 8px rgb(210,152,4)' }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={category.image} 
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded object-cover border-2 border-[rgb(210,152,4)]" 
                  alt={category.title}
                />
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[rgb(0,14,41)]">{category.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <ul className="mt-3 sm:mt-4 list-disc list-inside text-gray-500 text-xs sm:text-sm space-y-1">
                {category.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <div className="mt-4 sm:mt-6">
                <a 
                  href="search.html" 
                  className="text-indigo-600 text-xs sm:text-sm font-semibold inline-block hover:text-indigo-700 transition-colors"
                >
                  Show Companies →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Companies */}
      <section className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center">Featured Companies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              name: "Skyline Constructions",
              category: "Residential • Renovation • Interiors",
              rating: "4.8",
              reviews: "310 reviews",
              experience: "22 yrs",
              projects: "540",
              location: "Bengaluru",
              image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop",
              description: "Award-winning villa specialists delivering premium finishes and on-time delivery."
            },
            {
              name: "DreamBuild Pvt Ltd",
              category: "Commercial • Structural Engineering",
              rating: "4.6",
              reviews: "180 reviews",
              experience: "18 yrs",
              projects: "320",
              location: "Mumbai",
              image: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop",
              description: "End-to-end commercial spaces, from design to delivery with strict QA."
            },
            {
              name: "UrbanRenov",
              category: "Renovation • Interiors",
              rating: "4.7",
              reviews: "240 reviews",
              experience: "15 yrs",
              projects: "410",
              location: "Pune",
              image: "./assets/modern-business-buildings-financial-district.jpg",
              description: "Specialists in smart space optimization and turnkey apartment makeovers."
            },
            {
              name: "Prime Villas Co.",
              category: "Luxury Villas • Landscaping",
              rating: "4.9",
              reviews: "415 reviews",
              experience: "24 yrs",
              projects: "290",
              location: "Hyderabad",
              image: "./assets/architects-collaborating-blueprints-construction-site.jpg",
              description: "Bespoke luxury estates with green roofs and water-efficient landscapes."
            },
            {
              name: "Apex Apartments",
              category: "High-rise • Smart Homes",
              rating: "4.5",
              reviews: "150 reviews",
              experience: "12 yrs",
              projects: "200",
              location: "Chennai",
              image: "./assets/twilight-view-mumbai-cityscape-purple-hues-showing-lot-construction-residential-commercial-skyscrapers-highrises.jpg",
              description: "Energy-efficient apartments with IoT automation and community amenities."
            },
            {
              name: "Coastal Living",
              category: "Beach Villas • Resorts",
              rating: "4.7",
              reviews: "210 reviews",
              experience: "17 yrs",
              projects: "160",
              location: "Goa",
              image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1600&auto=format&fit=crop",
              description: "Tropical resort builds with salt-air-resistant materials and finishes."
            }
          ].map((company, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={company.image} 
                className="w-full h-48 sm:h-56 object-cover" 
                alt={company.name}
              />
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-800">{company.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{company.category}</p>
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-yellow-500 font-semibold text-sm sm:text-base">⭐ {company.rating}</div>
                    <div className="text-xs text-gray-400">{company.reviews}</div>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm">
                  <div className="bg-gray-100 rounded px-2 sm:px-3 py-1 text-center">
                    Exp: <span className="font-semibold">{company.experience}</span>
                  </div>
                  <div className="bg-gray-100 rounded px-2 sm:px-3 py-1 text-center">
                    Projects: <span className="font-semibold">{company.projects}</span>
                  </div>
                  <div className="bg-gray-100 rounded px-2 sm:px-3 py-1 text-center">📍 {company.location}</div>
                </div>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed flex-grow">
                  {company.description}
                </p>
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                  <a 
                    href="company.html" 
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition text-center"
                  >
                    View Details
                  </a>
                  <a 
                    href="booking.html" 
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm text-white bg-[rgb(0,14,41)] hover:bg-[rgb(15,35,80)] hover:shadow-lg transition text-center"
                  >
                    Book Consultation
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Success Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {[
            {
              title: "Heritage Villa, Coorg",
              description: "Restored 1960s villa with contemporary interiors and rainwater harvesting.",
              image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop"
            },
            {
              title: "Tech HQ, Bengaluru",
              description: "Agile office buildout delivered 3 weeks early, LEED Gold certified.",
              image: "./assets/vertical-low-angle-shot-high-rise-skyscrapers-glass-facade-frankfurt-germany.jpg"
            },
            {
              title: "Riverside Apartments",
              description: "120‑unit retrofit with smart meters and solar integration.",
              image: "./assets/modern-business-buildings-financial-district.jpg"
            },
            {
              title: "Azure Beach Resort",
              description: "Eco‑friendly cottages with low‑impact foundations and sea views.",
              image: "./assets/illustration-construction-site.jpg"
            },
            {
              title: "Downtown Retail Plaza",
              description: "Mixed‑use redevelopment that increased footfall by 38% YoY.",
              image: "https://images.unsplash.com/photo-1527030280862-64139fba04ca?q=80&w=1600&auto=format&fit=crop"
            }
          ].map((story, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={story.image} 
                className="w-full h-32 sm:h-40 object-cover" 
                alt={story.title}
              />
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base">{story.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{story.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[rgb(0,14,41)]">What Homeowners Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {[
            {
              name: "R. Mehta",
              comment: "Kitchen renovation delivered ahead of schedule with premium finishes.",
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
            },
            {
              name: "Priya K.",
              comment: "Our office fit-out was seamless. Transparent pricing and great communication.",
              image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop"
            },
            {
              name: "Ankit S.",
              comment: "Consultation helped us plan budgets realistically. Highly recommend!",
              image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop"
            },
            {
              name: "S. Iyer",
              comment: "Attention to detail and a team that genuinely cares about quality.",
              image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
            },
            {
              name: "Leena V.",
              comment: "They transformed our outdated apartment into a bright, functional home.",
              image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop"
            }
          ].map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-4 sm:p-6 shadow border-2 border-[rgb(0,14,41)] rounded-tr-lg sm:rounded-tr-2xl rounded-bl-lg sm:rounded-bl-2xl flex flex-col"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-[rgb(210,152,4)]" 
                  src={testimonial.image} 
                  alt={testimonial.name}
                />
                <div className="font-bold text-sm sm:text-base text-[rgb(210,152,4)]">{testimonial.name}</div>
              </div>
              <p className="italic text-xs sm:text-sm text-[rgb(0,14,41)] flex-grow">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 bg-[#081427] text-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="./assets/Logo.png" 
                  alt="GRAVITY Logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="font-semibold text-white text-base sm:text-lg">
                  <span className="text-[#FFD700]">GRAVITY</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Connect with Trusted Builders & Experts</div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-5 sm:leading-6">
              Revolutionizing the construction industry by connecting homeowners with trusted builders and experts. Building dreams, delivering excellence.
            </p>
            <div className="mt-3 sm:mt-4 space-y-1 text-xs sm:text-sm">
              <div>📧 <a className="hover:text-[#FFD700]" href="mailto:support@gravity.example">support@gravity.example</a></div>
              <div>📞 <span className="text-gray-300">+1 (555) 123-4567</span></div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[#FFD700] mb-2 sm:mb-3 text-sm sm:text-base">Quick Links</h4>
            <ul className="text-xs sm:text-sm space-y-1 sm:space-y-2">
              {['About GRAVITY', 'Find Builders', 'Our Services', 'Customer Support'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-[#FFD700] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-[#FFD700] mb-2 sm:mb-3 text-sm sm:text-base">Legal</h4>
            <ul className="text-xs sm:text-sm space-y-1 sm:space-y-2">
              {['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Careers'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-[#FFD700] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h4 className="font-semibold text-[#FFD700] mb-2 sm:mb-3 text-sm sm:text-base">Stay Connected</h4>
            <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3">
              Follow us for the latest updates and success stories
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              {['f.png', 'linke.png', 'insta.jpg', 'whaat.jpg'].map((icon, index) => (
                <a key={index} href="#" aria-label="Social media" className="hover:scale-110 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`./assets/${icon}`} 
                    alt="Social media" 
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border border-[#FFD700]/40 p-1 sm:p-2 hover:bg-[#FFD700] hover:border-[#FFD700]"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bg-[#060E1B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>© 2025 GRAVITY — All rights reserved</div>
            <div className="hidden sm:block">
              <span className="text-gray-500">Built with care</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;