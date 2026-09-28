'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ArrowLeft, ExternalLink } from 'lucide-react';

interface BookIllustrationType {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  link: string;
  image: string;
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

export default function BookIllustrationsPage() {
  const [bookIllustrationsList, setBookIllustrationsList] = useState<BookIllustrationType[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#F7F2EB] py-12 md:py-20 relative px-6 md:px-12">
      {/* Decorative vertical lines / gradients */}
      <div className="absolute right-0 top-0 w-[40vw] h-[40vw] rounded-full bg-wine/5 blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[40vw] h-[40vw] rounded-full bg-wine/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col mb-16 space-y-4 border-b border-wine/10 pb-6">
          <Link
            href="/#book-illustrations"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-wine hover:text-charcoal transition-colors duration-300 mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal tracking-tight">
            Book Illustrations
          </h1>
          <p className="text-charcoal/60 font-sans text-sm tracking-wide max-w-lg">
            A curated collection of published covers and illustrative works for authors and publications.
          </p>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <Loader2 className="w-8 h-8 text-wine animate-spin" />
            <p className="font-sans text-xs text-charcoal/60 uppercase tracking-widest">
              Loading Illustrations...
            </p>
          </div>
        ) : (
          /* Works Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {bookIllustrationsList.map((work) => (
              <motion.div
                key={work._id || work.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-5% 0px' }}
                variants={fadeUp}
                className="group bg-[#FDFBF7] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-charcoal/5 hover:border-wine/10 flex flex-col h-full"
              >
                {/* Image Wrap (Editorial Matting) */}
                <div className="relative aspect-[3/4] lg:aspect-[4/5] w-full bg-[#EADFD0] p-6 sm:p-10 lg:p-12 flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={getImageUrl(work.image)}
                      alt={work.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="absolute top-6 right-6 bg-wine/95 text-[#F7F2EC] text-[9px] uppercase tracking-widest font-sans font-medium px-4 py-1.5 rounded shadow-sm z-20 backdrop-blur-sm">
                    Book Illustration
                  </div>
                  <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                </div>

                {/* Details */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col space-y-4 bg-[#FDFBF7]">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal group-hover:text-wine transition-colors duration-300">
                      {work.title}
                    </h3>
                  </div>

                  <p className="text-sm text-charcoal/70 leading-relaxed font-sans font-light pt-2">
                    {work.description}
                  </p>

                  <div className="flex justify-start items-center pt-6 border-t border-charcoal/5 mt-auto">
                    {work.link ? (
                      <a
                        href={work.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-wine text-[#F7F2EB] hover:bg-wine/90 px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all shadow-md group-hover:shadow-wine/20"
                      >
                        <span>View Book</span>
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    ) : (
                      <span className="text-xs uppercase tracking-widest text-charcoal/40 font-semibold">
                        Preview Only
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
