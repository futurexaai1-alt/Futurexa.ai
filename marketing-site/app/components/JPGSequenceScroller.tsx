import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface JPGSequenceScrollerProps {
  directory: string;
  frameCount: number;
  fileNamePrefix: string;
  extension: string;
  padding: number;
  startFrame?: number;
  className?: string;
  scrollDistance?: string;
}

/**
 * High-Performance JPG Sequence Scroller
 * Implements Canvas-based rendering to avoid layout thrashing.
 * Preloads assets with a buffer threshold for immediate interactivity.
 */
export const JPGSequenceScroller: React.FC<JPGSequenceScrollerProps> = ({
  directory,
  frameCount,
  fileNamePrefix,
  extension,
  padding,
  startFrame = 1,
  className = '',
  scrollDistance = '400%',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameIndex = useRef<number>(-1);
  
  const getFilePath = (index: number) => {
    const paddedIndex = String(index).padStart(padding, '0');
    return `${directory}/${fileNamePrefix}${paddedIndex}.${extension}`;
  };

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesRef.current[index] || index === lastFrameIndex.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img.complete) return;

    // Retina support & Scaling
    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    if (canvas.width !== canvasWidth * dpr || canvas.height !== canvasHeight * dpr) {
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Object-fit: cover implementation
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
    const y = (canvasHeight / 2) - (imgHeight / 2) * scale;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    ctx.restore();

    lastFrameIndex.current = index;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    const bufferThreshold = Math.floor(frameCount * 0.1); // 10% for faster start

    for (let i = startFrame; i < startFrame + frameCount; i++) {
      const img = new Image();
      img.src = getFilePath(i);
      
      const handleLoad = () => {
        loadedCount++;
        setLoadProgress((loadedCount / frameCount) * 100);
        
        if (loadedCount >= bufferThreshold && !isReady) {
          setIsReady(true);
        }
        
        // Initial paint when first frame is ready
        if (i === startFrame) renderFrame(0);
      };

      if (img.complete) {
        handleLoad();
      } else {
        img.onload = handleLoad;
      }
      
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      imagesRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current || !canvasRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: 0.1, // Slight lag for buttery smoothness
      onUpdate: (self) => {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(self.progress * (frameCount - 1))
        );
        requestAnimationFrame(() => renderFrame(frameIndex));
      },
    });

    const handleResize = () => {
        lastFrameIndex.current = -1; // Force re-render
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(st.progress * (frameCount - 1))
        );
        renderFrame(frameIndex);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      st.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, [isReady]);

  // Initial paint when ready
  useEffect(() => {
    if (isReady) {
        requestAnimationFrame(() => renderFrame(0));
    }
  }, [isReady]);

  return (
    <div ref={containerRef} className={`relative w-full h-screen overflow-hidden bg-slate-950 ${className}`}>
        {!isReady && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-xl">
                <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6" />
                <div className="text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase">
                    Neural Sequence Loading {Math.round(loadProgress)}%
                </div>
            </div>
        )}
        <canvas 
            ref={canvasRef} 
            className="w-full h-full block will-change-transform"
            style={{ opacity: isReady ? 1 : 0, transition: 'opacity 1s ease-in-out' }}
        />
    </div>
  );
};
