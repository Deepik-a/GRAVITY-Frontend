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
<section id="about" className="bg-white w-full min-h-screen py-16 px-4 md:py-20 md:px-6 font-sans flex items-center">
  <div className="max-w-7xl mx-auto w-full">
    <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
      
      {/* LEFT SIDE - Text and Stats */}
      <div className="flex-1 min-w-[320px] flex flex-col justify-between">
        <div>
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-[rgba(210,152,4,0.1)] px-4 py-2 rounded-full border-l-4 border-[rgb(210,152,4)] mb-6 w-fit">
            <i className="fas fa-hard-hat text-[rgb(210,152,4)]"></i>
            <span className="text-[rgb(0,14,41)] font-semibold text-sm">SINCE 2018 · TRUSTED NETWORK</span>
          </div>

          {/* Main Heading with Animation */}
          <h2 className="text-4xl md:text-6xl font-bold text-[rgb(0,14,41)] mb-4 leading-tight">
            GRAVITY –<br />
            Connecting<br />
            <span className="inline-block min-w-[280px] typed-wrapper">
              <span className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent typed-text">HomeOwner</span>
            </span>
            <br />
            with Trusted<br />
            Builders & Experts
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 max-w-xl">
            The future of home construction is here. Connect with verified builders, get transparent pricing, and build your dream home with confidence.
          </p>
        </div>

        {/* Stats Grid - Train animation */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4">
          {/* Box 1 */}
          <div className="stat-train bg-white border border-gray-200 rounded-2xl p-4 md:p-5 text-center shadow-sm hover:shadow-lg hover:border-[rgb(210,152,4)] transition-all duration-300 hover:-translate-y-1">
            <i className="fas fa-building text-2xl text-[rgba(210,152,4,0.6)] mb-2"></i>
            <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">50,000+</div>
            <div className="text-sm text-[rgb(0,14,41)] opacity-80 font-medium">Trusted Companies</div>
          </div>
          
          {/* Box 2 */}
          <div className="stat-train bg-white border border-gray-200 rounded-2xl p-4 md:p-5 text-center shadow-sm hover:shadow-lg hover:border-[rgb(210,152,4)] transition-all duration-300 hover:-translate-y-1">
            <i className="fas fa-star text-2xl text-[rgba(210,152,4,0.6)] mb-2"></i>
            <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">99.8%</div>
            <div className="text-sm text-[rgb(0,14,41)] opacity-80 font-medium">Customer Sat.</div>
          </div>
          
          {/* Box 3 */}
          <div className="stat-train bg-white border border-gray-200 rounded-2xl p-4 md:p-5 text-center shadow-sm hover:shadow-lg hover:border-[rgb(210,152,4)] transition-all duration-300 hover:-translate-y-1">
            <i className="fas fa-hard-hat text-2xl text-[rgba(210,152,4,0.6)] mb-2"></i>
            <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">150k+</div>
            <div className="text-sm text-[rgb(0,14,41)] opacity-80 font-medium">Projects Done</div>
          </div>
          
          {/* Box 4 */}
          <div className="stat-train bg-white border border-gray-200 rounded-2xl p-4 md:p-5 text-center shadow-sm hover:shadow-lg hover:border-[rgb(210,152,4)] transition-all duration-300 hover:-translate-y-1">
            <i className="fas fa-headset text-2xl text-[rgba(210,152,4,0.6)] mb-2"></i>
            <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">24/7</div>
            <div className="text-sm text-[rgb(0,14,41)] opacity-80 font-medium">Support</div>
          </div>
          
          {/* Box 5 */}
          <div className="stat-train bg-white border border-gray-200 rounded-2xl p-4 md:p-5 text-center shadow-sm hover:shadow-lg hover:border-[rgb(210,152,4)] transition-all duration-300 hover:-translate-y-1">
            <i className="fas fa-face-smile text-2xl text-[rgba(210,152,4,0.6)] mb-2"></i>
            <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">187k+</div>
            <div className="text-sm text-[rgb(0,14,41)] opacity-80 font-medium">Happy Customers</div>
          </div>
          
          {/* Box 6 */}
          <div className="stat-train bg-white border border-gray-200 rounded-2xl p-4 md:p-5 text-center shadow-sm hover:shadow-lg hover:border-[rgb(210,152,4)] transition-all duration-300 hover:-translate-y-1">
            <i className="fas fa-trowel text-2xl text-[rgba(210,152,4,0.6)] mb-2"></i>
            <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">8,200+</div>
            <div className="text-sm text-[rgb(0,14,41)] opacity-80 font-medium">Expert Builders</div>
          </div>
        </div>

        {/* Micro Trust */}
        <div className="flex items-center gap-3 mt-6 text-[rgb(0,14,41)]">
          <i className="fas fa-circle-check text-[rgb(210,152,4)]"></i>
          <span className="text-sm">ISO certified partners · fully insured</span>
        </div>
      </div>

      {/* RIGHT SIDE - Image from public/assets */}
      <div className="flex-1 min-w-[320px] flex items-stretch">
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-[rgba(210,152,4,0.2)] hover:scale-[1.01] transition-transform duration-700 group relative bg-gradient-to-br from-gray-100 to-gray-200 min-h-[500px] md:min-h-[600px] flex items-center justify-center">
          <img 
            src="/assets/LandingPage.jpg "
            alt="Modern apartment building construction"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            loading="eager"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
            }}
          />
        </div>
      </div>
    </div>
  </div>

  {/* Typing Animation Script */}
  <script dangerouslySetInnerHTML={{
    __html: `
      (function() {
        if (typeof window !== 'undefined') {
          function initTyping() {
            const words = ['HomeOwner', 'HomeDreamers'];
            const typedTextElement = document.querySelector('.typed-text');
            
            if (!typedTextElement) return;
            
            let wordIndex = 0;
            let charIndex = words[0].length;
            let isDeleting = false;
            
            typedTextElement.textContent = words[0];
            
            function typeEffect() {
              const currentWord = words[wordIndex];
              
              if (isDeleting) {
                typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
              } else {
                typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
              }
              
              if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1500);
                return;
              }
              
              if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
              }
              
              const speed = isDeleting ? 40 : 60;
              setTimeout(typeEffect, speed);
            }
            
            setTimeout(typeEffect, 1000);
          }
          
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTyping);
          } else {
            initTyping();
          }
        }
      })();
    `
  }} />

  {/* Animations */}
  <style>{`
    .stat-train {
      opacity: 0;
      animation: trainArrival 0.4s forwards;
    }
    
    .stat-train:nth-child(1) { animation-delay: 0.1s; }
    .stat-train:nth-child(2) { animation-delay: 0.2s; }
    .stat-train:nth-child(3) { animation-delay: 0.3s; }
    .stat-train:nth-child(4) { animation-delay: 0.4s; }
    .stat-train:nth-child(5) { animation-delay: 0.5s; }
    .stat-train:nth-child(6) { animation-delay: 0.6s; }
    
    @keyframes trainArrival {
      0% {
        opacity: 0;
        transform: translateX(-30px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .typed-wrapper {
      min-width: 280px;
      display: inline-block;
    }
    
    .typed-text {
      display: inline-block;
    }
  `}</style>

  {/* Font Awesome */}
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
</section>


      {/* About Section */}
