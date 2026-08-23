'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const featured = [
  {
    id: 1,
    title: 'Silence in Crimson',
    subtitle: 'Masterpiece 01',
    image: '/artwork/1.jpeg',
    year: '2025',
    size: '40 × 50"',
    concept: 'An exploration of stillness. The drapery represents the emotional weight we carry, while the candle light symbolizes the internal spark of awareness.',
    details: [
      '23 layers of hand-mixed oil glaze',
      'Linen canvas stretched on reclaim wood',
      'Acquired by the National Museum of Fine Arts'
    ]
  },
  {
    id: 2,
    title: 'The Courtyard Thread',
    subtitle: 'Masterpiece 02',
    image: '/artwork/2.jpeg',
    year: '2026',
    size: '48 × 48"',
    concept: 'A silent dialogue between generations. The courtyard is rendered as an extension of the inner self, highlighting the thread that binds history and contemporary identity.',
    details: [
      'Natural pigments mixed with linseed oil',
      'Textured using palette knife and organic wool fibers',
      'Private Collection, London'
    ]
  }
];

export default function FeaturedPaintings() {
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section className="py-24 md:py-36 bg-[#F7F2EB] border-t border-wine/5 relative overflow-hidden">
      {/* Decorative vertical lines */}
      <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-wine/5 hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <div className="mb-20 flex items-baseline space-x-2">
          <span className="font-serif text-3xl text-wine font-light">05</span>
          <span className="h-[1px] w-12 bg-wine/20" />
          <span className="text-xs uppercase tracking-[0.25em] text-charcoal/40 font-sans">
            Featured Masterpieces
          </span>
        </div>

        {/* Masterpieces Grid */}
        <div className="space-y-32 md:space-y-48">
          {featured.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={item.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center ${
                  isEven ? '' : 'lg:flex lg:flex-row-reverse'
                }`}
              >
                {/* Image Section */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-10% 0px' }}
                  variants={fadeUp}
                  className={`lg:col-span-7 relative ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}
                >
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl group border border-wine/5 bg-[#EADFD0]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-8">
                      <span className="text-xs uppercase tracking-widest text-white/80 font-sans">
                        {item.size} &bull; {item.year}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Info Section */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-15% 0px' }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.12 } }
                  }}
                  className="lg:col-span-5 space-y-6"
                >
                  <motion.span 
                    variants={fadeUp}
                    className="text-xs uppercase tracking-[0.2em] text-wine font-medium block"
                  >
                    {item.subtitle}
                  </motion.span>

                  <motion.h3 
                    variants={fadeUp}
                    className="font-serif text-4xl sm:text-5xl font-light text-charcoal tracking-tight"
                  >
                    {item.title}
                  </motion.h3>

                  <motion.p 
                    variants={fadeUp}
                    className="text-charcoal/80 font-sans font-light leading-relaxed text-base"
                  >
                    {item.concept}
                  </motion.p>

                  {/* Masterpiece Details Checklist */}
                  <motion.ul 
                    variants={fadeUp}
                    className="space-y-3 pt-4 border-t border-wine/10"
                  >
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center space-x-3 text-xs tracking-wide text-charcoal/60 font-sans font-light">
                        <span className="w-1.5 h-1.5 bg-wine rounded-full" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </motion.ul>

                  <motion.div variants={fadeUp} className="pt-4">
                    <a
                      href="#contact"
                      className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-charcoal hover:text-wine font-sans font-medium transition-colors"
                    >
                      <span>Inquire About Piece</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
