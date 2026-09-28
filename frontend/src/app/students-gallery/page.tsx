'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';

interface StudentWorkType {
  _id?: string;
  id?: number;
  title: string;
  artist: string;
  mentorshipYear: string;
  medium: string;
  dimensions: string;
  image: string;
  concept: string;
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
    title: 'Serenity at Dawn',
    artist: 'Eliza Reed',
    mentorshipYear: 'Mentorship Class of 2025',
    medium: 'Oil on Canvas',
    dimensions: '24 × 30 inches',
    image: '/artwork/student_lake.png',
    concept: 'A landscape study capturing the soft reflections and light gradients of early morning. Eliza developed this piece focusing on brushwork control and atmospheric perspective.'
  },
  {
    id: 2,
    title: 'Gaze of Innocence',
    artist: 'Aarav Mehta',
    mentorshipYear: 'Mentorship Class of 2026',
    medium: 'Charcoal & Soft Pastel on Paper',
    dimensions: '20 × 20 inches',
    image: '/artwork/student_portrait.png',
    concept: 'A high-contrast study of emotion and structure. Aarav combined delicate blending with raw charcoal lines to achieve a powerful portrait filled with depth.'
  }
];

export default function StudentsGalleryPage() {
  const [studentWorksList, setStudentWorksList] = useState<StudentWorkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentWorks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/student-works`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setStudentWorksList(data);
          } else {
            setStudentWorksList(fallbackWorks);
          }
        } else {
          setStudentWorksList(fallbackWorks);
        }
      } catch (err) {
        console.error(err);
        setStudentWorksList(fallbackWorks);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentWorks();
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
            href="/#students-work"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-wine hover:text-charcoal transition-colors duration-300 mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal tracking-tight">
            Mentorship Exhibition
          </h1>
          <p className="text-charcoal/60 font-sans text-sm tracking-wide max-w-lg">
            Outstanding artwork collections created by student-artists under Deepti Aroura&apos;s direct mentorship.
          </p>
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
          /* Works Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {studentWorksList.map((work) => (
              <motion.div
                key={work._id || work.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-5% 0px' }}
                variants={fadeUp}
                className="group bg-[#FDFBF7] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-charcoal/5 hover:border-wine/10 flex flex-col h-full"
              >
                {/* Image Wrap (Editorial Matting) */}
                <div className="relative aspect-[4/5] lg:aspect-square w-full bg-[#EADFD0] p-6 sm:p-10 lg:p-12 flex items-center justify-center overflow-hidden">
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
                    Student Work
                  </div>
                  <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                </div>

                {/* Details */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col space-y-4 bg-[#FDFBF7]">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal group-hover:text-wine transition-colors duration-300">
                      {work.title}
                    </h3>
                    <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/60 flex flex-wrap gap-2 items-center font-sans">
                      <span>{work.mentorshipYear}</span>
                      <span className="w-1 h-1 rounded-full bg-charcoal/30"></span>
                      <span>{work.medium}</span>
                    </div>
                    {work.artist && (
                      <span className="text-sm sm:text-base font-signature text-brown font-medium block mt-1">
                        by {work.artist}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-charcoal/70 leading-relaxed font-sans font-light pt-2 line-clamp-3">
                    {work.concept}
                  </p>

                  <div className="flex justify-between items-center text-xs tracking-wider text-charcoal/50 pt-4 border-t border-charcoal/5 font-sans mt-auto">
                    <span>{work.dimensions}</span>
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
