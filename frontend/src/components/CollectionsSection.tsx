'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn, Info } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Works' },
  { id: 'silence', name: 'The Silence Series' },
  { id: 'traditions', name: 'Classical Echoes' },
  { id: 'horizons', name: 'Textured Horizons' },
];

const artworks = [
  {
    id: 1,
    title: 'Silence in Crimson',
    category: 'silence',
    year: '2025',
    medium: 'Oil on Linen',
    dimensions: '40 × 50 inches',
    image: '/artwork/1.jpeg',
    description: 'A study in quiet contemplation and emotional resonance. The heavy crimson red drapery forms a sanctuary around the subject, contrasting with the soft, warm golden light.',
  },
  {
    id: 2,
    title: 'The Courtyard Thread',
    category: 'traditions',
    year: '2026',
    medium: 'Oil on Canvas',
    dimensions: '48 × 48 inches',
    image: '/artwork/2.jpeg',
    description: 'Capturing the peaceful rhythms of domestic heritage in rural India. The textures of stone and cotton are rendered with intricate palette knife strokes.',
  },
  {
    id: 3,
    title: 'Solitude of Autumn',
    category: 'horizons',
    year: '2025',
    medium: 'Oil on Panel',
    dimensions: '36 × 36 inches',
    image: '/artwork/3.jpeg',
    description: 'A landscape reflecting internal emotional states. The solitary red-leafed tree stands as a sentinel of patience amidst stormy, atmospheric skies.',
  },
  {
    id: 4,
    title: 'Echoes of Poise',
    category: 'silence',
    year: '2026',
    medium: 'Mixed Media Oil',
    dimensions: '60 × 60 inches',
    image: '/artwork/4.jpeg',
    description: 'An abstract expression of balance. Rich textures and bold sweeps of wine red intersect with charcoal and ivory, conveying a sense of resolved tension.',
  },
  {
    id: 5,
    title: 'The Lotus Mudra',
    category: 'traditions',
    year: '2025',
    medium: 'Oil on Panel',
    dimensions: '30 × 30 inches',
    image: '/artwork/5.jpeg',
    description: 'A close study of hand mudras in classical Indian dance. Symbolizing the unfolding of consciousness and poise in the center of mud and water.',
  },
  {
    id: 6,
    title: 'Pillars of Devotion',
    category: 'horizons',
    year: '2026',
    medium: 'Oil on Canvas',
    dimensions: '50 × 50 inches',
    image: '/artwork/6.jpeg',
    description: 'An architectural exploration of light and shadow in an ancient stone temple. The composition leads the eye through layers of intricate carvings toward a distant figure.',
  },
];

export default function CollectionsSection() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState<typeof artworks[0] | null>(null);

  const filteredArtworks = selectedFilter === 'all' 
    ? artworks 
    : artworks.filter(art => art.category === selectedFilter);

  return (
    <section id="collections" className="py-24 md:py-36 bg-[#F7F2EB] border-t border-wine/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div className="space-y-4">
            <div className="flex items-baseline space-x-2">
              <span className="font-serif text-3xl text-wine font-light">04</span>
              <span className="h-[1px] w-12 bg-wine/20" />
              <span className="text-xs uppercase tracking-[0.25em] text-charcoal/40 font-sans">
                The Gallery
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal tracking-tight">
              Curated Collections
            </h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-4 border-b border-wine/10 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`text-xs uppercase tracking-[0.2em] px-4 py-2 font-sans transition-all duration-300 relative ${
                  selectedFilter === cat.id 
                    ? 'text-wine font-medium' 
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                {cat.name}
                {selectedFilter === cat.id && (
                  <motion.div
                    layoutId="galleryFilterUnderline"
                    className="absolute left-4 right-4 bottom-0 h-[1.5px] bg-wine"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((art) => (
              <motion.div
                layout
                key={art.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                className="group cursor-pointer bg-[#FDFBF7] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-wine/5 flex flex-col"
                onClick={() => setSelectedArtwork(art)}
              >
                {/* Image Wrap */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#EADFD0]">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center space-x-3">
                    <div className="bg-[#F7F2EB] text-wine p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
                      <ZoomIn size={18} />
                    </div>
                    <div className="bg-[#F7F2EB] text-charcoal p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
                      <Info size={18} />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-3 bg-[#FDFBF7]">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-wine">
                      {art.year} &bull; {art.medium}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-charcoal group-hover:text-wine transition-colors duration-300">
                      {art.title}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center text-xs tracking-wider text-charcoal/40 pt-2 border-t border-wine/5">
                    <span>{art.dimensions}</span>
                    <span className="uppercase text-[10px] tracking-[0.2em] font-medium text-charcoal/60 group-hover:text-wine group-hover:translate-x-1 transition-all duration-300">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative bg-[#F7F2EB] max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] border border-wine/10"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="absolute right-4 top-4 z-20 bg-charcoal text-[#F7F2EB] hover:bg-wine p-2 rounded-full transition-colors duration-300"
                  aria-label="Close details"
                >
                  <X size={20} />
                </button>

                {/* Left Side: Artwork Image */}
                <div className="md:col-span-7 relative h-[300px] md:h-[85vh] bg-charcoal flex items-center justify-center">
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
                <div className="md:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-8 overflow-y-auto max-h-[60vh] md:max-h-[85vh] bg-[#F7F2EB] paper-texture">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.25em] text-wine font-medium font-sans">
                        Collection Piece
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
                      className="w-full text-center block bg-wine text-[#F7F2EB] hover:bg-charcoal uppercase tracking-[0.2em] text-xs py-4 font-sans font-medium rounded-lg transition-colors duration-300"
                    >
                      Inquire About Acquisition
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
