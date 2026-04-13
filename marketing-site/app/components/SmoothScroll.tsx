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
    if (typeof window === 'undefined') return;
    const shouldUseVirtualScroll = location.pathname === "/new-home";
    if (!shouldUseVirtualScroll) return;

    // Respect user motion settings and avoid virtual scroll on coarse touch devices.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || hasCoarsePointer) return;

    let lenisInstance: any = null;
    let tickerCallback: ((time: number) => void) | null = null;
    
    const initLenis = async () => {
      const { default: Lenis } = await import('lenis');
      
      const lenis = new Lenis({
        duration: 0.65,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      });

      lenisRef.current = lenis;
      lenisInstance = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);

      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    };

    initLenis();

    return () => {
      if (lenisInstance) {
        lenisInstance.off('scroll', ScrollTrigger.update);
      }
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
      lenisRef.current = null;
    };
  }, [location.pathname]);

  return null; // This component doesn't render anything visible
}
