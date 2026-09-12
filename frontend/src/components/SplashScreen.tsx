'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Lock body scroll while splash screen is visible
    document.body.style.overflow = 'hidden';
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F7F2EC] paper-texture"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center text-center"
          >
            {/* Logo */}
            <img
              src="/Logo.png"
              alt="noiseToPoise Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-full border border-charcoal/10 shadow-sm mb-10"
            />
            
            {/* Divider */}
            <div className="w-16 h-[1.5px] bg-[#C1A78B] mb-8" />
            
            {/* Brand Text */}
            <h1 className="text-sm sm:text-base tracking-[0.3em] uppercase text-[#A37B55] font-sans font-medium mb-3">
              noiseToPoise
            </h1>
            
            {/* Subtext */}
            <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-charcoal/50 font-sans">
              Artist Portfolio by Deepti Aroura
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
