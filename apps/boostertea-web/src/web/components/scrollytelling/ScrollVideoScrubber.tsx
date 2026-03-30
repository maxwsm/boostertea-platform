'use client';

import React, { useRef, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';

interface ScrollVideoScrubberProps {
  src: string;
  poster?: string;
  durationSeconds: number; // Maximum length of the clip to scrub
  className?: string; // Container classes (like aspect-ratio, rounding)
  playbackRate?: number; // Adjust if scrolling feels too fast/slow
}

/**
 * ScrollVideoScrubber 
 * A core module for "Scrollytelling".
 * As the user scrolls vertically through this component's bounding box,
 * it scrubs the video's currentTime forward or backward.
 */
export const ScrollVideoScrubber: React.FC<ScrollVideoScrubberProps> = ({
  src,
  poster,
  durationSeconds,
  className = "w-full aspect-video rounded-3xl overflow-hidden",
  playbackRate = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // useScroll tracks the progress of the container as it passes through the viewport.
  // 0 = top of container meets bottom of viewport. 
  // 1 = bottom of container meets top of viewport.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Map the 0-1 scroll progress to video time (e.g. 0 to 10 seconds).
  const timeTransform = useTransform(scrollYProgress, [0, 1], [0, durationSeconds * playbackRate]);

  useEffect(() => {
    // Subscribe to Framer Motion's calculated time transform
    const unsubscribe = timeTransform.on("change", (latestTime) => {
      if (videoRef.current) {
        // To ensure smooth scrubbing, we use requestAnimationFrame implicitly
        // by setting currentTime. Browser decoders handle WebM smoothly.
        // Cap it to prevent exceeding actual video buffer.
        videoRef.current.currentTime = Math.min(Math.max(latestTime, 0), videoRef.current.duration || durationSeconds);
      }
    });

    return () => unsubscribe();
  }, [timeTransform, durationSeconds]);

  return (
    // We make the container taller than the video (using h-[200vh]) to give the user 
    // physical "scroll space" to scrub through the video. The video itself is sticky.
    <div ref={containerRef} className="relative w-full h-[150vh] my-12">
      <div className="sticky top-1/2 -translate-y-1/2 w-full">
        <div className={`relative bg-black ${className} shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            preload="metadata"
            playsInline
            muted
            // DO NOT autoPlay; we are manually scrubbing
          />
          
          {/* Glassmorphism UX overlay to hint at interaction */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white/50 tracking-widest text-xs uppercase">
              Скроль, щоб керувати часом
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
