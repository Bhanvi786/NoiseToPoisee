'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

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
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section id="students-work" className="py-24 md:py-36 bg-[#FDFBF7] border-t border-wine/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-20 space-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl text-wine font-light">05</span>
            <span className="h-[1px] w-12 bg-wine/20" />
            <span className="text-xs uppercase tracking-[0.25em] text-charcoal/40 font-sans">
              Under Mentorship
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal tracking-tight">
            Curated Students&apos; Work
          </h2>
          <p className="text-charcoal/60 font-sans font-light leading-relaxed max-w-2xl text-base">
            Showcasing outstanding portfolios from artists under Deepti Aroura&apos;s direct guidance, focusing on the mastery of traditional mediums, textures, and canvas composure.
          </p>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {studentWorks.map((work, index) => (
            <motion.div
              key={work.id}
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
                    src={work.image}
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
                    <span className="text-sm font-signature text-brown font-medium">
                      by {work.artist}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs tracking-wider text-charcoal/40 font-sans">
                    <span>{work.medium} &bull; {work.dimensions}</span>
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

      </div>
    </section>
  );
}
