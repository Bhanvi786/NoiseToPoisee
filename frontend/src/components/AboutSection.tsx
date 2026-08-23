'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const imageRevealVariants = {
    hidden: { scale: 1.05, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="about" className="py-24 md:py-36 bg-[#F7F2EB] border-t border-wine/5 relative overflow-hidden">
      {/* Subtle background circles for depth */}
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-brown/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[25vw] h-[25vw] rounded-full bg-wine/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Image Collage & Index */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={fadeUpVariants}
            className="lg:col-span-5 relative"
          >
            {/* Index Number */}
            <div className="flex items-baseline space-x-2 mb-6">
              <span className="font-serif text-3xl text-wine font-light">03</span>
              <span className="h-[1px] w-12 bg-wine/20" />
              <span className="text-xs uppercase tracking-[0.25em] text-charcoal/40 font-sans">
                The Profile
              </span>
            </div>

            {/* Artist Photo Frame */}
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-charcoal/5 group bg-[#EADFD0]">
              <motion.div 
                variants={imageRevealVariants}
                className="w-full h-full relative"
              >
                <Image
                  src="/artwork/8.jpeg"
                  alt="Deepti Aroura in studio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                />
              </motion.div>
            </div>

            {/* Caption / Artwork Note */}
            <p className="mt-4 text-xs text-charcoal/50 italic font-sans flex justify-between">
              <span>Studio portrait, 2026.</span>
              <span>Photographed by A. K.</span>
            </p>
          </motion.div>

          {/* Right Column: Biography & Philosophy */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="lg:col-span-7 space-y-8 lg:pt-12"
          >
            <motion.div variants={fadeUpVariants} className="space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-wine font-medium font-sans">
                Philosophy
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal leading-tight">
                Translating the world&apos;s noise into moments of absolute poise.
              </h2>
            </motion.div>

            {/* Editorial Bio Text with Dropcap */}
            <motion.div variants={fadeUpVariants} className="space-y-6 text-charcoal/80 font-sans leading-relaxed text-base md:text-lg font-light">
              <p>
                <span className="font-serif text-6xl float-left mr-3 mt-1 text-wine font-light leading-[0.8] select-none">
                  F
                </span>
                or over a decade, Deepti Aroura has been exploring the subtle tensions between stillness and chaos. Her practice is rooted in the belief that art is a sanctuary—a translation of modern sensory overload into canvas-bound equilibrium. Through layered oil pigments, rich organic textures, and bold strokes of deep wine red, she creates a physical space for silence.
              </p>
              <p>
                Her creative journey is heavily inspired by classical Indian aesthetic traditions combined with contemporary minimalist design. Each canvas is a dialogue between light, structure, and emotional weight, built slowly over months of contemplation and paint application in her sun-drenched studio.
              </p>
            </motion.div>

            {/* Pull Quote */}
            <motion.blockquote 
              variants={fadeUpVariants} 
              className="border-l-2 border-wine pl-6 py-2 my-8 italic"
            >
              <p className="font-serif text-xl sm:text-2xl text-charcoal/90 leading-relaxed font-light">
                &ldquo;Stillness is not the absence of sound, but the presence of focus. My canvas is where noise finds its poise.&rdquo;
              </p>
            </motion.blockquote>

            {/* Artist Details Grid */}
            <motion.div variants={fadeUpVariants} className="grid grid-cols-2 gap-8 pt-6 border-t border-wine/10">
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-wine mb-2">
                  Solo Exhibitions
                </h4>
                <p className="text-sm text-charcoal/70 leading-relaxed font-sans font-light">
                  Mumbai, Delhi, London, Paris, New York
                </p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-wine mb-2">
                  Focus Areas
                </h4>
                <p className="text-sm text-charcoal/70 leading-relaxed font-sans font-light">
                  Classical Realism, Contemporary Textures, Oil on Canvas
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
