import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

/**
 * SmoothScroll Component
 * Integrates Lenis with GSAP ScrollTrigger for "smooth as fuck" scrolling.
 */
export function SmoothScroll() {
  const location = useLocation();
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import Lenis to avoid SSR issues in Cloudflare Workers
    let lenisInstance: any = null;
    
    const initLenis = async () => {
      const { default: Lenis } = await import('lenis');
      
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      lenisRef.current = lenis;
      lenisInstance = lenis;

      // 2. Synchronize with GSAP
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      // 3. Handle potential initial jump and refresh triggers
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    };

    initLenis();

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
        gsap.ticker.remove(lenisInstance.raf);
      }
    };
  }, []);

  // Recalculate dimensions on route change
  useEffect(() => {
    if (lenisRef.current) {
        // Short delay to ensure DOM has rendered
        const timer = setTimeout(() => {
            lenisRef.current?.resize();
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [location]);

  return null; // This component doesn't render anything visible
}
