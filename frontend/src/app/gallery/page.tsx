'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ZoomIn, Info, Loader2, ArrowLeft } from 'lucide-react';

interface ArtworkType {
  _id?: string;
  id?: number;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  aspect?: string;
  description: string;
  isSold?: boolean;
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/uploads/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    return `${apiUrl}${imagePath}`;
  }
  return imagePath;
};

const matchMediumToTab = (medium: string, tabId: string): boolean => {
  if (tabId === 'all') return true;
  if (!medium) return false;
  
  const lowerMedium = medium.toLowerCase().trim();
  
  switch (tabId) {
    case 'acrylics':
      return lowerMedium.includes('acrylic');
    case 'oils':
      return lowerMedium.includes('oil');
    case 'pencil_shading':
      return lowerMedium.includes('shading') || (lowerMedium.includes('pencil') && !lowerMedium.includes('colour') && !lowerMedium.includes('color'));
    case 'charcoal':
      return lowerMedium.includes('charcoal');
    case 'pencil_colour':
      return lowerMedium.includes('colour') || lowerMedium.includes('color');
    default:
      return false;
  }
};

const categories = [
  { id: 'all', name: 'All Works' },
  { id: 'acrylics', name: 'Acrylics' },
  { id: 'oils', name: 'Oils' },
  { id: 'pencil_shading', name: 'Pencil Shading' },
  { id: 'charcoal', name: 'Charcoal' },
  { id: 'pencil_colour', name: 'Pencil Colour' },
];

const fallbackArtworks = [
  {
    id: 1,
    title: 'Silence in Crimson',
    category: 'oils',
    year: '2025',
    medium: 'Oil on Linen',
    dimensions: '40 × 50 inches',
    image: '/artwork/1.jpeg',
    description: 'A study in quiet contemplation and emotional resonance. The heavy crimson red drapery forms a sanctuary around the subject, contrasting with the soft, warm golden light.',
  },
  {
    id: 2,
    title: 'The Courtyard Thread',
    category: 'acrylics',
    year: '2026',
    medium: 'Acrylic on Canvas',
    dimensions: '48 × 48 inches',
    image: '/artwork/2.jpeg',
    description: 'Capturing the peaceful rhythms of domestic heritage in rural India. The textures of stone and cotton are rendered with intricate palette knife strokes.',
  },
  {
    id: 3,
    title: 'Solitude of Autumn',
    category: 'pencil_shading',
    year: '2025',
    medium: 'Pencil Shading on Paper',
    dimensions: '36 × 36 inches',
    image: '/artwork/3.jpeg',
    description: 'A landscape reflecting internal emotional states. The solitary red-leafed tree stands as a sentinel of patience amidst stormy, atmospheric skies.',
  },
  {
    id: 4,
    title: 'Echoes of Poise',
    category: 'charcoal',
    year: '2026',
    medium: 'Charcoal on Paper',
    dimensions: '60 × 60 inches',
    image: '/artwork/4.jpeg',
    description: 'An abstract expression of balance. Rich textures and bold sweeps of wine red intersect with charcoal and ivory, conveying a sense of resolved tension.',
  },
  {
    id: 5,
    title: 'The Lotus Mudra',
    category: 'pencil_colour',
    year: '2025',
    medium: 'Pencil Colour on Paper',
    dimensions: '30 × 30 inches',
    image: '/artwork/5.jpeg',
    description: 'A close study of hand mudras in classical Indian dance. Symbolizing the unfolding of consciousness and poise in the center of mud and water.',
  },
  {
    id: 6,
    title: 'Pillars of Devotion',
    category: 'oils',
    year: '2026',
    medium: 'Oil on Canvas',
    dimensions: '50 × 50 inches',
    image: '/artwork/6.jpeg',
    description: 'An architectural exploration of light and shadow in an ancient stone temple. The composition leads the eye through layers of intricate carvings toward a distant figure.',
  },
];

