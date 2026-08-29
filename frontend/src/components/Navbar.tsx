'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Collections', href: '#collections' },
  { name: 'Student Work', href: '#students-work' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll to update active section and navbar background
  useEffect(() => {
    const handleScroll = () => {
      // Toggle navbar background
      setScrolled(window.scrollY > 50);

      // Identify active section
      const sections = navItems.map(item => document.getElementById(item.href.replace('#', '')));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && scrollPosition >= section.offsetTop) {
          setActiveSection(navItems[i].href.replace('#', ''));
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      // Smooth scroll using native or Lenis if active
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-wine/5 ${scrolled
          ? 'bg-[#F7F2EC]/95 backdrop-blur-md py-2 sm:py-3 md:py-4 shadow-sm'
          : 'bg-transparent py-3 sm:py-4 md:py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center hover:opacity-90 transition-opacity duration-300"
          >
            <img
              src="/Logo.png"
              alt="noiseToPoise Logo"
              className="h-[clamp(2.5rem,5vw,4rem)] w-[clamp(2.5rem,5vw,4rem)] object-contain rounded-full border border-charcoal/20 shadow-sm"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="relative text-[11px] lg:text-sm tracking-[0.1em] lg:tracking-[0.15em] uppercase text-charcoal/80 hover:text-charcoal transition-colors duration-300 font-sans"
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute left-0 right-0 -bottom-1 h-[1px] bg-wine"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Menu Button / Hamburger */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 text-charcoal/80 hover:text-wine transition-colors duration-300 group"
              aria-label="Toggle Menu"
            >
              <span className="text-xs uppercase tracking-[0.2em] font-sans hidden sm:inline">
                Menu
              </span>
              <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-[1.5px] bg-charcoal transition-all duration-300 ease-out ${isOpen ? 'rotate-45 translate-y-[1.5px]' : '-translate-y-1'
                    }`}
                />
                <span
                  className={`block w-5 h-[1.5px] bg-charcoal transition-all duration-300 ease-out ${isOpen ? '-rotate-45 -translate-y-[1px]' : 'translate-y-1'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Mobile & Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#F7F2EC] z-40 flex flex-col justify-center px-8 sm:px-16 md:px-24"
          >
            {/* Background design accents in the overlay */}
            <div className="absolute right-0 bottom-0 w-[40vw] h-[40vw] rounded-full bg-wine/5 blur-3xl pointer-events-none" />
            <div className="absolute left-10 top-20 w-32 h-32 rounded-full border border-wine/10 pointer-events-none" />

            <div className="max-w-4xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column: Menu Items */}
              <nav className="flex flex-col space-y-6">
                {navItems.map((item, index) => {
                  const id = item.href.replace('#', '');
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-charcoal hover:text-wine hover:pl-4 transition-all duration-500 block relative"
                      >
                        {item.name}
                      </a>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Right Column: Mini Bio / Gallery Quote */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="hidden md:block border-l border-wine/10 pl-12 space-y-6"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-wine font-sans">
                  The Artist
                </span>
                <h3 className="font-serif text-3xl font-light text-charcoal leading-snug">
                  Translating modern noise into serene poise on canvas.
                </h3>
                <p className="text-sm text-charcoal/60 leading-relaxed max-w-sm">
                  Deepti Aroura is a contemporary artist based in India, exploring themes of tranquility, identity, and the poetic silence of natural forms.
                </p>
                <div className="pt-4 font-signature text-3xl text-brown">
                  Deepti Aroura
                </div>
              </motion.div>
            </div>

            {/* Footer inside mobile menu */}
            <div className="absolute bottom-10 left-8 sm:left-16 right-8 sm:right-16 flex justify-between items-center text-xs tracking-widest text-charcoal/40 uppercase">
              <div>© 2026 noiseToPoise</div>
              <div className="flex space-x-6">
                <a href="#instagram" className="hover:text-wine transition-colors">Instagram</a>
                <a href="#facebook" className="hover:text-wine transition-colors">Facebook</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
