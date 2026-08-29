'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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

const studentWorks = [
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

export default function StudentsWorkSection() {
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
            setStudentWorksList(studentWorks);
          }
        } else {
          setStudentWorksList(studentWorks);
        }
      } catch (err) {
        console.error(err);
        setStudentWorksList(studentWorks);
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
    <section id="students-work" className="py-16 sm:py-20 md:py-24 lg:py-36 bg-[#FDFBF7] border-t border-wine/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 md:mb-20 space-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl text-wine font-light">05</span>
            <span className="h-[1px] w-12 bg-wine/20" />
            <span className="text-xs uppercase tracking-[0.25em] text-charcoal/40 font-sans">
              Under Mentorship
            </span>
          </div>
          <h2 className="font-serif text-[clamp(1.75rem,5vw,3.75rem)] font-light text-charcoal tracking-tight">
            Curated Students&apos; Work
          </h2>
          <p className="text-charcoal/60 font-sans font-light leading-relaxed max-w-2xl text-base">
            Showcasing outstanding portfolios from artists under Deepti Aroura&apos;s direct guidance, focusing on the mastery of traditional mediums, textures, and canvas composure.
          </p>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 lg:gap-12">
          {studentWorksList.slice(0, 6).map((work, index) => (
            <motion.div
              key={work._id || work.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-5% 0px' }}
              variants={fadeUp}
              className="group bg-[#FDFBF7] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-wine/5 flex flex-col"
            >
              {/* Image Wrap */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#EADFD0]">
                <Image
                  src={getImageUrl(work.image)}
                  alt={work.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#F7F2EB]/90 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-wine/10 z-10">
                  <span className="text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-widest text-wine font-sans font-medium">
                    Student Work
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-3 sm:p-4 md:p-6 flex-grow flex flex-col justify-between space-y-2 sm:space-y-3 bg-[#FDFBF7]">
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] text-wine">
                    {work.mentorshipYear} &bull; {work.medium}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg md:text-2xl font-light text-charcoal transition-colors duration-300">
                    {work.title}
                  </h3>
                  {work.artist && (
                    <span className="text-xs sm:text-sm font-signature text-brown font-medium block mt-0.5 sm:mt-1">
                      by {work.artist}
                    </span>
                  )}
                </div>

                <p className="text-[10px] sm:text-xs md:text-sm text-charcoal/70 leading-relaxed font-sans font-light pt-1 sm:pt-2 line-clamp-2 sm:line-clamp-3">
                  {work.concept}
                </p>

                {work.dimensions && (
                  <div className="flex justify-between items-center text-[9px] sm:text-[10px] md:text-xs tracking-wider text-charcoal/40 pt-1 sm:pt-2 border-t border-wine/5">
                    <span>{work.dimensions}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {studentWorksList.length > 6 && (
          <div className="flex justify-end mt-12">
            <Link
              href="/students-gallery"
              className="group flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-sans font-medium text-wine hover:text-charcoal transition-colors duration-300 border-b border-wine/20 hover:border-charcoal/20 pb-1"
            >
              <span>View More</span>
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
