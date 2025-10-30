"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MediaController } from "media-chrome/react";
import HlsVideo from "hls-video-element/react";

const FeaturedProjectsHero = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRefs = useRef([]);
  const contentRef = useRef(null);
  const touchStartRef = useRef(0);
  const isNavigatingRef = useRef(false);

  // Prevent hydration mismatch by only rendering videos after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter only featured projects (limit to 4)
  // Fallback to first 4 projects if no featured projects are set
  const featuredProjects = projects?.filter(p => p.featured).slice(0, 4) || [];
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : (projects?.slice(0, 4) || []);

  // Handle scroll/wheel events - immediate response with proper locking
  const handleWheel = (e) => {
 
    // Strict check: if currently navigating, ignore all scroll events
    if (isNavigatingRef.current) {
      console.log("Navigation in progress, ignoring scroll");
      return;
    }

    console.log("Scroll detected, starting navigation");

    // Set the lock immediately
    isNavigatingRef.current = true;

    // Trigger navigation immediately - only move by 1 project
    const direction = e.deltaY > 0 ? 1 : -1;
    navigateProject(direction);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isNavigatingRef.current) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;

    // Require significant swipe (at least 50px)
    if (Math.abs(diff) > 50) {
      isNavigatingRef.current = true;
      const direction = diff > 0 ? 1 : -1;
      navigateProject(direction);
    }
  };

  // Navigate to next/previous project
  const navigateProject = (direction) => {
    setIsScrolling(true);

    const newIndex = (currentIndex + direction + displayProjects.length) % displayProjects.length;

    console.log(`Navigating from ${currentIndex} to ${newIndex}`);

    // Fade out current content
    gsap.to(contentRef.current, {
      opacity: 0,
      y: direction > 0 ? -20 : 20,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        setCurrentIndex(newIndex);

        // Fade in new content
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: direction > 0 ? 20 : -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              setIsScrolling(false);

              // Release the navigation lock after a small delay
              setTimeout(() => {
                isNavigatingRef.current = false;
                console.log("Navigation lock released");
              }, 500); // Additional 500ms cooldown after animation
            }
          }
        );
      }
    });
  };

  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, displayProjects.length);
  }, [displayProjects.length]);

  if (!displayProjects || displayProjects.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <p className="text-white text-xl">No projects available</p>
      </div>
    );
  }

  const currentProject = displayProjects[currentIndex];

  return (
    <div
      className="relative h-screen w-full bg-black overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Backgrounds */}
      {displayProjects.map((project, index) => (
        <div
          key={project._id}
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            pointerEvents: index === currentIndex ? "auto" : "none",
          }}
        >
          {mounted && project.previewVideo?.playbackId && (
            <MediaController
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-full h-full relative"
            >
              <HlsVideo
                slot="media"
                src={`https://stream.mux.com/${project.previewVideo.playbackId}.m3u8`}
                autoPlay
                muted
                loop
                playsInline
                crossOrigin=""
                className="h-full w-[177.77777778vh] absolute min-w-full min-h-[56.25vw] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </MediaController>
          )}
        </div>
      ))}

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
        {/* Bottom Left: Project Info */}
        <div className="max-w-2xl mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-franklin uppercase">
            {currentProject.title}
          </h1>

          {/* {currentProject.description && (
            <p className="text-lg md:text-xl text-white/90 mb-4 font-tinos">
              {currentProject.description}
            </p>
          )} */}

          {currentProject.client && (
            <p className="text-sm md:text-base text-white/70 uppercase tracking-wider font-franklin">
              Client: {currentProject.client}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Right: Project Indicator */}
      <div className="absolute bottom-8 md:bottom-12 right-8 md:right-12 z-20">
        <div className="flex flex-col items-end space-y-2">
          <div className="text-white text-2xl md:text-3xl font-franklin">
            {String(currentIndex + 1).padStart(2, '0')} / {String(displayProjects.length).padStart(2, '0')}
          </div>

          {/* Dots indicator */}
          <div className="flex space-x-2">
            {displayProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isScrolling && index !== currentIndex) {
                    const direction = index > currentIndex ? 1 : -1;
                    navigateProject(direction * Math.abs(index - currentIndex));
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint (only show on first project) */}
      {currentIndex === 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center text-white/60 text-sm font-franklin">
            <span className="mb-2">Scroll</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProjectsHero;
