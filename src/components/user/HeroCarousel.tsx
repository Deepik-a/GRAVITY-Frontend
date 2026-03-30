import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

/* ─── Types ─── */
interface SlideData {
  id: number;
  image: string;
  badge: string;
  headline: string;
  description: string;
  location: string;
  cta: string;
}

/* ─── Slide data ─── */
const slides: SlideData[] = [
  {
    id: 1,
    image: "/assets/luxury-architecture-exterior-design.jpg",
    badge: "#1 Choice for Construction in India",
    headline: "Full-Service Construction Experts",
    description:
      "Blending cutting-edge technology to deliver exceptional construction solutions for homeowners and dreamers ",
    location: "Pan India — Residential & Commercial",
    cta: "Explore More",
  },
  {
    id: 2,
    image: "/assets/luxury-architecture-exterior-design (1).jpg",
    badge: "Find Your Dream Home",
    headline: "Connect with\nBuilders You Trust",
    description:
      "Just across the street from the city skyline, Gravity now connects verified top-rated builders with homeowners. Every brick laid is a promise kept.",
    location: "Mumbai, Delhi, Bangalore & 9 more cities",
    cta: "Browse Builders",
  },
  {
    id: 3,
    image: "/assets/hero-slide-1.jpg",
    badge: "Commercial Excellence",
    headline: "Smart Spaces for\nGrowing Businesses",
    description:
      "From corporate campuses to retail hubs — our platform connects you with builders who deliver on time, every time, with 100% on-schedule delivery.",
    location: "Commercial Projects — Nationwide",
    cta: "Achieve your Dream",
  },
  {
    id: 4,
    image: "/assets/blending-futuristic-building-seamlessly-into-desert-landscape.jpg",
    badge: "For Every Dreamer",
    headline: "Turning Dreams\ninto Reality",
    description:
      "Whether it's your first home or your forever home, Gravity's platform makes the journey seamless, transparent, and genuinely exciting.",
    location: "1,000+ Happy Families — 12 Cities",
    cta: "Get Started",
  },
];

/* ─── Animation variants ─── */
const headlineVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.03, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const ctaVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const descVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
};

/* ─── Main Component ─── */
const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slide = slides[current];

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      4000
    );
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goTo = useCallback(
    (i: number) => { setCurrent(i); resetTimer(); },
    [resetTimer]
  );

  return (
    <section className="relative w-full h-screen min-h-[560px] overflow-hidden bg-[#0a0d14]">

      {/* ── Full-bleed background with crossfade (no scale) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${slide.id}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Image
            src={slide.image}
            alt={slide.badge}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Overlays ── */}
      {/* Bottom vignette — main text area */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(5,8,20,0.85) 0%, rgba(5,8,20,0.45) 40%, rgba(5,8,20,0.1) 70%, transparent 100%)",
        }}
      />
      {/* Left vignette */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, rgba(5,8,20,0.65) 0%, rgba(5,8,20,0.15) 50%, transparent 100%)",
        }}
      />
     
      {/* ── BOTTOM-LEFT: Badge + Headline + CTA ── */}
      <div
        className="absolute bottom-0 left-0 z-10 p-6 sm:p-8 md:p-10 lg:p-14 xl:p-16"
        style={{ paddingBottom: "clamp(4rem, 8vh, 7rem)" }}
      >
        <div className="max-w-[90vw] md:max-w-[62vw] lg:max-w-[52vw] xl:max-w-[48vw]">

          {/* Badge */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`badge-${slide.id}`}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] mb-3 sm:mb-4"
              style={{ color: "rgba(255,255,255,0.52)" }}
            >
              {slide.badge}
            </motion.p>
          </AnimatePresence>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h1-${slide.id}`}
              variants={headlineVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="font-extrabold leading-[1.04] tracking-tight text-white whitespace-pre-line mb-6 sm:mb-8"
              style={{
                fontSize: "clamp(1.75rem, 4.2vw, 3.4rem)",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: "-0.02em",
              }}
            >
              {slide.headline}
            </motion.h1>
          </AnimatePresence>

          {/* CTA */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${slide.id}`}
              variants={ctaVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.button
                className="group inline-flex items-center gap-3 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em]"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#ffffff",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(12px)",
                }}
                whileHover={{ background: "rgba(255,255,255,1)", color: "#050814", borderColor: "transparent", scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {slide.cta}
                <span
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </span>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM-RIGHT: Description card - ENLARGED & BOLDER ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`desc-${slide.id}`}
          variants={descVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute z-10 right-5 sm:right-8 md:right-10 lg:right-14 xl:right-16 max-w-[300px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[440px]"
          style={{ bottom: "clamp(4rem, 8vh, 7rem)" }}
        >
          <p
            className="text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed mb-2 sm:mb-2.5 font-semibold"
            style={{ 
              color: "rgba(255,255,255,0.85)",
              fontWeight: "600",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)"
            }}
          >
            {slide.description}
          </p>
          <p
            className="text-[11px] sm:text-[12px] uppercase tracking-[0.2em] font-bold"
            style={{ 
              color: "rgba(255,255,255,0.55)",
              fontWeight: "700"
            }}
          >
            {slide.location}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* ── BOTTOM STRIP: Slide counter + segmented bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-4 sm:gap-5 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 py-4 sm:py-5"
      >
        {/* Counter */}
        <span
          className="text-[11px] sm:text-xs font-mono shrink-0 tabular-nums"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <span className="font-bold text-sm sm:text-[15px] text-white">
            {String(current + 1).padStart(2, "0")}
          </span>
          /{String(slides.length).padStart(2, "0")}
        </span>

        {/* Segmented progress bar */}
        <div className="flex-1 flex items-center gap-1.5 sm:gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative flex-1 h-[2px] sm:h-[2.5px] rounded-full overflow-hidden cursor-pointer group"
              style={{ background: "rgba(255,255,255,0.16)" }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-full"
                style={{ background: "rgba(255,255,255,0.32)" }}
              />
              {i === current && (
                <motion.div
                  key={`fill-${current}`}
                  className="absolute inset-0 rounded-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "linear" }}
                />
              )}
              {i < current && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};

export default HeroCarousel;