function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParam = searchParams.get('filter') || 'all';

  const [selectedFilter, setSelectedFilter] = useState(filterParam);
  const [artworksList, setArtworksList] = useState<ArtworkType[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkType | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync selectedFilter with URL query param
  useEffect(() => {
    if (filterParam) {
      setSelectedFilter(filterParam);
    }
  }, [filterParam]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/artworks`);
        if (res.ok) {
          const data = await res.json();
          setArtworksList(data);
        } else {
          setArtworksList(fallbackArtworks);
        }
      } catch (err) {
        console.error(err);
        setArtworksList(fallbackArtworks);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  const handleFilterSelect = (id: string) => {
    setSelectedFilter(id);
    router.push(`/gallery?filter=${id}`, { scroll: false });
  };

  const filteredArtworks = artworksList.map((art) => {
    const isVisible = matchMediumToTab(art.medium, selectedFilter);
    return { ...art, isVisible };
  });

  return (
    <div className="min-h-screen bg-[#F7F2EB] py-12 md:py-20 relative px-6 md:px-12">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute right-0 top-0 w-[40vw] h-[40vw] rounded-full bg-wine/5 blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[40vw] h-[40vw] rounded-full bg-wine/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 space-y-6 md:space-y-0 border-b border-wine/10 pb-6">
          <div className="space-y-4">
            <Link
              href="/#collections"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-wine hover:text-charcoal transition-colors duration-300 mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal tracking-tight">
              Full Exhibition
            </h1>
            <p className="text-charcoal/60 font-sans text-sm tracking-wide max-w-lg">
              Explore the complete curated database of original paintings, drawings, and custom commissions.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-4 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterSelect(cat.id)}
                className={`text-xs uppercase tracking-[0.2em] px-4 py-2 font-sans transition-all duration-300 relative ${selectedFilter === cat.id
                    ? 'text-wine font-medium'
                    : 'text-charcoal/50 hover:text-charcoal'
                  }`}
              >
                {cat.name}
                {selectedFilter === cat.id && (
                  <motion.div
                    layoutId="galleryFilterUnderlinePage"
                    className="absolute left-4 right-4 bottom-0 h-[1.5px] bg-wine"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <Loader2 className="w-8 h-8 text-wine animate-spin" />
            <p className="font-sans text-xs text-charcoal/60 uppercase tracking-widest">
              Loading Artworks...
            </p>
          </div>
        ) : (
          /* Gallery Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredArtworks.map((art) => {
              const isVisible = art.isVisible;
              return (
                <motion.div
                  key={art._id || art.id}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.95,
                  }}
                  style={{
                    display: isVisible ? 'flex' : 'none'
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="group cursor-pointer bg-[#FDFBF7] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-wine/5 flex flex-col"
                  onClick={() => setSelectedArtwork(art)}
                >
                  {/* Image Wrap */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#EADFD0]">
                    <Image
                      src={getImageUrl(art.image)}
                      alt={art.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    {art.isSold && (
                      <div className="absolute top-4 left-4 bg-wine text-[#F7F2EC] text-[9px] uppercase tracking-widest font-sans font-semibold px-3 py-1.5 rounded-full shadow-md z-20">
                        Sold
                      </div>
                    )}
                    {/* Subtle Hover Overlay */}
                    <div className="absolute inset-0 bg-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center space-x-3 z-10">
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
                      <span className="text-[10px] uppercase tracking-[0.2em] text-wine flex justify-between items-center">
                        <span>{art.year} &bull; {art.medium}</span>
                        <span className={`font-semibold uppercase tracking-wider text-[8px] ${art.isSold ? 'text-wine' : 'text-green-700/80'}`}>
                          {art.isSold ? 'Sold' : 'Available'}
                        </span>
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
              );
            })}
          </div>
        )}

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
                      src={getImageUrl(selectedArtwork.image)}
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
                      <div className="flex justify-between border-b border-wine/10 pb-2">
                        <span className="text-charcoal/40 uppercase tracking-widest text-[10px]">Status</span>
                        <span className={`font-semibold uppercase tracking-wider text-xs ${selectedArtwork.isSold ? 'text-wine' : 'text-green-700'}`}>
                          {selectedArtwork.isSold ? 'Sold' : 'Available'}
                        </span>
                      </div>
                    </div>

                    <p className="text-charcoal/70 font-sans text-sm leading-relaxed font-light">
                      {selectedArtwork.description}
                    </p>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/#contact"
                      onClick={() => setSelectedArtwork(null)}
                      className="w-full text-center block bg-wine text-[#F7F2EB] hover:bg-charcoal uppercase tracking-[0.2em] text-xs py-4 font-sans font-medium rounded-lg transition-colors duration-300"
                    >
                      Inquire About Acquisition
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F2EB] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-wine animate-spin" />
        <p className="font-sans text-xs text-charcoal/60 uppercase tracking-widest">
          Loading Gallery...
        </p>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
