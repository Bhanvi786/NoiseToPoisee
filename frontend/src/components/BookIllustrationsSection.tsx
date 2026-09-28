'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

interface BookIllustrationType {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  link: string;
  image: string;
  images?: string[];
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

const fallbackWorks = [
  {
    id: 1,
    title: 'The Whispering Woods',
    description: 'A collection of whimsical illustrations created for a children\'s fantasy book, featuring enchanting creatures and magical landscapes.',
    link: '#',
    image: '/artwork/student_lake.png',
  },
  {
    id: 2,
    title: 'Midnight Chronicles',
    description: 'Cover art and chapter headers for a dark fantasy novel, emphasizing atmospheric lighting and intricate character design.',
    link: '#',
    image: '/artwork/student_portrait.png',
  }
];

export default function BookIllustrationsSection() {
  const [bookIllustrationsList, setBookIllustrationsList] = useState<BookIllustrationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<BookIllustrationType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (selectedBook) {
      setCurrentImageIndex(0);
    }
  }, [selectedBook]);

  useEffect(() => {
    const fetchBookIllustrations = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/book-illustrations`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setBookIllustrationsList(data);
          } else {
            setBookIllustrationsList(fallbackWorks);
          }
        } else {
          setBookIllustrationsList(fallbackWorks);
        }
      } catch (err) {
        console.error(err);
        setBookIllustrationsList(fallbackWorks);
      } finally {
        setLoading(false);
      }
    };
    fetchBookIllustrations();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section id="book-illustrations" className="py-16 sm:py-20 md:py-24 lg:py-36 bg-[#FDFBF7] border-t border-wine/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 md:mb-20 space-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl text-wine font-light">06</span>
            <span className="h-[1px] w-12 bg-wine/20" />
            <span className="text-xs uppercase tracking-[0.25em] text-charcoal/40 font-sans">
              Published Works
            </span>
          </div>
          <h2 className="font-serif text-[clamp(1.75rem,5vw,3.75rem)] font-light text-charcoal tracking-tight">
            Book Illustrations
          </h2>
          <p className="text-charcoal/60 font-sans font-light leading-relaxed max-w-2xl text-base">
            A curated collection of published covers and illustrative works for authors and publications. 
          </p>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 lg:gap-12">
          {bookIllustrationsList.slice(0, 6).map((work) => (
            <motion.div
              key={work._id || work.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-5% 0px' }}
              variants={fadeUp}
              className="group bg-[#FDFBF7] rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-charcoal/5 hover:border-wine/10 flex flex-col cursor-pointer"
              onClick={() => setSelectedBook(work)}
            >
              {/* Image Wrap */}
              <div className="relative aspect-[4/5] sm:aspect-square w-full bg-[#EADFD0] p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={getImageUrl(work.image)}
                    alt={work.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-wine/95 text-[#F7F2EC] text-[8px] sm:text-[9px] uppercase tracking-widest font-sans font-medium px-3 py-1 rounded shadow-sm z-20 backdrop-blur-sm">
                  Illustration
                </div>
                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              </div>

              {/* Details */}
              <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4 bg-[#FDFBF7]">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-charcoal group-hover:text-wine transition-colors duration-300 line-clamp-1">
                    {work.title}
                  </h3>
                </div>

                <p className="text-[10px] sm:text-xs md:text-sm text-charcoal/70 leading-relaxed font-sans font-light pt-1 line-clamp-2">
                  {work.description}
                </p>

                {work.link && (
                  <div className="pt-3 sm:pt-4 border-t border-charcoal/5 mt-auto">
                    <a
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center space-x-1.5 text-[10px] sm:text-xs text-wine hover:text-charcoal uppercase tracking-widest font-medium transition-colors"
                    >
                      <span>View Book</span>
                      <span>→</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {bookIllustrationsList.length > 6 && (
          <div className="flex justify-end mt-12">
            <Link
              href="/book-illustrations"
              className="group flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-wine hover:text-charcoal transition-colors duration-300 border-b border-wine/20 hover:border-charcoal/20 pb-1"
            >
              <span>View All Books</span>
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}

      </div>

      {/* Lightbox / Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-md p-4 sm:p-8 overflow-y-auto"
          >
            {/* Close Area */}
            <div
              className="absolute inset-0 cursor-zoom-out"
              onClick={() => setSelectedBook(null)}
            />

            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative bg-[#F7F2EC] max-w-5xl w-full rounded-lg overflow-y-auto overflow-x-hidden md:overflow-hidden shadow-2xl z-10 flex flex-col md:grid md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] border border-wine/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute right-4 top-4 z-20 bg-charcoal/80 text-[#F7F2EC] hover:bg-wine p-2 rounded-full transition-colors duration-300 backdrop-blur-sm"
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              {/* Left Side: Book Image */}
              <div className="md:col-span-7 relative shrink-0 h-[350px] md:h-[85vh] bg-charcoal/95 flex flex-col items-center justify-center group">
                <div className="relative w-full h-full flex-grow">
                  <Image
                    src={getImageUrl((selectedBook.images && selectedBook.images.length > 0) ? selectedBook.images[currentImageIndex] : selectedBook.image)}
                    alt={selectedBook.title}
                    fill
                    className="object-contain p-4 sm:p-8"
                    priority
                  />
                </div>

                {/* Carousel Controls */}
                {selectedBook.images && selectedBook.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev > 0 ? prev - 1 : selectedBook.images!.length - 1); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors z-20"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev < selectedBook.images!.length - 1 ? prev + 1 : 0); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full transition-colors z-20"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                    
                    {/* Thumbnails indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                      {selectedBook.images.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right Side: Book Info */}
              <div className="md:col-span-5 p-6 sm:p-12 flex flex-col space-y-6 md:space-y-8 bg-[#F7F2EC] paper-texture md:overflow-y-auto md:max-h-[85vh]">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.25em] text-wine font-medium font-sans">
                      Book Illustration
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-light text-charcoal leading-tight">
                      {selectedBook.title}
                    </h2>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-wine/10 mt-6">
                    <span className="text-[10px] uppercase tracking-widest text-wine/60 font-bold font-sans">Description</span>
                    <p className="text-charcoal/70 font-sans text-sm leading-relaxed font-light whitespace-pre-wrap">
                      {selectedBook.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
