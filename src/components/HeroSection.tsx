'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth springs for cursor parallax
  const springConfig = { stiffness: 60, damping: 25, mass: 0.5 };
  const parallaxX = useSpring(useMotionValue(0), springConfig);
  const parallaxY = useSpring(useMotionValue(0), springConfig);

  const p1X = useTransform(parallaxX, [-0.5, 0.5], [-8, 8]);
  const p1Y = useTransform(parallaxY, [-0.5, 0.5], [-8, 8]);

  const p2X = useTransform(parallaxX, [-0.5, 0.5], [6, -6]);
  const p2Y = useTransform(parallaxY, [-0.5, 0.5], [6, -6]);

  const p3X = useTransform(parallaxX, [-0.5, 0.5], [-12, 12]);
  const p3Y = useTransform(parallaxY, [-0.5, 0.5], [-12, 12]);

  const p4X = useTransform(parallaxX, [-0.5, 0.5], [5, -5]);
  const p4Y = useTransform(parallaxY, [-0.5, 0.5], [5, -5]);

  const p5X = useTransform(parallaxX, [-0.5, 0.5], [-7, 7]);
  const p5Y = useTransform(parallaxY, [-0.5, 0.5], [-7, 7]);

  const p6X = useTransform(parallaxX, [-0.5, 0.5], [6, -6]);
  const p6Y = useTransform(parallaxY, [-0.5, 0.5], [6, -6]);

  const p7X = useTransform(parallaxX, [-0.5, 0.5], [12, -12]);
  const p7Y = useTransform(parallaxY, [-0.5, 0.5], [12, -12]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      // Get mouse coords normalized between -0.5 and 0.5
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;

      parallaxX.set(x);
      parallaxY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [parallaxX, parallaxY]);

  // Framer Motion animation definitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const textRevealVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const collageItemVariants = (index: number) => ({
    hidden: { opacity: 0, y: 80, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: 0.4 + index * 0.15,
      },
    },
  });

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center pt-28 pb-16 overflow-x-hidden"
    >
      {/* Integrated Editorial Background Canvas */}
      <div className="absolute top-0 left-0 w-full h-screen z-0 pointer-events-none">
        <Image
          src="/artwork/hero_background.jpg"
          alt=""
          fill
          className="object-cover object-bottom"
          priority
        />
      </div>
      {/* Decorative vertical indicators */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal/40 rotate-90 origin-left translate-x-[3px] mb-8">
          noiseToPoise
        </span>
        <div className="w-[1px] h-24 bg-wine/20 relative">
          <motion.div
            className="absolute top-0 left-0 w-full bg-wine"
            animate={{ height: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="font-serif text-xs text-wine">01</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">

        {/* Left Side: Editorial Typography */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-5 flex flex-col justify-center space-y-8"
        >
          {/* Quote */}
          <div className="overflow-hidden">
            <motion.p
              variants={textRevealVariants}
              className="text-xs uppercase tracking-[0.25em] text-charcoal/60 leading-relaxed max-w-xs font-sans"
            >
              &ldquo;art is not what you see, but what you make others see.&rdquo;
            </motion.p>
          </div>

          {/* Huge Artist Name */}
          <div className="space-y-1">
            <motion.h1
              variants={textRevealVariants}
              className="font-serif text-6xl sm:text-7.5xl lg:text-[7.5rem] xl:text-[8rem] font-light tracking-tight text-charcoal leading-[0.9]"
            >
              DEEPTI
            </motion.h1>
            <motion.h1
              variants={textRevealVariants}
              className="font-serif text-6xl sm:text-7.5xl lg:text-[7.5rem] xl:text-[8rem] font-light tracking-tight text-charcoal leading-[0.9]"
            >
              AROURA
            </motion.h1>
          </div>

          {/* Subtitle & Signature */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-2">
            <motion.div variants={textRevealVariants} className="flex flex-col">
              <span className="text-sm uppercase tracking-[0.2em] font-sans font-medium text-wine">
                Artist
              </span>
              <span className="text-xs text-charcoal/40 tracking-wider">
                Paintings &amp; Art
              </span>
            </motion.div>

            <motion.div
              variants={textRevealVariants}
              className="font-signature text-4xl text-brown pl-2 border-l border-wine/10 sm:border-l sm:pl-8 py-1"
            >
              Deepti Aroura
            </motion.div>
          </div>

          {/* Call to Action Button */}
          <motion.div variants={textRevealVariants} className="pt-4">
            <a
              href="#collections"
              className="inline-flex items-center space-x-4 group text-xs uppercase tracking-[0.2em] font-sans font-medium text-white border-b border-white/30 pb-2 hover:border-white transition-all duration-300"
            >
              <span>Explore Collection</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-white group-hover:translate-x-2 transition-transform duration-300"
              >
                &mdash;&rarr;
              </motion.span>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: Layered Art Collage */}
        <div className="lg:col-span-7 relative h-[500px] sm:h-[600px] lg:h-[800px] w-full z-10">

          {/* Large Wine-Red Semicircle Background */}
          <div className="absolute right-0 top-[18%] w-[180px] sm:w-[280px] lg:w-[320px] h-[360px] sm:h-[560px] lg:h-[640px] bg-wine/20 rounded-l-full blur-[1px] pointer-events-none z-0" />

          {/* Dotted decorative grid (top-right) */}
          <div className="absolute top-[8%] right-[2%] grid grid-cols-5 gap-2 pointer-events-none z-0 opacity-20">
            {[...Array(25)].map((_, i) => (
              <div key={i} className="w-[3px] h-[3px] bg-charcoal rounded-full" />
            ))}
          </div>

          {/* Dotted decorative grid (bottom-right) */}
          <div className="absolute bottom-[20%] right-[4%] grid grid-cols-5 gap-2 pointer-events-none z-0 opacity-20">
            {[...Array(25)].map((_, i) => (
              <div key={i} className="w-[3px] h-[3px] bg-charcoal rounded-full" />
            ))}
          </div>

          {/* Painting 1: Woman in Red Saree (Vertical, Top-Left) */}
          <motion.div
            variants={collageItemVariants(0)}
            initial="hidden"
            animate="visible"
            className="absolute top-[-4%] left-[26%] w-[27%] aspect-[3/4] z-30 border border-white/10 rotate-[-1deg]"
            style={{
              x: p1X,
              y: p1Y,
            }}
          >
            <div className="relative w-full h-full hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-400 ease-out hover:shadow-2xl shadow-xl rounded-lg overflow-hidden">
              <Image
                src="/artwork/woman_red.png"
                alt="Woman in Red Saree"
                fill
                sizes="(max-width: 1024px) 30vw, 20vw"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Painting 2: Three Women Sitting (Horizontal, Top-Right) */}
          <motion.div
            variants={collageItemVariants(1)}
            initial="hidden"
            animate="visible"
            className="absolute top-[10%] left-[48%] w-[35%] aspect-[4/3] z-40 border border-white/10 rotate-[1deg]"
            style={{
              x: p2X,
              y: p2Y,
            }}
          >
            <div className="relative w-full h-full hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-400 ease-out hover:shadow-2xl shadow-xl rounded-lg overflow-hidden">
              <Image
                src="/artwork/three_women.png"
                alt="Three Indian Women Sitting"
                fill
                sizes="(max-width: 1024px) 35vw, 22vw"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Painting 3: Autumn Red-Leafed Tree (Square, Center-Left) */}
          <motion.div
            variants={collageItemVariants(2)}
            initial="hidden"
            animate="visible"
            className="absolute top-[32%] left-[12%] w-[28%] aspect-square z-20 border border-white/10 rotate-[0.5deg]"
            style={{
              x: p3X,
              y: p3Y,
            }}
          >
            <div className="relative w-full h-full hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-400 ease-out hover:shadow-2xl shadow-xl rounded-lg overflow-hidden">
              <Image
                src="/artwork/red_tree.png"
                alt="Red Leafed Tree Landscape"
                fill
                sizes="(max-width: 1024px) 30vw, 18vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Painting 4: Mother & Daughter (Square, Center-Right) */}
          <motion.div
            variants={collageItemVariants(3)}
            initial="hidden"
            animate="visible"
            className="absolute top-[32%] left-[38%] w-[28%] aspect-square z-20 border border-white/10 rotate-[-1.5deg]"
            style={{
              x: p4X,
              y: p4Y,
            }}
          >
            <div className="relative w-full h-full hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-400 ease-out hover:shadow-2xl shadow-xl rounded-lg overflow-hidden">
              <Image
                src="/artwork/mother_daughter.png"
                alt="Mother and Daughter"
                fill
                sizes="(max-width: 1024px) 30vw, 18vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Painting 5: Two Women Courtyard (Horizontal, Bottom-Left) */}
          <motion.div
            variants={collageItemVariants(4)}
            initial="hidden"
            animate="visible"
            className="absolute top-[56%] left-[4%] w-[34%] aspect-[4/3] z-30 border border-white/10 rotate-[1.2deg]"
            style={{
              x: p5X,
              y: p5Y,
            }}
          >
            <div className="relative w-full h-full hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-400 ease-out hover:shadow-2xl shadow-xl rounded-lg overflow-hidden">
              <Image
                src="/artwork/two_women.png"
                alt="Two Indian Women in Courtyard"
                fill
                sizes="(max-width: 1024px) 35vw, 24vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Painting 6: Lotus Mudra (Square, Bottom-Right) */}
          <motion.div
            variants={collageItemVariants(5)}
            initial="hidden"
            animate="visible"
            className="absolute top-[56%] left-[36%] w-[28%] aspect-square z-30 border border-white/10 rotate-[-0.8deg]"
            style={{
              x: p6X,
              y: p6Y,
            }}
          >
            <div className="relative w-full h-full hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-400 ease-out hover:shadow-2xl shadow-xl rounded-lg overflow-hidden">
              <Image
                src="/artwork/mudra.png"
                alt="Lotus Mudra Hands Painting"
                fill
                sizes="(max-width: 1024px) 30vw, 18vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Painting 7: Abstract Red Vertical (Vertical, Far-Right) */}
          <motion.div
            variants={collageItemVariants(6)}
            initial="hidden"
            animate="visible"
            className="absolute top-[40%] left-[60%] w-[16%] aspect-[1/2] z-35 border border-white/10 rotate-[1.5deg]"
            style={{
              x: p7X,
              y: p7Y,
            }}
          >
            <div className="relative w-full h-full hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-400 ease-out hover:shadow-2xl shadow-xl rounded-lg overflow-hidden">
              <Image
                src="/artwork/abstract_red.png"
                alt="Vertical Abstract Painting"
                fill
                sizes="(max-width: 1024px) 20vw, 10vw"
                className="object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
