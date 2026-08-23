'use client';

import { useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import Image from 'next/image';

const featuredWorks = [
  {
    title: 'Silence in Crimson',
    medium: 'Oil on Linen',
    year: '2025',
    dimensions: '40 × 50"',
    image: '/artwork/1.jpeg'
  },
  {
    title: 'The Courtyard Thread',
    medium: 'Oil on Canvas',
    year: '2026',
    dimensions: '48 × 48"',
    image: '/artwork/2.jpeg'
  },
  {
    title: 'Solitude of Autumn',
    medium: 'Oil on Panel',
    year: '2025',
    dimensions: '36 × 36"',
    image: '/artwork/3.jpeg'
  }
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Monitor scroll progress of the Hero section (250vh scroll zone)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Track scroll position to update active index
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let nextIndex = 0;
    if (latest < 0.35) {
      nextIndex = 0;
    } else if (latest < 0.70) {
      nextIndex = 1;
    } else {
      nextIndex = 2;
    }
    setActiveIndex((prev) => {
      if (prev !== nextIndex) {
        return nextIndex;
      }
      return prev;
    });
  });

  // Interactive mouse tracking for dynamic spotlight and shadow physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for Apple-level smooth movement
  const springConfig = { stiffness: 35, damping: 22, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    // Normalize coordinates from -0.5 to 0.5
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Reset light coordinates smoothly to center
    mouseX.set(0);
    mouseY.set(0);
  };

  // Parallax transform: monumental canvas slowly moves up as we scroll
  const mainYParallax = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Spotlight shifts: computed based on mouse movements
  const spotX = useTransform(smoothX, [-0.5, 0.5], ["35%", "65%"]);
  const spotY = useTransform(smoothY, [-0.5, 0.5], ["20%", "50%"]);
  
  // Highlight overlay gradient (shining on the canvas surface)
  const spotlightStyle = useMotionTemplate`radial-gradient(circle at ${spotX} ${spotY}, rgba(255, 252, 245, 0.18) 0%, rgba(20, 20, 20, 0.08) 55%, rgba(0, 0, 0, 0.38) 100%)`;

  // Plaster wall reflection spotlight gradient (behind the canvas)
  const wallSpotX = useTransform(smoothX, [-0.5, 0.5], ["42%", "58%"]);
  const wallSpotY = useTransform(smoothY, [-0.5, 0.5], ["25%", "45%"]);
  const wallSpotlightStyle = useMotionTemplate`radial-gradient(circle at ${wallSpotX} ${wallSpotY}, rgba(255, 253, 247, 0.95) 0%, rgba(247, 242, 236, 0.98) 45%, rgba(228, 220, 210, 1) 100%)`;

  // Shadow shift counter to light position (if light is left, shadow is right)
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const shadowStyle = useMotionTemplate`${shadowX}px ${shadowY}px 32px rgba(26, 26, 26, 0.18)`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const fadeRevealVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-[250vh] w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sticky screen container */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Dynamic plaster wall lighting spotlight gradient */}
        <motion.div 
          style={{ background: wallSpotlightStyle }} 
          className="absolute inset-0 z-0 pointer-events-none"
        />
        
        {/* Fine grain overlay for paper/plaster texture depth */}
        <div className="absolute inset-0 bg-transparent grain-overlay opacity-[0.06] z-0 pointer-events-none" />

        {/* Decorative vertical indicators */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-6 z-10 pointer-events-none">
          <span className="text-[9px] tracking-[0.35em] uppercase text-charcoal/30 rotate-90 origin-left translate-x-[3px] font-sans">
            noiseToPoise
          </span>
          <div className="w-[1px] h-32 bg-wine/10 relative">
            <motion.div
              className="absolute top-0 left-0 w-full bg-wine/50"
              animate={{ height: ['0%', '100%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="font-serif text-xs text-wine/60">01</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center z-10 relative">
          
          {/* LEFT COLUMN: Stable Editorial Typography */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 flex flex-col space-y-8 md:space-y-10 lg:pr-8"
          >
            {/* Small Uppercase Quote */}
            <div className="overflow-hidden">
              <motion.p
                variants={fadeRevealVariants}
                className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-charcoal/50 leading-relaxed font-sans max-w-sm"
              >
                &ldquo;Art is not what you see, but what you make others see.&rdquo;
              </motion.p>
            </div>

            {/* Large Serif Typography */}
            <div className="space-y-1">
              <motion.h1
                variants={fadeRevealVariants}
                className="font-serif text-6xl sm:text-7.5xl lg:text-8xl xl:text-[7.5rem] font-light tracking-tight text-charcoal leading-[0.95]"
              >
                DEEPTI
              </motion.h1>
              <motion.h1
                variants={fadeRevealVariants}
                className="font-serif text-6xl sm:text-7.5xl lg:text-8xl xl:text-[7.5rem] font-light tracking-tight text-charcoal leading-[0.95]"
              >
                AROURA
              </motion.h1>
            </div>

            {/* Artist Subtitle */}
            <motion.div
              variants={fadeRevealVariants}
              className="flex items-center space-x-6 pt-2"
            >
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm uppercase tracking-[0.25em] font-sans font-medium text-wine">
                  Artist
                </span>
                <span className="text-[10px] sm:text-xs text-charcoal/50 tracking-wider">
                  Paintings &amp; Fine Art
                </span>
              </div>
              <div className="h-8 w-[1px] bg-wine/15" />
              <div className="font-signature text-3xl sm:text-4xl text-brown/70 leading-none">
                Deepti Aroura
              </div>
            </motion.div>

            {/* Short One-Line Description */}
            <motion.p
              variants={fadeRevealVariants}
              className="text-sm sm:text-base text-charcoal/70 font-sans font-light leading-relaxed max-w-sm"
            >
              Translating the world&apos;s noise into moments of absolute poise.
            </motion.p>

            {/* Primary CTA */}
            <motion.div variants={fadeRevealVariants} className="pt-2">
              <a
                href="#gallery"
                className="inline-flex items-center space-x-4 group text-xs uppercase tracking-[0.25em] font-sans font-semibold text-charcoal border-b border-charcoal/20 pb-3 hover:border-wine hover:text-wine transition-all duration-500 ease-out"
              >
                <span>Explore Collection</span>
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-wine group-hover:translate-x-2 transition-transform duration-300"
                >
                  &mdash;&rarr;
                </motion.span>
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: The Living Gallery Monumental Canvas */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end items-center w-full relative h-[500px] sm:h-[580px] lg:h-[650px]">
            
            {/* Subtle watercolor/ink backdrop strokes blending into the wall */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none flex items-center justify-center opacity-15">
              <div className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-wine/5 via-brown/3 to-transparent blur-3xl" />
              
              <svg viewBox="0 0 400 400" className="absolute w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                {/* curved watercolor sand wash */}
                <path 
                  d="M 80 160 C 150 110, 260 210, 340 160" 
                  fill="none" 
                  stroke="#7B1E1E" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  className="opacity-15"
                />
                <path 
                  d="M 110 300 C 180 340, 280 230, 310 240" 
                  fill="none" 
                  stroke="#6A4A3C" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  className="opacity-20"
                />
                {/* delicate paper fibers */}
                <path d="M 45 95 Q 48 105 46 115" fill="none" stroke="#6A4A3C" strokeWidth="0.4" className="opacity-30" />
                <path d="M 330 340 Q 333 355 331 370" fill="none" stroke="#7B1E1E" strokeWidth="0.4" className="opacity-25" />
              </svg>
            </div>

            {/* Monumental stretched gallery canvas with shadow shifts */}
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[510px] z-10 flex flex-col items-center">
              
              <motion.div
                style={{ y: mainYParallax, boxShadow: shadowStyle }}
                className="relative w-full aspect-[3/4] transition-shadow duration-300 select-none"
              >
                {/* Slow float animation */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full h-full museum-canvas"
                >
                  {/* Stretched side wrap border bevel wrapper */}
                  <div className="absolute inset-0 w-full h-full bg-[#FAF9F6] border-2 border-white/20 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image
                          src={featuredWorks[activeIndex].image}
                          alt={featuredWorks[activeIndex].title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Dynamic Spotlight highlight overlay */}
                  <motion.div
                    style={{ background: spotlightStyle }}
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply opacity-90"
                  />

                  {/* Stretched canvas texture-overlay blend */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04)_0%,_rgba(0,0,0,0.06)_100%)] mix-blend-overlay pointer-events-none z-10" />

                </motion.div>
              </motion.div>

              {/* Refined Museum Label Underneath Stretched Canvas */}
              <div className="h-16 flex items-center justify-center mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="flex flex-col items-center text-center space-y-1"
                  >
                    <span className="font-serif text-base italic text-charcoal/80 font-medium tracking-wide">
                      {featuredWorks[activeIndex].title}
                    </span>
                    <span className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-charcoal/45 font-sans">
                      {featuredWorks[activeIndex].medium} &bull; {featuredWorks[activeIndex].year} &bull; {featuredWorks[activeIndex].dimensions}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