<section
  id="about"
  className="relative overflow-hidden flex items-center"
  style={{ minHeight: "100vh", padding: "60px 0" }}
>
  <style>{`
    /* ── Keyframes ───────────────────────────────────────────── */
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(28px); }
      to   { opacity:1; transform:translateY(0); }
    }

    /* Orbit: ring rotates, icons counter-rotate to stay upright */
    @keyframes orbitSpin {
      from { transform: translateY(-50%) rotate(0deg); }
      to   { transform: translateY(-50%) rotate(360deg); }
    }
    @keyframes counterSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(-360deg); }
    }

    /* Background hexagons drift slowly */
    @keyframes hexDrift1 {
      0%,100% { transform: translateY(0px) rotate(0deg);   opacity:0.18; }
      50%     { transform: translateY(-22px) rotate(6deg); opacity:0.28; }
    }
    @keyframes hexDrift2 {
      0%,100% { transform: translateY(0px) rotate(0deg);    opacity:0.12; }
      50%     { transform: translateY(18px) rotate(-5deg);  opacity:0.22; }
    }
    @keyframes hexDrift3 {
      0%,100% { transform: translateY(0px) rotate(0deg);   opacity:0.10; }
      50%     { transform: translateY(-14px) rotate(8deg); opacity:0.20; }
    }

    /* Gold pulse ring */
    @keyframes pulseBorder {
      0%,100% { box-shadow: 0 0 0 0 rgba(210,152,4,0.5); }
      50%     { box-shadow: 0 0 0 12px rgba(210,152,4,0); }
    }

    /* Slow spin for outer dashed ring */
    @keyframes spinSlow {
      from { transform: translateY(-50%) rotate(0deg); }
      to   { transform: translateY(-50%) rotate(360deg); }
    }

    /* Diagonal shape shimmer */
    @keyframes diagShimmer {
      0%   { opacity: 0.45; }
      50%  { opacity: 0.65; }
      100% { opacity: 0.45; }
    }

    /* ── Utility ─────────────────────────────────────────────── */
    .fu    { animation: fadeUp 0.7s ease-out both; }
    .fu.d1 { animation-delay: 0.05s; }
    .fu.d2 { animation-delay: 0.25s; }
    .fu.d3 { animation-delay: 0.42s; }
    .fu.d4 { animation-delay: 0.58s; }
    .fu.d5 { animation-delay: 0.74s; }
    .fu.d6 { animation-delay: 0.90s; }
    .fu.d7 { animation-delay: 1.08s; }

    /* ── Orbit ring ──────────────────────────────────────────── */
    #about .orbit-ring {
      position: absolute;
      /* Circle r=260. Ring r=350. right = -(260 + (350-260)) = -350 */
      right: -350px;
      top: 50%;
      width: 700px;   /* 2 × 350 */
      height: 700px;
      animation: orbitSpin 22s linear infinite;
      z-index: 8;
      pointer-events: none;
    }
    #about .orbit-icon {
      position: absolute;
      width: 30px;
      height: 30px;
      animation: counterSpin 22s linear infinite;
    }
    #about .orbit-icon svg {
      width: 30px;
      height: 30px;
      color: #EEB21B;
      filter:
        drop-shadow(0 0 7px rgba(235,178,27,0.95))
        drop-shadow(0 2px 10px rgba(0,0,0,0.8));
    }

    /* ── Background hex shapes ───────────────────────────────── */
    #about .hex-bg svg { position:absolute; pointer-events:none; }
  `}</style>

  {/* ════════════════════════════════════════════════════════
      LAYER 0 — solid dark base
  ════════════════════════════════════════════════════════ */}
  <div style={{
    position:"absolute", 
    inset:0, 
    zIndex:0,
    backgroundImage: "url('/assets/Screenshot 2026-02-27 134840.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}/>

{/* ════════════════════════════════════════════════════════
    LAYER 1 — animated hexagon grid (5 polygons only, spread left to middle)
════════════════════════════════════════════════════════ */}
<div className="hex-bg" style={{ position:"absolute", inset:0, zIndex:1, overflow:"hidden" }}>
  {/* Just 5 polygons spread from left to middle */}
  {[
    /* [x%,  y%,   size, delay] */
    [5,   15,   130, "0s"],      // Top left
    [20,  40,   110, "0.5s"],    // Middle left
    [35,  65,   140, "1s"],      // Center middle
    [45,  25,   120, "1.5s"],    // Upper middle
    [30,  85,   100, "2s"],      // Lower middle
  ].map(([x, y, size, delay], i) => (
    <svg
      key={i}
      viewBox="0 0 100 115"
      style={{
        position:"absolute",
        left:`${x}%`, 
        top:`${y}%`,
        width:`${size}px`, 
        height:`${size}px`,
        animation:`float ${5 + i * 0.5}s ease-in-out ${delay} infinite, glowPulse 2.5s ease-in-out ${delay} infinite`,
        transform: i % 2 === 0 ? 'rotate(5deg)' : 'rotate(-3deg)',
      }}
      fill="none"
      stroke="#D29804"
      strokeWidth="1.8"
    >
      <polygon points="50,5 95,28 95,87 50,110 5,87 5,28"/>
    </svg>
  ))}

  {/* CSS for animations */}
  <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(var(--rotate, 0deg)); }
      50% { transform: translateY(-15px) rotate(var(--rotate, 0deg)); }
    }
    @keyframes glowPulse {
      0%, 100% {
        filter: drop-shadow(0 0 4px #D29804) drop-shadow(0 0 10px #EEB21B);
        stroke: #D29804;
        opacity: 1;
      }
      50% {
        filter: drop-shadow(0 0 0px transparent);
        stroke: rgba(210,152,4,0.2);
        opacity: 0.3;
      }
    }
  `}</style>
</div>

{/* ════════════════════════════════════════════════════════
    LAYER 2 — radial glow: warm amber right, cool dark left
════════════════════════════════════════════════════════ */}
<div style={{
  position:"absolute", 
  inset:0, 
  zIndex:2, 
  pointerEvents:"none",
  background:`
    radial-gradient(ellipse 55% 70% at 85% 50%, rgba(210,152,4,0.2) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 15% 50%, rgba(20,12,0,0.1) 0%, transparent 60%)
  `,
}}/>


  {/* ════════════════════════════════════════════════════════
      LAYER 3 — diagonal accent shape (left side, like reference)
  ════════════════════════════════════════════════════════ */}
  <div style={{
    position:"absolute", zIndex:3,
    left:"-80px", top:"50%", transform:"translateY(-50%)",
    width:"460px", height:"460px",
    background:"linear-gradient(135deg,rgba(120,68,0,0.52) 0%,rgba(18,10,0,0.28) 100%)",
    clipPath:"polygon(20% 0%,100% 0%,80% 100%,0% 100%)",
    animation:"diagShimmer 4s ease-in-out infinite",
    pointerEvents:"none",
  }}/>

  {/* ════════════════════════════════════════════════════════
      LAYER 4 — main content (grid: text | circle+orbit)
  ════════════════════════════════════════════════════════ */}
  <div style={{
    position:"relative", zIndex:4,
    width:"100%", maxWidth:"1280px",
    margin:"0 auto", padding:"0 48px",
  }}>
    <div style={{
      display:"grid",
      gridTemplateColumns:"1fr 1fr",
      gap:"32px",
      alignItems:"center",
    }}>

      {/* ── LEFT: Text content ─────────────────────────────── */}
      <div>
        {/* Heading */}
   <h2 className="fu d2" style={{
  fontWeight: 800,
  lineHeight: 1.15,
  marginBottom: "28px",
  fontSize: "clamp(2.4rem, 4.2vw, 3.6rem)",
  color: "#fff"
}}>
  About Our <span style={{ color: "#D29804" }}>Company</span>
</h2>
        {/* Body text */}
  <p className="fu d3" style={{ color:"rgba(255,255,255,0.72)", lineHeight:1.82, fontSize:"0.93rem", marginBottom:"16px" }}>
  GRAVITY is where dreams take shape and foundations are built on trust. We bridge the gap between homeowners with vision and builders with expertise, creating a seamless journey from blueprint to reality. Whether you're planning your first home or your forever home, we connect you with verified construction partners who share your passion for perfection.
</p>

<p className="fu d4" style={{ color:"rgba(255,255,255,0.72)", lineHeight:1.82, fontSize:"0.93rem", marginBottom:"16px" }}>
  Transparency is our cornerstone. Every builder in our network undergoes rigorous verification, every quote is detailed, and every timeline is clear from day one. No hidden costs, no unexpected delays — just honest communication and quality craftsmanship that brings your vision to life exactly as you imagined.
</p>

<p className="fu d5" style={{ color:"rgba(255,255,255,0.72)", lineHeight:1.82, fontSize:"0.93rem", marginBottom:"16px" }}>
  Your home is more than walls and beams — it's where memories will be made, families will grow, and your unique story will unfold. We treat every project with the care and attention it deserves, matching you with builders who understand that they're not just constructing buildings, they're crafting the backdrop for your life's most precious moments.
</p>

<p className="fu d6" style={{ color:"rgba(255,255,255,0.72)", lineHeight:1.82, fontSize:"0.93rem" }}>
  Join thousands of homeowners who've found clarity in their construction journey through GRAVITY. From foundation to finishing touches, we're with you every step of the way — ensuring that when you finally step through your front door, you're stepping into a home built exactly as you dreamed, with trust and transparency at its core.
</p>

<p className="fu d7" style={{
  marginTop:"36px", color:"rgba(210,152,4,0.7)",
  fontSize:"0.74rem", letterSpacing:"0.28em",
}}>
  GRAVITY — BUILD WITH TRUST, LIVE WITH CLARITY
</p>
      </div>

      {/* ── RIGHT: Half-circle + orbit icons ───────────────── */}
      {/*
        Circle: 520px diameter, right:-260px → right half hidden by overflow:hidden
        Circle centre from right wall: 260px
        Orbit ring: 700px (r=350), right:-350px
        Icon positions (centre 350,350), icon 30px → offset -15:
          θ=0°   left:335  top:-15
          θ=45°  left:582  top:87
          θ=90°  left:685  top:335
          θ=135° left:582  top:582
          θ=180° left:335  top:685
          θ=225° left:87   top:582
          θ=270° left:-15  top:335
          θ=315° left:87   top:87
      */}
<div style={{ 
  position:"relative", 
  height:"680px", 
  display:"flex", 
  justifyContent:"flex-end",
  width: "100%",
  overflow:"hidden"
}}>

  {/* Gold decorative dot above circle */}
  <div style={{
    position:"absolute",
    right:"calc(200px - 12px)",
    top:"calc(50% - 200px - 36px)",
    width:"20px", height:"20px", borderRadius:"50%",
    background:"#D29804",
    boxShadow:"0 0 18px rgba(210,152,4,0.9), 0 0 40px rgba(210,152,4,0.4)",
    zIndex:9,
  }}/>

  {/* Gold border ring — pulse (wraps main circle) */}
  <div style={{
    position:"absolute",
    right:"calc(-200px - 12px)",
    top:"50%",
    transform:"translateY(-50%)",
    width:"424px", height:"424px",
    borderRadius:"50%",
    border:"3px solid #D29804",
    animation:"pulseBorder 2.8s ease-in-out infinite",
    zIndex:7,
    pointerEvents:"none",
  }}/>

  {/* Main circle image — 400px, right half bleeds */}
  <div style={{
    position:"absolute",
    right:"-200px",
    top:"50%",
    transform:"translateY(-50%)",
    width:"400px", height:"400px",
    borderRadius:"50%",
    overflow:"hidden",
    zIndex:8,
    boxShadow:"0 20px 80px rgba(0,0,0,0.7)",
  }}>
    <img
      src="/assets/f.jpg"
      alt="Construction"
      style={{ width:"100%", height:"100%", objectFit:"cover" }}
    />
  </div>

  {/* ── Orbit ring ──────────────────────────────────────────────────
      Ring div: 640×640, radius=320, centre=(320,320)
      Icon size: 160px, half=80px
      Gap between inner circle edge (200px) and orbit icon edge:
        320 - 80 - 200 = 40px gap — nice and close

      right offset: 200 (half circle) + (320-200) = 320 → right: calc(-200px - 120px)

      pos: left = 320 + 320*sin(θ) - 80,  top = 320 - 320*cos(θ) - 80
      θ=0°:    left=240   top=-80
      θ=45°:   left=466   top=13
      θ=90°:   left=560   top=240
      θ=135°:  left=466   top=466
      θ=180°:  left=240   top=560
      θ=225°:  left=13    top=466
      θ=270°:  left=-80   top=240
      θ=315°:  left=13    top=13
  ── */}
  <div className="orbit-ring-close">

    {/* θ=0° */}
    <div className="orbit-icon-close" style={{ left:"240px", top:"-80px" }}>
      <div className="orbit-img-wrap-close"
        onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1.1)"}
        onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1)"}
      >
        <img src="/assets/big_house.jpg" alt="Residential" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div className="orbit-label-close">Residential</div>
      </div>
    </div>

    {/* θ=45° */}
    <div className="orbit-icon-close" style={{ left:"466px", top:"13px" }}>
      <div className="orbit-img-wrap-close"
        onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1.1)"}
        onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1)"}
      >
        <img src="/assets/modern-business-buildings-financial-district.jpg" alt="Industrial" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div className="orbit-label-close">Industrial</div>
      </div>
    </div>

    {/* θ=90° */}
    <div className="orbit-icon-close" style={{ left:"560px", top:"240px" }}>
      <div className="orbit-img-wrap-close"
        onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1.1)"}
        onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1)"}
      >
        <img src="/assets/images_2.jpeg" alt="Commercial" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div className="orbit-label-close">Commercial</div>
      </div>
    </div>

    {/* θ=135° */}
    <div className="orbit-icon-close" style={{ left:"466px", top:"466px" }}>
      <div className="orbit-img-wrap-close"
        onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1.1)"}
        onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1)"}
      >
        <img src="/assets/small_apartments.jpg" alt="Apartments" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div className="orbit-label-close">Apartments</div>
      </div>
    </div>

    {/* θ=180° */}
    <div className="orbit-icon-close" style={{ left:"240px", top:"560px" }}>
      <div className="orbit-img-wrap-close"
        onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1.1)"}
        onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1)"}
      >
        <img src="/assets/m.jpg" alt="Villas" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div className="orbit-label-close">Villas</div>
      </div>
    </div>

    {/* θ=225° */}
    <div className="orbit-icon-close" style={{ left:"13px", top:"466px" }}>
      <div className="orbit-img-wrap-close"
        onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1.1)"}
        onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1)"}
      >
        <img src="/assets/office.jpg" alt="Interiors" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div className="orbit-label-close">Interiors</div>
      </div>
    </div>

    {/* θ=270° */}
    <div className="orbit-icon-close" style={{ left:"-80px", top:"240px" }}>
      <div className="orbit-img-wrap-close"
        onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1.1)"}
        onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1)"}
      >
        <img src="/assets/high-building-construction-city.jpg" alt="Renovation" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div className="orbit-label-close">Renovation</div>
      </div>
    </div>

    {/* θ=315° */}
    <div className="orbit-icon-close" style={{ left:"13px", top:"13px" }}>
      <div className="orbit-img-wrap-close"
        onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1.1)"}
        onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.transform="scale(1)"}
      >
        <img src="/assets/pexels-photo-1396132.jpeg" alt="Landscaping" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div className="orbit-label-close">Landscaping</div>
      </div>
    </div>

  </div>

  <style>{`
    @keyframes orbitSpinClose {
      from { transform: translateY(-50%) rotate(0deg); }
      to   { transform: translateY(-50%) rotate(360deg); }
    }
    @keyframes counterSpinClose {
      from { transform: rotate(0deg); }
      to   { transform: rotate(-360deg); }
    }
    @keyframes pulseBorder {
      0%, 100% { opacity:0.8; box-shadow:0 0 15px rgba(210,152,4,0.4); }
      50%       { opacity:1;   box-shadow:0 0 35px rgba(210,152,4,0.85), 0 0 60px rgba(210,152,4,0.25); }
    }
    @keyframes glowPulseClose {
      0%, 100% { box-shadow: 0 0 16px rgba(210,152,4,0.55), 0 0 32px rgba(210,152,4,0.25), 0 8px 30px rgba(0,0,0,0.55); }
      50%       { box-shadow: 0 0 32px rgba(210,152,4,0.95), 0 0 60px rgba(210,152,4,0.5),  0 8px 30px rgba(0,0,0,0.55); }
    }

    /* Ring: 640×640, right offset = 200 + (320-200) = 320 → right:-320px = calc(-200px - 120px) */
    .orbit-ring-close {
      position: absolute;
      right: calc(-200px - 120px);
      top: 50%;
      width: 640px;
      height: 640px;
      animation: orbitSpinClose 28s linear infinite;
      transform-origin: center center;
      transform: translateY(-50%) rotate(0deg);
      z-index: 10;
      pointer-events: none;
    }

    .orbit-icon-close {
      position: absolute;
      width: 160px;
      height: 160px;
      animation: counterSpinClose 28s linear infinite;
      pointer-events: all;
    }

    .orbit-img-wrap-close {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid #D29804;
      cursor: pointer;
      transition: transform 0.3s ease;
      animation: glowPulseClose 3s ease-in-out infinite;
      position: relative;
    }

    .orbit-label-close {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(210,152,4,0.55) 60%, transparent 100%);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-align: center;
      padding: 20px 4px 8px;
      text-transform: uppercase;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .orbit-img-wrap-close:hover .orbit-label-close {
      opacity: 1;
    }
  `}</style>
</div>
    </div>
  </div>
</section>


      {/* Why Choose GRAVITY Section */}
<section id="why" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D29804]/5 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#EEB21B]/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
  </div>

  <div className="container mx-auto relative z-10">
    {/* Header Section with Fade-in Animation */}
    <div className="text-center mb-12 sm:mb-16 animate-fadeInUp">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#EEB21B]">
        Why Choose GRAVITY?
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-6 leading-relaxed">
        Experience the future of home construction with our revolutionary platform that puts trust, quality, and transparency at the forefront.
      </p>
    </div>

    {/* Features Grid with Stagger Animation */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
      {[
        {
          icon: '🏗️',
          title: 'Verified Builders',
          description: 'Every builder in our network is thoroughly vetted and verified for quality and reliability.',
          delay: 'animation-delay-100'
        },
        {
          icon: '✨',
          title: 'Quality Guarantee',
          description: 'We ensure every project meets our high standards with comprehensive quality checks.',
          delay: 'animation-delay-200'
        },
        {
          icon: '👷',
          title: 'Expert Support',
          description: 'Our team of construction experts provides guidance throughout your building journey.',
          delay: 'animation-delay-300'
        },
        {
          icon: '📊',
          title: 'Full Transparency',
          description: 'Complete visibility into costs, timelines, and progress with real-time project updates.',
          delay: 'animation-delay-400'
        },
        {
          icon: '🎯',
          title: 'Customer First',
          description: 'Your satisfaction is our priority. We\'re committed to making your dream home a reality.',
          delay: 'animation-delay-500'
        },
        {
          icon: '🕐',
          title: '24/7 Support',
          description: 'Round-the-clock customer support to address your concerns and queries anytime.',
          delay: 'animation-delay-600'
        }
      ].map((feature, index) => (
        <div 
          key={index}
          className={`group bg-gradient-to-br from-[#000E29] to-[#081C45] border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-[#D29804]/50 hover:shadow-2xl hover:shadow-[#D29804]/10 transition-all duration-500 hover:-translate-y-2 animate-buildUp ${feature.delay}`}
        >
          {/* Icon with Spin Animation on Hover */}
          <div className="text-3xl sm:text-4xl mb-4 group-hover:animate-bounceRotate transition-all duration-300">
            {feature.icon}
          </div>
          
          {/* Title with Underline Animation */}
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#EEB21B] relative">
            {feature.title}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D29804] group-hover:w-full transition-all duration-500"></span>
          </h3>
          
          {/* Description with Fade Effect */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
            {feature.description}
          </p>
          
          {/* Building Block Animation */}
          <div className="mt-4 flex space-x-1">
            <div className="w-2 h-2 bg-[#D29804]/30 rounded-sm group-hover:bg-[#D29804] transition-all duration-300 animate-pulse"></div>
            <div className="w-2 h-2 bg-[#D29804]/30 rounded-sm group-hover:bg-[#D29804] transition-all duration-500 animate-pulse animation-delay-100"></div>
            <div className="w-2 h-2 bg-[#D29804]/30 rounded-sm group-hover:bg-[#D29804] transition-all duration-700 animate-pulse animation-delay-200"></div>
          </div>
        </div>
      ))}
    </div>

 
  </div>
