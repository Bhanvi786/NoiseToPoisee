'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

const artworks = [
  {
    id: 1,
    title: 'Silence in Crimson',
    year: '2025',
    medium: 'Oil on Linen',
    dimensions: '40 × 50 inches',
    image: '/artwork/1.jpeg',
    aspect: 'aspect-[3/4]', // Tall Portrait
    description: 'A study in quiet contemplation and emotional resonance. The heavy crimson red drapery forms a sanctuary around the subject, contrasting with the soft, warm golden light.'
  },
  {
    id: 2,
    title: 'The Courtyard Thread',
    year: '2026',
    medium: 'Oil on Canvas',
    dimensions: '48 × 48 inches',
    image: '/artwork/2.jpeg',
    aspect: 'aspect-[4/3]', // Landscape
    description: 'Capturing the peaceful rhythms of domestic heritage in rural India. The textures of stone and cotton are rendered with intricate palette knife strokes.'
  },
  {
    id: 3,
    title: 'Solitude of Autumn',
    year: '2025',
    medium: 'Oil on Panel',
    dimensions: '36 × 36 inches',
    image: '/artwork/3.jpeg',
    aspect: 'aspect-square', // Square
    description: 'A landscape reflecting internal emotional states. The solitary red-leafed tree stands as a sentinel of patience amidst stormy, atmospheric skies.'
  },
  {
    id: 4,
    title: 'Three Sisters',
    year: '2026',
    medium: 'Oil on Canvas',
    dimensions: '36 × 48 inches',
    image: '/artwork/4.jpeg',
    aspect: 'aspect-[4/3]', // Landscape
    description: 'A beautiful portrayal of sisterhood, drawing inspiration from classical Indian miniatures merged with modern editorial spacing.'
  },
  {
    id: 5,
    title: 'Echoes of Poise',
    year: '2026',
    medium: 'Mixed Media Oil',
    dimensions: '60 × 60 inches',
    image: '/artwork/5.jpeg',
    aspect: 'aspect-[1/2]', // Very Tall Vertical
    description: 'An abstract expression of balance. Rich textures and bold sweeps of wine red intersect with charcoal and ivory, conveying a sense of resolved tension.'
  },
  {
    id: 6,
    title: 'The Lotus Mudra',
    year: '2025',
    medium: 'Oil on Panel',
    dimensions: '30 × 30 inches',
    image: '/artwork/6.jpeg',
    aspect: 'aspect-square', // Square
    description: 'A close study of hand mudras in classical Indian dance. Symbolizing the unfolding of consciousness and poise in the center of mud and water.'
  },
  {
    id: 7,
    title: 'Pillars of Devotion',
    year: '2026',
    medium: 'Oil on Canvas',
    dimensions: '50 × 50 inches',
    image: '/artwork/7.jpeg',
    aspect: 'aspect-[4/5]', // Tall Portrait
    description: 'An architectural exploration of light and shadow in an ancient stone temple. The composition leads the eye through layers of intricate carvings.'
  },
  {
    id: 8,
    title: 'Mother & Daughter',
    year: '2025',
    medium: 'Oil on Canvas',
    dimensions: '40 × 40 inches',
    image: '/artwork/8.jpeg',
    aspect: 'aspect-square', // Square
    description: 'A gentle painting of connection and nurturing guidance, rendered in soft earth tones and burgundy accents.'
  }
];

