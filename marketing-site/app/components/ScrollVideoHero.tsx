import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollVideoHeroProps {
  videoUrl: string;
  className?: string;
}

export const ScrollVideoHero: React.FC<ScrollVideoHeroProps> = ({
  videoUrl,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is ready
    const handleMetadata = () => {
      setIsLoaded(true);
      video.currentTime = 0;
    };

    const handleError = () => {
      setError("Failed to load video asset. Please check the file path.");
    };

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('error', handleError);

    // Initial check if already loaded (e.g. from cache)
    if (video.readyState >= 2) handleMetadata();

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (!isLoaded || !videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const duration = video.duration;

    // Use requestAnimationFrame to decouple scroll from currentTime update
    // as mandated by the high-performance protocol
    let targetTime = 0;
    let actualTime = 0;

    const updateVideo = () => {
      // Smooth interpolation for buttery movement
      actualTime += (targetTime - actualTime) * 0.1;
      
      if (Math.abs(actualTime - targetTime) > 0.001) {
        video.currentTime = actualTime;
      }
      
      requestAnimationFrame(updateVideo);
    };

    const rafId = requestAnimationFrame(updateVideo);

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=400%', // Scroll distance
      scrub: true,
      pin: true,
      onUpdate: (self) => {
        targetTime = self.progress * duration;
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      st.kill();
    };
  }, [isLoaded]);

  return (
    <div ref={containerRef} className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900 p-8 text-center">
          <p className="text-red-400 font-bold">{error}</p>
        </div>
      )}
      
      {!isLoaded && !error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900">
          <div className="flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
             <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Synchronizing Stream</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        playsInline
        muted
        preload="auto"
        className="w-full h-full object-cover pointer-events-none will-change-transform"
      />
    </div>
  );
};
