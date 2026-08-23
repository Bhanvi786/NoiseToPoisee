'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    // Update ScrollTrigger on scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Integrate GSAP Ticker with Lenis
    const updateGsap = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateGsap);
    gsap.ticker.lagSmoothing(0);

    // Register GSAP ScrollTrigger plugin after browser load
    gsap.registerPlugin(ScrollTrigger);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateGsap);
    };
  }, []);

  return <>{children}</>;
}