export default function MasonryGallery() {
  const [selectedArtwork, setSelectedArtwork] = useState<typeof artworks[0] | null>(null);

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <section id="gallery" className="py-24 md:py-36 bg-[#F7F2EC] relative border-t border-wine/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-20 space-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl text-wine font-light">02</span>
            <span className="h-[1px] w-12 bg-wine/20" />
            <span className="text-xs uppercase tracking-[0.25em] text-charcoal/40 font-sans">
              Exhibition
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal tracking-tight">
            Selected Artworks
          </h2>
        </div>

        {/* Masonry Gallery using CSS Columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 lg:gap-12 [column-fill:_balance] w-full">
          {artworks.map((art) => (
            <motion.div
              key={art.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-8% 0px' }}
              variants={itemVariants}
              onClick={() => setSelectedArtwork(art)}
              className="break-inside-avoid mb-8 lg:mb-12 group cursor-pointer"
            >
              {/* Premium Museum-Quality Framing style wrapper */}
              <div className="relative w-full overflow-hidden bg-[#FAF8F5] border border-charcoal/5 shadow-md group-hover:shadow-2xl transition-all duration-700 ease-out">
                {/* Large white margin matting effect */}
                <div className="p-5 md:p-6 lg:p-8">
                  {/* Image container */}
                  <div className={`relative ${art.aspect} w-full overflow-hidden bg-[#EADFD0] border border-charcoal/5`}>
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    />

                    {/* Dark Elegant Hover Overlay */}
                    <div className="absolute inset-0 bg-charcoal/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 z-10">
                      
                      {/* Zoom Indicator */}
                      <div className="absolute top-4 right-4 bg-[#F7F2EC] text-wine p-2.5 rounded-full shadow-lg transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                        <ZoomIn size={16} />
                      </div>

                      {/* Info Text reveal */}
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out text-[#F7F2EC]">
                        <p className="font-serif text-xl font-light">{art.title}</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#F7F2EC]/60 mt-1 font-sans">
                          {art.year} &bull; {art.medium}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox / Art Detail Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-md p-4 sm:p-8 overflow-y-auto"
          >
            {/* Close Area */}
            <div 
              className="absolute inset-0 cursor-zoom-out" 
              onClick={() => setSelectedArtwork(null)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative bg-[#F7F2EC] max-w-5xl w-full rounded-lg overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] border border-wine/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute right-4 top-4 z-20 bg-charcoal text-[#F7F2EC] hover:bg-wine p-2 rounded-full transition-colors duration-300"
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              {/* Left Side: Artwork Image */}
              <div className="md:col-span-7 relative h-[300px] md:h-[85vh] bg-charcoal/95 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={selectedArtwork.image}
                    alt={selectedArtwork.title}
                    fill
                    className="object-contain p-4 sm:p-8"
                    priority
                  />
                </div>
              </div>

              {/* Right Side: Artwork Info */}
              <div className="md:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-8 overflow-y-auto max-h-[60vh] md:max-h-[85vh] bg-[#F7F2EC] paper-texture">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.25em] text-wine font-medium font-sans">
                      Exhibition Piece
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-light text-charcoal leading-tight">
                      {selectedArtwork.title}
                    </h2>
                  </div>

                  <div className="space-y-3 font-sans text-sm">
                    <div className="flex justify-between border-b border-wine/10 pb-2">
                      <span className="text-charcoal/40 uppercase tracking-widest text-[10px]">Year</span>
                      <span className="text-charcoal font-medium">{selectedArtwork.year}</span>
                    </div>
                    <div className="flex justify-between border-b border-wine/10 pb-2">
                      <span className="text-charcoal/40 uppercase tracking-widest text-[10px]">Medium</span>
                      <span className="text-charcoal">{selectedArtwork.medium}</span>
                    </div>
                    <div className="flex justify-between border-b border-wine/10 pb-2">
                      <span className="text-charcoal/40 uppercase tracking-widest text-[10px]">Dimensions</span>
                      <span className="text-charcoal">{selectedArtwork.dimensions}</span>
                    </div>
                  </div>

                  <p className="text-charcoal/70 font-sans text-sm leading-relaxed font-light">
                    {selectedArtwork.description}
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href="#contact"
                    onClick={() => setSelectedArtwork(null)}
                    className="w-full text-center block bg-wine text-[#F7F2EC] hover:bg-charcoal uppercase tracking-[0.2em] text-xs py-4 font-sans font-medium rounded-lg transition-colors duration-300"
                  >
                    Inquire About Acquisition
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
