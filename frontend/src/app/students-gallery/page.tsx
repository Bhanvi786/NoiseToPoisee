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
                className="space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Image Frame */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-xl border border-wine/5 bg-[#EADFD0] group">
                    <Image
                      src={getImageUrl(work.image)}
                      alt={work.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-103"
                    />
                    <div className="absolute top-4 right-4 bg-[#F7F2EB]/90 backdrop-blur-sm px-4 py-2 rounded-full border border-wine/10">
                      <span className="text-[10px] uppercase tracking-widest text-wine font-sans font-medium">
                        Student Work
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-baseline border-b border-wine/10 pb-2">
                      <h3 className="font-serif text-3xl font-light text-charcoal">
                        {work.title}
                      </h3>
                      {work.artist && (
                        <span className="text-sm font-signature text-brown font-medium">
                          by {work.artist}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between text-xs tracking-wider text-charcoal/40 font-sans">
                      <span>{work.dimensions ? `${work.medium} \u2022 ${work.dimensions}` : work.medium}</span>
                      <span className="text-wine font-medium uppercase text-[10px] tracking-widest">{work.mentorshipYear}</span>
                    </div>

                    <p className="text-sm text-charcoal/70 leading-relaxed font-sans font-light pt-2">
                      {work.concept}
                    </p>
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
