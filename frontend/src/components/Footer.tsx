'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#F7F2EB] py-16 md:py-24 border-t border-white/5 relative overflow-hidden">
      {/* Subtle organic background accent */}
      <div className="absolute right-[-10%] bottom-[-10%] w-[30vw] h-[30vw] rounded-full bg-wine/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Left Column: Brand & Quote */}
        <div className="md:col-span-5 space-y-6">
          <a
            href="#home"
            onClick={(e) => handleScrollTo(e, '#home')}
            className="font-serif text-3xl font-light tracking-wide hover:text-wine transition-colors block"
          >
            noise<span className="text-wine font-medium">To</span>poise
          </a>
          <p className="text-sm text-white/50 leading-relaxed font-sans font-light max-w-sm">
            Exploring the profound silence that resides beneath modern noise. A gallery of classical and contemporary oil paintings curated for the modern collector.
          </p>
          <div className="font-signature text-3xl text-wine">
            Deepti Aroura
          </div>
        </div>

        {/* Center Column: Quick Navigation Links */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-wine font-sans font-medium">
            Navigation
          </h4>
          <nav className="flex flex-col space-y-2.5 font-sans text-sm font-light text-white/60">
            <a href="#home" onClick={(e) => handleScrollTo(e, '#home')} className="hover:text-white transition-colors">Home</a>
            <a href="#about" onClick={(e) => handleScrollTo(e, '#about')} className="hover:text-white transition-colors">About the Artist</a>
            <a href="#collections" onClick={(e) => handleScrollTo(e, '#collections')} className="hover:text-white transition-colors">Curated Collections</a>
            <a href="#students-work" onClick={(e) => handleScrollTo(e, '#students-work')} className="hover:text-white transition-colors">Students&apos; Work</a>
            <a href="#contact" onClick={(e) => handleScrollTo(e, '#contact')} className="hover:text-white transition-colors">Inquire &amp; Contact</a>
          </nav>
        </div>

        {/* Right Column: Social Links & Studio Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-wine font-sans font-medium">
              Social Media
            </h4>
            <div className="flex space-x-6 font-sans text-sm font-light text-white/60">
              <a href="#instagram" className="hover:text-white transition-colors">Instagram</a>
              <a href="#behance" className="hover:text-white transition-colors">Behance</a>
              <a href="#pinterest" className="hover:text-white transition-colors">Pinterest</a>
              <a href="#vimeo" className="hover:text-white transition-colors">Vimeo</a>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <h4 className="text-xs uppercase tracking-widest text-wine font-sans font-medium">
              Studio Representation
            </h4>
            <p className="text-xs text-white/40 leading-relaxed font-sans font-light">
              Press queries: press@noisetopoise.com<br />
              Gallery partnerships: partners@noisetopoise.com
            </p>
          </div>
        </div>

      </div>

      {/* Under Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs tracking-widest text-white/30 uppercase font-sans">
        <div className="mb-4 sm:mb-0">
          &copy; 2026 noiseToPoise. All rights reserved.
        </div>
        <div className="flex space-x-2">
          <span>Curated with Poise. Designed with Intention.</span>
        </div>
      </div>
    </footer>
  );
}
