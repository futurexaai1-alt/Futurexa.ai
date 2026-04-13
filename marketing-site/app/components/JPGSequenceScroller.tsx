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
  const readyRef = useRef(false);
  const lastFrameIndex = useRef<number>(-1);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });
  
  const getFilePath = React.useCallback((index: number) => {
    const paddedIndex = String(index).padStart(padding, '0');
    return `${directory}/${fileNamePrefix}${paddedIndex}.${extension}`;
  }, [directory, extension, fileNamePrefix, padding]);

  const renderFrame = React.useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesRef.current[index] || index === lastFrameIndex.current) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: opaque canvas
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img.complete) return;

    const { width: canvasWidth, height: canvasHeight, dpr } = dimensionsRef.current;
    
    // Fallback if dimensions aren't set yet (rare)
    if (canvasWidth === 0) return;

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
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let loadedCount = 0;
    let disposed = false;
    let idleHandle: number | null = null;
    const images = new Array<HTMLImageElement>(frameCount);
    const bufferThreshold = Math.min(frameCount, Math.max(4, Math.ceil(frameCount * 0.08)));
    let lastReportedProgress = 0;

    const handleLoaded = (frame: number) => {
      if (disposed) return;
      loadedCount++;
      const currentProgress = (loadedCount / frameCount) * 100;
      if (currentProgress - lastReportedProgress >= 5 || loadedCount === frameCount) {
        setLoadProgress(currentProgress);
        lastReportedProgress = currentProgress;
      }
      if (loadedCount >= bufferThreshold && !readyRef.current) {
        readyRef.current = true;
        setIsReady(true);
      }
      if (frame === startFrame) renderFrame(0);
    };

    const preloadFrame = (frame: number, priority = false) => {
      const index = frame - startFrame;
      const img = new Image();
      img.decoding = 'async';
      if (priority) {
        (img as HTMLImageElement & { fetchPriority?: 'high' }).fetchPriority = 'high';
      }
      img.src = getFilePath(frame);
      if (img.complete) {
        handleLoaded(frame);
      } else {
        img.onload = () => handleLoaded(frame);
      }
      images[index] = img;
    };

    const criticalFrames = Math.min(frameCount, 8);
    for (let i = 0; i < criticalFrames; i++) {
      preloadFrame(startFrame + i, true);
    }

    let cursor = criticalFrames;
    const scheduleRemaining = () => {
      if (disposed || cursor >= frameCount) return;
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback((deadline) => {
          while (cursor < frameCount && deadline.timeRemaining() > 4) {
            preloadFrame(startFrame + cursor);
            cursor++;
          }
          scheduleRemaining();
        });
        return;
      }
      idleHandle = window.setTimeout(() => {
        for (let i = 0; i < 4 && cursor < frameCount; i++) {
          preloadFrame(startFrame + cursor);
          cursor++;
        }
        scheduleRemaining();
      }, 16);
    };
    scheduleRemaining();

    imagesRef.current = images;

    return () => {
      disposed = true;
      if (idleHandle !== null) {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleHandle);
        } else {
          clearTimeout(idleHandle);
        }
      }
      imagesRef.current = [];
      readyRef.current = false;
    };
  }, [frameCount, getFilePath, renderFrame, startFrame]);

  useEffect(() => {
    if (!isReady) return;

    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      dimensionsRef.current = { width, height, dpr };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };

    updateDimensions();

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: 0.1,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(self.progress * (frameCount - 1))
        );
        renderFrame(frameIndex);
      },
    });

    const handleResize = () => {
        updateDimensions();
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
  }, [isReady, frameCount, scrollDistance, renderFrame]);

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