</section>



      {/* Mission & Vision Section */}
<section id="vision-mission" className="py-8 px-6 relative overflow-hidden min-h-[450px] flex items-center">
  {/* Background Image */}
  <div className="absolute inset-0 w-full h-full">
    <img 
      src="/assets/H.png"
      alt="Construction background"
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center'
      }}
    />
    {/* Dark overlay for better readability */}
    <div className="absolute inset-0 bg-black/60"></div>
  </div>

  {/* Content */}
  <div className="container mx-auto max-w-7xl relative z-10">
    {/* Header - Reduced margin */}
    <div className="text-center mb-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
        Our <span className="bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">Vision & Mission</span>
      </h2>
      <p className="text-base text-gray-200 max-w-2xl mx-auto">
        Driving innovation and excellence in the construction industry through clear purpose and unwavering commitment.
      </p>
    </div>

    {/* Vision & Mission Boxes - Compact layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {/* Vision Box - Compact */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] hover:border-[#D29804]/60 animate-fadeInUp animate-delay-1 group">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-[#D29804]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-[#EEB21B]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">
            Our Vision
          </h3>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-200 text-sm leading-relaxed">
            To become the world's most trusted platform for construction and home building, where every dream home becomes a reality through innovation, transparency, and excellence in execution.
          </p>
          
          <p className="text-gray-200 text-sm leading-relaxed italic border-l-4 border-[#D29804] pl-3">
            "Creating spaces that inspire, communities that thrive, and relationships that last."
          </p>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#EEB21B]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-200 text-xs">Global Excellence</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#EEB21B]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-200 text-xs">Innovation</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#EEB21B]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-200 text-xs">Transparency</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#EEB21B]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-200 text-xs">Sustainability</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Box - Compact */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] hover:border-[#D29804]/60 animate-fadeInUp animate-delay-2 group">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-[#D29804]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-[#EEB21B]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D29804] to-[#EEB21B] bg-clip-text text-transparent">
            Our Mission
          </h3>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-200 text-sm leading-relaxed">
            To connect homeowners with verified construction experts, ensuring quality craftsmanship, transparent communication, and timely delivery while fostering long-term relationships built on trust.
          </p>
          
          <div className="bg-white/5 rounded-lg p-3 mt-2">
            <h4 className="text-[#EEB21B] font-semibold mb-2 text-sm">Key Commitments:</h4>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#EEB21B] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-200 text-xs">100% verified professionals</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#EEB21B] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-200 text-xs">Transparent pricing & timelines</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#EEB21B] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-200 text-xs">Dedicated project support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Top Rated Companies */}
{/* ============================================================
    TOP RATED COMPANIES — paste this block directly into your page
    No imports / exports / helper functions needed
    ============================================================ */}

{/* Keyframes injected once */}
<style>{`
  @keyframes trc-fadeUp {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes trc-shimmer {
    0%   { background-position: 0%   50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0%   50%; }
  }
  @keyframes trc-badgePop {
    0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
    65%  { transform: scale(1.15) rotate(3deg);  opacity: 1; }
    100% { transform: scale(1)    rotate(0deg);  opacity: 1; }
  }
  @keyframes trc-glowPulse {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.9; }
  }
  @keyframes trc-orb {
    0%, 100% { transform: scale(1)    translateY(0px);   }
    50%       { transform: scale(1.08) translateY(-14px); }
  }

  .trc-header  { animation: trc-fadeUp 0.65s cubic-bezier(.22,.68,0,1.2) 0.1s both; }
  .trc-card    { animation: trc-fadeUp 0.6s  cubic-bezier(.22,.68,0,1.2) both; }
  .trc-badge   { animation: trc-badgePop 0.55s cubic-bezier(.22,.68,0,1.2) 0.4s both; }
  .trc-divider { animation: trc-glowPulse 2.8s ease-in-out infinite; }
  .trc-orb     { animation: trc-orb 7s ease-in-out infinite; }
  .trc-orb-alt { animation: trc-orb 9s ease-in-out infinite reverse; }

  .trc-shimmer {
    background: linear-gradient(90deg, #D29804 0%, #EEB21B 40%, #fff8e0 55%, #EEB21B 70%, #D29804 100%);
    background-size: 250% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: trc-shimmer 3.5s linear infinite;
  }

  .trc-card:hover {
    transform: translateY(-8px) scale(1.025) !important;
    border-color: rgba(210,152,4,0.55) !important;
    box-shadow: 0 28px 56px -10px rgba(210,152,4,0.35), 0 0 0 1.5px rgba(238,178,27,0.35) !important;
  }
  .trc-img { transition: transform 0.55s cubic-bezier(.22,.68,0,1.2); }
  .trc-card:hover .trc-img { transform: scale(1.1); }
  .trc-card:hover .trc-name { color: #EEB21B; }
  .trc-name { transition: color 0.2s ease; }
  .trc-star { transition: transform 0.2s cubic-bezier(.22,.68,0,1.2); display: inline-block; }
  .trc-star:hover { transform: scale(1.4) rotate(10deg); }
  .trc-tag  { transition: all 0.2s ease; }
  .trc-tag:hover {
    border-color: rgba(238,178,27,0.7) !important;
    color: #EEB21B !important;
    background: rgba(210,152,4,0.15) !important;
  }
`}</style>

<section
  id="companies"
  className="relative overflow-hidden py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8"
  style={{
    backgroundImage: "url('/assets/Screenshot 2026-02-28 235249 - Copy.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
 




  {/* ── Content ── */}
  <div className="relative max-w-screen-xl mx-auto">

    {/* Header */}
    <div className="trc-header text-center mb-10 sm:mb-14">
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="h-px w-10 rounded-full" style={{ background: "linear-gradient(to right, transparent, #D29804)" }} />
        <span className="text-[11px] font-bold tracking-[0.24em] uppercase" style={{ color: "#EEB21B" }}>
          Trusted Partners
        </span>
        <span className="h-px w-10 rounded-full" style={{ background: "linear-gradient(to left, transparent, #D29804)" }} />
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
        <span className="trc-shimmer"> Top Rated Companies</span>
      </h2>

      <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto " style={{ color: "rgba(0, 0, 0, )" }}>
        Meet our highest-rated construction partners who consistently deliver
        exceptional quality and exceed client expectations.
      </p>
    </div>

    {/* Cards grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">

      {/* ── Card 1 ── */}
      <div className="trc-card flex flex-col rounded-2xl overflow-hidden" style={{ animationDelay: "0ms", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(160deg,#000E29 0%,#081C45 100%)", boxShadow: "0 4px 24px -6px rgba(0,14,41,0.7)", transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2),box-shadow 0.35s ease,border-color 0.3s ease" }}>
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "clamp(130px,16vw,158px)" }}>
          <img src="/assets/small_apartments.jpg" alt="Elite Constructors" className="trc-img w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,14,41,0.82) 0%,transparent 55%)" }} />
          <div className="trc-badge absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", color: "#000E29", animationDelay: "0ms" }}>🏆 Top Rated 2024</div>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-lg" style={{ background: "linear-gradient(135deg,#EEB21B,#D29804)", color: "#000E29" }}>★ 5</div>
        </div>
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <h3 className="trc-name font-extrabold text-sm sm:text-base leading-snug mb-1 text-white">Elite Constructors</h3>
          <p className="flex items-center gap-1 text-[11px] mb-2" style={{ color: "#D29804" }}>
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            New York, NY
          </p>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>(421)</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Luxury Homes</span>
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Commercial Buildings</span>
          </div>
          <div className="trc-divider h-px w-full mb-3 rounded-full" style={{ background: "linear-gradient(to right,transparent,#D29804,transparent)" }} />
          <div className="mt-auto grid grid-cols-2 text-center gap-1">
            <div><p className="text-base sm:text-xl font-extrabold text-white leading-none">380+</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Projects</p></div>
            <div><p className="text-base sm:text-xl font-extrabold leading-none" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>18</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Years</p></div>
          </div>
        </div>
      </div>

      {/* ── Card 2 ── */}
      <div className="trc-card flex flex-col rounded-2xl overflow-hidden" style={{ animationDelay: "110ms", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(160deg,#000E29 0%,#081C45 100%)", boxShadow: "0 4px 24px -6px rgba(0,14,41,0.7)", transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2),box-shadow 0.35s ease,border-color 0.3s ease" }}>
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "clamp(130px,16vw,158px)" }}>
          <img src="/assets/big_house.jpg" alt="Metropolitan Builders" className="trc-img w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,14,41,0.82) 0%,transparent 55%)" }} />
          <div className="trc-badge absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", color: "#000E29", animationDelay: "110ms" }}>🏆 Eco Champion</div>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-lg" style={{ background: "linear-gradient(135deg,#EEB21B,#D29804)", color: "#000E29" }}>★ 4.9</div>
        </div>
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <h3 className="trc-name font-extrabold text-sm sm:text-base leading-snug mb-1 text-white">Metropolitan Builders</h3>
          <p className="flex items-center gap-1 text-[11px] mb-2" style={{ color: "#D29804" }}>
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            Los Angeles, CA
          </p>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "rgba(255,255,255,0.2)" }}>★</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>(567)</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Modern Architecture</span>
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Eco-Friendly</span>
          </div>
          <div className="trc-divider h-px w-full mb-3 rounded-full" style={{ background: "linear-gradient(to right,transparent,#D29804,transparent)" }} />
          <div className="mt-auto grid grid-cols-2 text-center gap-1">
            <div><p className="text-base sm:text-xl font-extrabold text-white leading-none">492+</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Projects</p></div>
            <div><p className="text-base sm:text-xl font-extrabold leading-none" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>22</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Years</p></div>
          </div>
        </div>
      </div>

      {/* ── Card 3 ── */}
      <div className="trc-card flex flex-col rounded-2xl overflow-hidden" style={{ animationDelay: "220ms", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(160deg,#000E29 0%,#081C45 100%)", boxShadow: "0 4px 24px -6px rgba(0,14,41,0.7)", transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2),box-shadow 0.35s ease,border-color 0.3s ease" }}>
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "clamp(130px,16vw,158px)" }}>
          <img src="/assets/AlternativeSignUpImage.jpg" alt="Prestige Developments" className="trc-img w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,14,41,0.82) 0%,transparent 55%)" }} />
          <div className="trc-badge absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", color: "#000E29", animationDelay: "220ms" }}>🏆 Luxury Specialist</div>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-lg" style={{ background: "linear-gradient(135deg,#EEB21B,#D29804)", color: "#000E29" }}>★ 4.9</div>
        </div>
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <h3 className="trc-name font-extrabold text-sm sm:text-base leading-snug mb-1 text-white">Prestige Developments</h3>
          <p className="flex items-center gap-1 text-[11px] mb-2" style={{ color: "#D29804" }}>
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            Miami, FL
          </p>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "rgba(255,255,255,0.2)" }}>★</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>(334)</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Waterfront Properties</span>
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Luxury Resorts</span>
          </div>
          <div className="trc-divider h-px w-full mb-3 rounded-full" style={{ background: "linear-gradient(to right,transparent,#D29804,transparent)" }} />
          <div className="mt-auto grid grid-cols-2 text-center gap-1">
            <div><p className="text-base sm:text-xl font-extrabold text-white leading-none">245+</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Projects</p></div>
            <div><p className="text-base sm:text-xl font-extrabold leading-none" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>15</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Years</p></div>
          </div>
        </div>
      </div>

      {/* ── Card 4 ── */}
      <div className="trc-card flex flex-col rounded-2xl overflow-hidden" style={{ animationDelay: "330ms", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(160deg,#000E29 0%,#081C45 100%)", boxShadow: "0 4px 24px -6px rgba(0,14,41,0.7)", transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2),box-shadow 0.35s ease,border-color 0.3s ease" }}>
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "clamp(130px,16vw,158px)" }}>
          <img src="/assets/office.jpg" alt="Urban Innovators" className="trc-img w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,14,41,0.82) 0%,transparent 55%)" }} />
          <div className="trc-badge absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", color: "#000E29", animationDelay: "330ms" }}>🏆 Innovation Leader</div>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-lg" style={{ background: "linear-gradient(135deg,#EEB21B,#D29804)", color: "#000E29" }}>★ 4.5</div>
        </div>
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <h3 className="trc-name font-extrabold text-sm sm:text-base leading-snug mb-1 text-white">Urban Innovators</h3>
          <p className="flex items-center gap-1 text-[11px] mb-2" style={{ color: "#D29804" }}>
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            Chicago, IL
          </p>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "rgba(255,255,255,0.2)" }}>★</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>(612)</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Urban Development</span>
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Smart Buildings</span>
          </div>
          <div className="trc-divider h-px w-full mb-3 rounded-full" style={{ background: "linear-gradient(to right,transparent,#D29804,transparent)" }} />
          <div className="mt-auto grid grid-cols-2 text-center gap-1">
            <div><p className="text-base sm:text-xl font-extrabold text-white leading-none">678+</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Projects</p></div>
            <div><p className="text-base sm:text-xl font-extrabold leading-none" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>20</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Years</p></div>
          </div>
        </div>
      </div>

      {/* ── Card 5 ── */}
      <div className="trc-card flex flex-col rounded-2xl overflow-hidden" style={{ animationDelay: "440ms", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(160deg,#000E29 0%,#081C45 100%)", boxShadow: "0 4px 24px -6px rgba(0,14,41,0.7)", transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2),box-shadow 0.35s ease,border-color 0.3s ease" }}>
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "clamp(130px,16vw,158px)" }}>
          <img src="/assets/modern-business-buildings-financial-district.jpg" alt="Apex Structures" className="trc-img w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,14,41,0.82) 0%,transparent 55%)" }} />
          <div className="trc-badge absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", color: "#000E29", animationDelay: "440ms" }}>🏆 Rising Star</div>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-lg" style={{ background: "linear-gradient(135deg,#EEB21B,#D29804)", color: "#000E29" }}>★ 4.8</div>
        </div>
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <h3 className="trc-name font-extrabold text-sm sm:text-base leading-snug mb-1 text-white">Apex Structures</h3>
          <p className="flex items-center gap-1 text-[11px] mb-2" style={{ color: "#D29804" }}>
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            Houston, TX
          </p>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "rgba(255,255,255,0.2)" }}>★</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>(389)</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Industrial</span>
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>High-Rise</span>
          </div>
          <div className="trc-divider h-px w-full mb-3 rounded-full" style={{ background: "linear-gradient(to right,transparent,#D29804,transparent)" }} />
          <div className="mt-auto grid grid-cols-2 text-center gap-1">
            <div><p className="text-base sm:text-xl font-extrabold text-white leading-none">310+</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Projects</p></div>
            <div><p className="text-base sm:text-xl font-extrabold leading-none" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>12</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Years</p></div>
          </div>
        </div>
      </div>

      {/* ── Card 6 ── */}
      <div className="trc-card flex flex-col rounded-2xl overflow-hidden" style={{ animationDelay: "550ms", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(160deg,#000E29 0%,#081C45 100%)", boxShadow: "0 4px 24px -6px rgba(0,14,41,0.7)", transition: "transform 0.35s cubic-bezier(.22,.68,0,1.2),box-shadow 0.35s ease,border-color 0.3s ease" }}>
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: "clamp(130px,16vw,158px)" }}>
          <img src="/assets/apart2.jpg" alt="Skyline Builders" className="trc-img w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,14,41,0.82) 0%,transparent 55%)" }} />
          <div className="trc-badge absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", color: "#000E29", animationDelay: "550ms" }}>🏆 Green Builder</div>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-lg" style={{ background: "linear-gradient(135deg,#EEB21B,#D29804)", color: "#000E29" }}>★ 4.7</div>
        </div>
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <h3 className="trc-name font-extrabold text-sm sm:text-base leading-snug mb-1 text-white">Skyline Builders</h3>
          <p className="flex items-center gap-1 text-[11px] mb-2" style={{ color: "#D29804" }}>
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            Seattle, WA
          </p>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "#EEB21B" }}>★</span>
            <span className="trc-star text-sm select-none cursor-default" style={{ color: "rgba(255,255,255,0.2)" }}>★</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>(278)</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Green Buildings</span>
            <span className="trc-tag text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full cursor-default" style={{ border: "1px solid rgba(210,152,4,0.25)", color: "rgba(255,255,255,0.5)", background: "rgba(210,152,4,0.05)" }}>Tech Spaces</span>
          </div>
          <div className="trc-divider h-px w-full mb-3 rounded-full" style={{ background: "linear-gradient(to right,transparent,#D29804,transparent)" }} />
          <div className="mt-auto grid grid-cols-2 text-center gap-1">
            <div><p className="text-base sm:text-xl font-extrabold text-white leading-none">195+</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Projects</p></div>
            <div><p className="text-base sm:text-xl font-extrabold leading-none" style={{ background: "linear-gradient(135deg,#D29804,#EEB21B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>10</p><p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Years</p></div>
          </div>
        </div>
      </div>

    </div>{/* end grid */}
  </div>{/* end content */}
</section>

      {/* Footer */}
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
              V
            </span>
            ITY
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