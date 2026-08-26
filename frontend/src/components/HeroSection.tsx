'use client';

import { useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import Image from 'next/image';

const artworks = [
  {
    title: "Silence in Crimson",
    image: "/artwork/1.jpeg",
    year: "2025",
    medium: "OIL ON LINEN",
    size: "40 × 50"
  },
  {
    title: "Solitude of Autumn",
    image: "/artwork/3.jpeg",
    year: "2025",
    medium: "OIL ON PANEL",
    size: "36 × 36"
  },
  {
    title: "Divine Presence",
    image: "/artwork/4.jpeg",
    year: "2024",
    medium: "MIXED MEDIA",
    size: "30 × 40"
  },
  {
    title: "Ethereal Echoes",
    image: "/artwork/5.jpeg",
    year: "2025",
    medium: "OIL ON LINEN",
    size: "40 × 40"
  },
  {
    title: "Crimson Horizon",
    image: "/artwork/6.jpeg",
    year: "2025",
    medium: "OIL ON CANVAS",
    size: "32 × 40"
  },
  {
    title: "The Courtyard Thread",
    image: "/artwork/2.jpeg",
    year: "2026",
    medium: "OIL ON CANVAS",
    size: "48 × 48"
  },
  {
    title: "Sacred Echoes",
    image: "/artwork/7.jpeg",
    year: "2025",
    medium: "OIL ON PANEL",
    size: "24 × 30"
  },
  {
    title: "Infinite Grace",
    image: "/artwork/8.jpeg",
    year: "2024",
    medium: "MIXED MEDIA",
    size: "36 × 48"
  },
  {
    title: "Celestial Balance",
    image: "/artwork/3.jpeg",
    year: "2025",
    medium: "OIL ON CANVAS",
    size: "30 × 30"
  }
];

import { useReducedMotion } from 'framer-motion';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Monitor scroll progress of the Hero section (250vh scroll zone)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Track scroll position to update active index for the metadata underneath
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let nextIndex = 0;
    if (latest < 0.11) {
      nextIndex = 0;
    } else if (latest < 0.22) {
      nextIndex = 1;
    } else if (latest < 0.33) {
      nextIndex = 2;
    } else if (latest < 0.44) {
      nextIndex = 3;
    } else if (latest < 0.55) {
      nextIndex = 4;
    } else if (latest < 0.66) {
      nextIndex = 5;
    } else if (latest < 0.77) {
      nextIndex = 6;
    } else if (latest < 0.88) {
      nextIndex = 7;
    } else {
      nextIndex = 8;
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
    mouseX.set(0);
    mouseY.set(0);
  };

  // Parallax Scroll Y offsets for different depths (tuned for cinematic feel)
  const yTypographyVal = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -80]);
  const yHaloVal = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -60]);

  // Layer 1 Y Offset (Background artworks 5 & 6) - conceptual speed 0.35
  const yBgScroll = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -110]);
  // Layer 2 Y Offset (Secondary artworks 2, 3 & 4) - conceptual speed 0.50
  const ySecondaryScroll = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -160]);
  // Layer 3 Y Offset (Main Ganesha artwork 1) - conceptual speed 0.65
  const yMainScroll = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -220]);
  // Layer 4 Y Offset (Foreground petals) - conceptual speed 1.00
  const yPetalsScroll = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -320]);

  // Separation offsets during scroll (only between 25% and 75% scroll progress)
  const xSeparation2 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, -35, -55, -70]);
  const ySeparation2 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, -20, -35, -45]);

  const xSeparation3 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 35, 55, 70]);
  const ySeparation3 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 20, 35, 45]);

  const xSeparation4 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, -25, -45, -55]);
  const ySeparation4 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 30, 50, 60]);

  const xSeparation5 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 25, 45, 55]);
  const ySeparation5 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, -30, -50, -60]);

  const xSeparation6 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, -15, -25, -35]);
  const ySeparation6 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, -25, -40, -50]);

  // Separation offsets for cardinal positions
  const xSeparation7 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 0, 0, 0]);
  const ySeparation7 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, -25, -45, -55]);

  const xSeparation8 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 0, 0, 0]);
  const ySeparation8 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 25, 45, 55]);

  const xSeparation9 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, -35, -55, -70]);
  const ySeparation9 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 0, 0, 0]);

  const xSeparation10 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 35, 55, 70]);
  const ySeparation10 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 0, 0, 0, 0]);

  // Main Ganesha scales down from 1 to 0.92 between 50% and 75% scroll progress
  const mainScale = useTransform(scrollYProgress, [0, 0.5, 0.75, 1], [1, 1, 0.92, 0.92]);

  // Secondary Artwork 2 scales up slightly to become prominent
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 0.75, 1], [1, 1, 1.05, 1.05]);

  // Mouse Parallax values for different depths
  const mouseBgX = useTransform(smoothX, [-0.5, 0.5], [shouldReduceMotion ? 0 : -3, shouldReduceMotion ? 0 : 3]);
  const mouseBgY = useTransform(smoothY, [-0.5, 0.5], [shouldReduceMotion ? 0 : -3, shouldReduceMotion ? 0 : 3]);

  const mouseSecondaryX = useTransform(smoothX, [-0.5, 0.5], [shouldReduceMotion ? 0 : -6, shouldReduceMotion ? 0 : 6]);
  const mouseSecondaryY = useTransform(smoothY, [-0.5, 0.5], [shouldReduceMotion ? 0 : -6, shouldReduceMotion ? 0 : 6]);

  const mouseMainX = useTransform(smoothX, [-0.5, 0.5], [shouldReduceMotion ? 0 : -9, shouldReduceMotion ? 0 : 9]);
  const mouseMainY = useTransform(smoothY, [-0.5, 0.5], [shouldReduceMotion ? 0 : -9, shouldReduceMotion ? 0 : 9]);

  const mousePetalsX = useTransform(smoothX, [-0.5, 0.5], [shouldReduceMotion ? 0 : -13, shouldReduceMotion ? 0 : 13]);
  const mousePetalsY = useTransform(smoothY, [-0.5, 0.5], [shouldReduceMotion ? 0 : -13, shouldReduceMotion ? 0 : 13]);

  // Combine Scroll Parallax, Separation, and Mouse Parallax
  const yBg5 = useTransform([yBgScroll, ySeparation5, mouseBgY], ([scroll, sep, mouse]) => Number(scroll) + Number(sep) + Number(mouse));
  const xBg5 = useTransform([xSeparation5, mouseBgX], ([sep, mouse]) => Number(sep) + Number(mouse));

  const yBg6 = useTransform([yBgScroll, ySeparation6, mouseBgY], ([scroll, sep, mouse]) => Number(scroll) + Number(sep) + Number(mouse));
  const xBg6 = useTransform([xSeparation6, mouseBgX], ([sep, mouse]) => Number(sep) + Number(mouse));

  const yBg7 = useTransform([yBgScroll, ySeparation7, mouseBgY], ([scroll, sep, mouse]) => Number(scroll) + Number(sep) + Number(mouse));
  const xBg7 = useTransform([xSeparation7, mouseBgX], ([sep, mouse]) => Number(sep) + Number(mouse));

  const yBg8 = useTransform([yBgScroll, ySeparation8, mouseBgY], ([scroll, sep, mouse]) => Number(scroll) + Number(sep) + Number(mouse));
  const xBg8 = useTransform([xSeparation8, mouseBgX], ([sep, mouse]) => Number(sep) + Number(mouse));

  const ySec2 = useTransform([ySecondaryScroll, mouseSecondaryY], ([scroll, mouse]) => Number(scroll) + Number(mouse));
  const xSec2 = mouseSecondaryX;

  const ySec3 = useTransform([ySecondaryScroll, ySeparation3, mouseSecondaryY], ([scroll, sep, mouse]) => Number(scroll) + Number(sep) + Number(mouse));
  const xSec3 = useTransform([xSeparation3, mouseSecondaryX], ([sep, mouse]) => Number(sep) + Number(mouse));

  const ySec4 = useTransform([ySecondaryScroll, ySeparation4, mouseSecondaryY], ([scroll, sep, mouse]) => Number(scroll) + Number(sep) + Number(mouse));
  const xSec4 = useTransform([xSeparation4, mouseSecondaryX], ([sep, mouse]) => Number(sep) + Number(mouse));

  const ySec9 = useTransform([ySecondaryScroll, ySeparation9, mouseSecondaryY], ([scroll, sep, mouse]) => Number(scroll) + Number(sep) + Number(mouse));
  const xSec9 = useTransform([xSeparation9, mouseSecondaryX], ([sep, mouse]) => Number(sep) + Number(mouse));

  const ySec10 = useTransform([ySecondaryScroll, ySeparation10, mouseSecondaryY], ([scroll, sep, mouse]) => Number(scroll) + Number(sep) + Number(mouse));
  const xSec10 = useTransform([xSeparation10, mouseSecondaryX], ([sep, mouse]) => Number(sep) + Number(mouse));

  const yMain = useTransform([yMainScroll, mouseMainY], ([scroll, mouse]) => Number(scroll) + Number(mouse));
  const xMain = mouseMainX;

  const yPetals = useTransform([yPetalsScroll, mousePetalsY], ([scroll, mouse]) => Number(scroll) + Number(mouse));

  const fadeOutScroll = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Spotlight shifts computed based on mouse movements
  const spotX = useTransform(smoothX, [-0.5, 0.5], ["35%", "65%"]);
  const spotY = useTransform(smoothY, [-0.5, 0.5], ["20%", "50%"]);

  // Highlight overlay gradient (shining on the canvas surface)
  const spotlightStyle = useMotionTemplate`radial-gradient(circle at ${spotX} ${spotY}, rgba(255, 252, 245, 0.18) 0%, rgba(20, 20, 20, 0.08) 55%, rgba(0, 0, 0, 0.38) 100%)`;

  // Plaster wall reflection spotlight gradient (behind the canvas)
  const wallSpotX = useTransform(smoothX, [-0.5, 0.5], ["42%", "58%"]);
  const wallSpotY = useTransform(smoothY, [-0.5, 0.5], ["25%", "45%"]);
  const wallSpotlightStyle = useMotionTemplate`radial-gradient(circle at ${wallSpotX} ${wallSpotY}, rgba(255, 253, 247, 0.95) 0%, rgba(247, 242, 236, 0.98) 45%, rgba(228, 220, 210, 1) 100%)`;

  // Shadow shift counter to light position
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

  // Entrance variants for right-side elements
  const haloVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, ease: "easeOut" as const }
    }
  };

  const typographyVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 0.07,
      y: 0,
      transition: { delay: 0.2, duration: 1.5, ease: "easeOut" as const }
    }
  };

  const mainArtworkVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const petalVariants = {
    hidden: { opacity: 0, scale: 0.6, y: -15 },
    visible: {
      opacity: 0.85,
      scale: 1,
      y: 0,
      transition: { delay: 1.1, duration: 1.2, ease: "easeOut" as const }
    }
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

        {/* Corner Paint Stroke Overlay Accents (Maroon & Warm tones) */}
        <motion.div style={{ opacity: fadeOutScroll }} className="absolute inset-0 pointer-events-none z-20">
          {/* Top-Left Corner Paint Stroke */}
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-36 sm:w-56 md:w-72 h-auto opacity-70">
            <path d="M0 0 C 40 10, 80 5, 110 30 C 140 55, 120 120, 160 160 C 140 150, 100 130, 80 90 C 60 50, 20 40, 0 40 Z" fill="#5A121F" opacity="0.65" />
            <path d="M0 0 C 30 20, 60 30, 80 60 C 100 90, 95 130, 120 150 C 100 135, 75 110, 60 80 C 45 50, 15 30, 0 25 Z" fill="#8F1D32" opacity="0.8" />
            <path d="M0 0 C 20 15, 45 25, 55 45 C 65 65, 70 95, 90 110 C 80 100, 60 80, 50 60 C 40 40, 10 20, 0 15 Z" fill="#A64B2A" opacity="0.75" />
            <path d="M5 0 C 15 10, 30 15, 38 30 C 46 45, 50 70, 65 80 C 58 75, 45 60, 38 45 C 30 30, 10 15, 5 10 Z" fill="#D49B41" opacity="0.5" />
            <circle cx="95" cy="40" r="1.5" fill="#8F1D32" opacity="0.6" />
            <circle cx="130" cy="85" r="1" fill="#A64B2A" opacity="0.5" />
            <circle cx="50" cy="115" r="2" fill="#5A121F" opacity="0.7" />
          </svg>

          {/* Bottom-Left Corner Paint Stroke */}
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 w-36 sm:w-56 md:w-72 h-auto opacity-70">
            <path d="M0 200 C 40 190, 80 195, 110 170 C 140 145, 120 80, 160 40 C 140 50, 100 70, 80 110 C 60 150, 20 160, 0 160 Z" fill="#8F1D32" opacity="0.75" />
            <path d="M0 200 C 30 180, 60 170, 80 140 C 100 110, 95 70, 120 50 C 100 65, 75 90, 60 120 C 45 150, 15 170, 0 175 Z" fill="#5A121F" opacity="0.7" />
            <path d="M0 200 C 20 185, 45 175, 55 155 C 65 135, 70 105, 90 90 C 80 100, 60 120, 50 140 C 40 160, 10 180, 0 185 Z" fill="#A64B2A" opacity="0.8" />
            <circle cx="95" cy="160" r="1.5" fill="#8F1D32" opacity="0.6" />
            <circle cx="130" cy="115" r="1" fill="#D49B41" opacity="0.5" />
          </svg>
        </motion.div>

        {/* TOP-LEFT: Near the noiseToPoise logo, add a very small hand-painted abstract brushstroke/artist mark */}
        <div className="absolute top-6 sm:top-8 left-0 right-0 z-40 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative">
            <motion.div
              style={{ opacity: fadeOutScroll }}
              className="absolute left-[175px] sm:left-[190px] top-[4px]"
            >
              <svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-85">
                <path d="M2 10C6 7.5 11.5 4.5 17 5C19.8 5.2 22 6.2 23.2 7.8C20.8 7 17.2 6.6 12.8 7C8.4 7.4 5.2 9.4 3.2 11C2.5 11.6 1.6 10.6 2 10Z" fill="#8F1D32" />
                <circle cx="21" cy="9.5" r="0.7" fill="#8F1D32" />
                <circle cx="23.5" cy="11" r="0.4" fill="#8F1D32" />
              </svg>
            </motion.div>
          </div>
        </div>

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

          {/* RIGHT COLUMN: The Living Gallery Parallax Stack */}
          <div className="lg:col-span-7 flex justify-center items-center w-full relative h-[85vh] select-none">

            {/* 1. Soft Terracotta Halo */}
            <motion.div
              variants={haloVariants}
              initial="hidden"
              animate="visible"
              style={{ y: yHaloVal }}
              className="absolute w-[440px] h-[440px] sm:w-[580px] sm:h-[580px] rounded-full bg-wine/8 blur-[100px] pointer-events-none z-0 left-[35%] top-[25%]"
            />

            {/* 2. Huge Background Typography */}
            <motion.div
              variants={typographyVariants}
              initial="hidden"
              animate="visible"
              style={{ y: yTypographyVal }}
              className="absolute font-serif text-[7.5rem] sm:text-[11rem] lg:text-[14rem] font-bold text-wine/8 select-none pointer-events-none tracking-widest text-center z-0 left-[20%] top-[30%]"
            >
              GANESHA
            </motion.div>

            {/* Main stack container spanning large viewport coordinates */}
            <div className="relative w-full h-full flex justify-center items-center translate-x-[120px] translate-y-8">

              {/* STACK LAYERS */}
              <div className="absolute inset-0 w-full h-full">
                {/* Layer 1 - Background Artwork 6 (Subtle Background, e.g. /artwork/6.jpeg) */}
                <motion.div
                  style={{ y: yBg6, x: xBg6 }}
                  className="absolute w-[19.2%] sm:w-[20.8%] lg:w-[22.4%] aspect-[3/4] left-[16.4%] top-[11.6%] z-10 select-none pointer-events-none opacity-90"
                >
                  {/* Entrance slide-out from behind Ganesha */}
                  <motion.div
                    initial={{ x: 260, y: 150, scale: 0.5, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
                    className="w-full h-full"
                  >
                    {/* Hula/Floating motion */}
                    <motion.div
                      animate={{ x: [4, -4, 4], y: [-8, 8, -8], rotate: [0.6, -0.6, 0.6] }}
                      transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full museum-canvas overflow-hidden"
                    >
                      <Image
                        src={artworks[4].image}
                        alt={artworks[4].title}
                        fill
                        className="object-cover opacity-100 filter brightness-95"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Layer 1 - Background Artwork 7 (Top Center Gap) */}
                <motion.div
                  style={{ y: yBg7, x: xBg7 }}
                  className="absolute w-[17.6%] sm:w-[19.2%] lg:w-[20.8%] aspect-[3/4] left-[38.8%] top-[2%] z-12 select-none pointer-events-none opacity-90"
                >
                  {/* Entrance slide-out from behind Ganesha */}
                  <motion.div
                    initial={{ x: 0, y: 200, scale: 0.5, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
                    className="w-full h-full"
                  >
                    {/* Hula/Floating motion */}
                    <motion.div
                      animate={{ x: [-4, 4, -4], y: [6, -6, 6], rotate: [-0.4, 0.4, -0.4] }}
                      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full museum-canvas overflow-hidden"
                    >
                      <Image
                        src={artworks[6].image}
                        alt={artworks[6].title}
                        fill
                        className="object-cover opacity-100 filter brightness-95"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Layer 1 - Background Artwork 5 (Further Behind, e.g. /artwork/5.jpeg) */}
                <motion.div
                  style={{ y: yBg5, x: xBg5 }}
                  className="absolute w-[22.4%] sm:w-[24%] lg:w-[25.6%] aspect-[3/4] right-[13.2%] top-[13.2%] z-15 select-none pointer-events-none opacity-95"
                >
                  {/* Entrance slide-out from behind Ganesha */}
                  <motion.div
                    initial={{ x: -280, y: 140, scale: 0.5, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
                    className="w-full h-full"
                  >
                    {/* Hula/Floating motion */}
                    <motion.div
                      animate={{ x: [-6, 6, -6], y: [8, -8, 8], rotate: [-0.5, 0.5, -0.5] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full museum-canvas overflow-hidden"
                    >
                      <Image
                        src={artworks[3].image}
                        alt={artworks[3].title}
                        fill
                        className="object-cover opacity-100 filter brightness-95"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Layer 1 - Background Artwork 8 (Bottom Center Gap) */}
                <motion.div
                  style={{ y: yBg8, x: xBg8 }}
                  className="absolute w-[19.2%] sm:w-[20.8%] lg:w-[22.4%] aspect-[3/4] left-[35.6%] bottom-[11.6%] z-18 select-none pointer-events-none opacity-95"
                >
                  {/* Entrance slide-out from behind Ganesha */}
                  <motion.div
                    initial={{ x: 0, y: -200, scale: 0.5, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
                    className="w-full h-full"
                  >
                    {/* Hula/Floating motion */}
                    <motion.div
                      animate={{ x: [5, -5, 5], y: [-6, 6, -6], rotate: [0.5, -0.5, 0.5] }}
                      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full museum-canvas overflow-hidden"
                    >
                      <Image
                        src={artworks[7].image}
                        alt={artworks[7].title}
                        fill
                        className="object-cover opacity-100 filter brightness-95"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Layer 2 - Secondary Artwork 4 (Partially Visible, e.g. /artwork/4.jpeg) */}
                <motion.div
                  style={{ y: ySec4, x: xSec4 }}
                  className="absolute w-[24%] sm:w-[25.6%] lg:w-[27.2%] aspect-[3/4] left-[13.2%] bottom-[18%] z-20 select-none pointer-events-none opacity-100"
                >
                  {/* Entrance slide-out from behind Ganesha */}
                  <motion.div
                    initial={{ x: 240, y: -200, scale: 0.5, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
                    className="w-full h-full"
                  >
                    {/* Hula/Floating motion */}
                    <motion.div
                      animate={{ x: [8, -8, 8], y: [10, -10, 10], rotate: [1.2, -1.2, 1.2] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full museum-canvas overflow-hidden"
                    >
                      <Image
                        src={artworks[2].image}
                        alt={artworks[2].title}
                        fill
                        className="object-cover opacity-100 filter brightness-95"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Layer 2 - Secondary Artwork 9 (Left Center Gap) */}
                <motion.div
                  style={{ y: ySec9, x: xSec9 }}
                  className="absolute w-[20.8%] sm:w-[22.4%] lg:w-[24%] aspect-[3/4] left-[2%] top-[29.2%] z-22 select-none pointer-events-none opacity-100"
                >
                  {/* Entrance slide-out from behind Ganesha */}
                  <motion.div
                    initial={{ x: 260, y: 0, scale: 0.5, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
                    className="w-full h-full"
                  >
                    {/* Hula/Floating motion */}
                    <motion.div
                      animate={{ x: [-8, 8, -8], y: [4, -4, 4], rotate: [-0.6, 0.6, -0.6] }}
                      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full museum-canvas overflow-hidden"
                    >
                      <Image
                        src={artworks[5].image}
                        alt={artworks[5].title}
                        fill
                        className="object-cover filter brightness-95"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Layer 2 - Secondary Artwork 3 (Slightly Right and Lower, e.g. /artwork/3.jpeg) */}
                <motion.div
                  style={{ y: ySec3, x: xSec3 }}
                  className="absolute w-[26.4%] sm:w-[28%] lg:w-[29.6%] aspect-[3/4] right-[11.6%] bottom-[14.8%] z-25 select-none pointer-events-none opacity-100"
                >
                  {/* Entrance slide-out from behind Ganesha */}
                  <motion.div
                    initial={{ x: -260, y: -220, scale: 0.5, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
                    className="w-full h-full"
                  >
                    {/* Hula/Floating motion */}
                    <motion.div
                      animate={{ x: [-10, 10, -10], y: [-6, 6, -6], rotate: [-0.8, 0.8, -0.8] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full museum-canvas overflow-hidden"
                    >
                      <Image
                        src={artworks[1].image}
                        alt={artworks[1].title}
                        fill
                        className="object-cover filter brightness-95"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Layer 2 - Secondary Artwork 10 (Right Center Gap) */}
                <motion.div
                  style={{ y: ySec10, x: xSec10 }}
                  className="absolute w-[22.4%] sm:w-[24%] lg:w-[25.6%] aspect-[3/4] right-[-2%] top-[27.6%] z-28 select-none pointer-events-none opacity-100"
                >
                  {/* Entrance slide-out from behind Ganesha */}
                  <motion.div
                    initial={{ x: -280, y: 0, scale: 0.5, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 4.5, ease: [0.1, 0.8, 0.2, 1] }}
                    className="w-full h-full"
                  >
                    {/* Hula/Floating motion */}
                    <motion.div
                      animate={{ x: [6, -6, 6], y: [-8, 8, -8], rotate: [0.7, -0.7, 0.7] }}
                      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full museum-canvas overflow-hidden"
                    >
                      <Image
                        src={artworks[8].image}
                        alt={artworks[8].title}
                        fill
                        className="object-cover filter brightness-95"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Layer 3 - Main Ganesha Artwork (Front focus) */}
                <motion.div
                  variants={mainArtworkVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ y: yMain, x: xMain, scale: mainScale, boxShadow: shadowStyle }}
                  className="absolute w-[35.2%] sm:w-[36.8%] lg:w-[38.4%] aspect-[3/4] z-40 left-[30.8%] top-[22.8%] transition-shadow duration-300 select-none"
                >
                  {/* Organic float motion */}
                  <motion.div
                    animate={{ x: [-8, 8, -8], rotate: [-0.5, 0.5, -0.5] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-full museum-canvas"
                  >
                    {/* Frame wrapper */}
                    <div className="absolute inset-0 w-full h-full bg-[#FAF9F6] border-2 border-white/20 overflow-hidden">
                      <Image
                        src={artworks[0].image}
                        alt={artworks[0].title}
                        fill
                        className="object-cover"
                        priority
                      />
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



                {/* Layer 4 - Subtle Floating Petals */}
                <motion.div
                  variants={petalVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ y: yPetals, x: mousePetalsX }}
                  className="absolute inset-0 pointer-events-none z-50"
                >
                  {/* Petal 1 */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [12, 18, 12] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-[15%] top-[15%] w-[18px] h-[30px]"
                  >
                    <svg viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-40">
                      <path d="M10 0 C18 6, 20 22, 10 30 C0 22, 2 6, 10 0" fill="#7B1E1E" />
                    </svg>
                  </motion.div>

                  {/* Petal 2 */}
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [-15, -10, -15] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute right-[12%] top-[30%] w-[15px] h-[25px]"
                  >
                    <svg viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-35">
                      <path d="M10 0 C18 6, 20 22, 10 30 C0 22, 2 6, 10 0" fill="#6A4A3C" />
                    </svg>
                  </motion.div>

                  {/* Petal 3 */}
                  <motion.div
                    animate={{ y: [0, -12, 0], rotate: [5, -5, 5] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute left-[22%] bottom-[20%] w-[16px] h-[28px]"
                  >
                    <svg viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-30">
                      <path d="M10 0 C18 6, 20 22, 10 30 C0 22, 2 6, 10 0" fill="#7B1E1E" />
                    </svg>
                  </motion.div>

                  {/* Petal 4 */}
                  <motion.div
                    animate={{ y: [0, -9, 0], rotate: [-30, -24, -30] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute right-[20%] bottom-[28%] w-[14px] h-[24px]"
                  >
                    <svg viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-45">
                      <path d="M10 0 C18 6, 20 22, 10 30 C0 22, 2 6, 10 0" fill="#7B1E1E" />
                    </svg>
                  </motion.div>
                </motion.div>

              </div>

            </div>

          </div>

        </div>

        {/* Scroll indicator fades as scroll begins */}
        <motion.div
          style={{ opacity: fadeOutScroll }}
          className="absolute bottom-8 left-6 md:left-12 flex items-center space-x-4 text-[10px] tracking-[0.3em] uppercase text-charcoal/50 font-sans select-none pointer-events-none z-40"
        >
          {/* Artist Stamp */}
          <div className="flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-95">
              {/* Outer rough circle */}
              <path d="M12 2.2C15.1 2.1 18.2 3.2 20.3 5.4C22.4 7.6 23.1 11.0 22.4 14.3C21.7 17.6 19.5 20.5 16.5 22.0C13.5 23.5 9.8 23.2 6.8 21.4C3.8 19.6 2.0 16.2 1.8 12.5C1.6 8.8 3.0 5.2 5.7 3.0C7.5 1.6 9.7 2.0 12 2.2ZM12.3 3.8C10.4 3.7 8.5 4.2 7.0 5.3C4.9 6.9 3.7 9.6 3.9 12.5C4.1 15.4 5.7 18.1 8.1 19.5C10.5 20.9 13.5 21.0 15.9 19.8C18.3 18.6 19.9 16.1 20.4 13.4C20.9 10.7 20.3 7.9 18.5 6.0C16.9 4.3 14.6 4.0 12.3 3.8Z" fill="#8F1D32" />
              {/* Paint splatters/dots */}
              <circle cx="21" cy="6" r="0.7" fill="#8F1D32" />
              <circle cx="4" cy="18" r="0.5" fill="#8F1D32" />
              {/* Imperfect 'N' monogram */}
              <path d="M9 16V8H10.5L14.3 13.8V8H15.5V16H14L10.2 10.2V16H9Z" fill="#8F1D32" />
            </svg>
          </div>
          <div className="flex items-center space-x-2">
            <span>Scroll to Explore</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
