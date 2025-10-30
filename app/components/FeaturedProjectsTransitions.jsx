"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import VideoTransition from "./VideoTransition";
import Hls from "hls.js";

const FeaturedProjectsHeroWithTransitions = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const videoRefs = useRef([]);
  const contentRef = useRef(null);
  const touchStartRef = useRef(0);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredProjects = projects?.filter(p => p.featured).slice(0, 4) || [];
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : (projects?.slice(0, 4) || []);

  const handleWheel = (e) => {
    if (isNavigatingRef.current || isTransitioning) {
      return;
    }

    isNavigatingRef.current = true;
    const direction = e.deltaY > 0 ? 1 : -1;
    navigateProject(direction);
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isNavigatingRef.current || isTransitioning) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) > 50) {
      isNavigatingRef.current = true;
      const direction = diff > 0 ? 1 : -1;
      navigateProject(direction);
    }
  };

  const navigateProject = (direction) => {
    setIsScrolling(true);
    setIsTransitioning(true);

    const newIndex = (currentIndex + direction + displayProjects.length) % displayProjects.length;
    setNextIndex(newIndex);

    console.log(`Transitioning from ${currentIndex} to ${newIndex}`);

    // Fade out content
    gsap.to(contentRef.current, {
      opacity: 0,
      y: direction > 0 ? -20 : 20,
      duration: 0.4,
      ease: "power2.inOut",
    });

    // Animate the WebGPU transition
    const progressObj = { progress: 0 };
    gsap.to(progressObj, {
      progress: 1,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: function() {
        setTransitionProgress(progressObj.progress);
      },
      onComplete: () => {
        // Transition complete
        setCurrentIndex(newIndex);
        setTransitionProgress(0);
        setIsTransitioning(false);

        // Fade in new content
        if (contentRef.current) {
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

                setTimeout(() => {
                  isNavigatingRef.current = false;
                }, 500);
              }
            }
          );
        } else {
          setIsScrolling(false);
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 500);
        }
      }
    });
  };

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
  const nextProject = displayProjects[nextIndex];

  useEffect(() => {
    const container = document.querySelector('[data-wheel-container]');
    if (!container) return;

    const wheelHandler = (e) => {
      e.preventDefault();
      handleWheel(e);
    };

    // Add with { passive: false } to allow preventDefault
    container.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, [isTransitioning, currentIndex, displayProjects.length]);

  return (
    <div
      data-wheel-container
      className="relative h-screen w-full bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hidden Video Elements - These feed the WebGPU transition */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.01 }}>
        {displayProjects.map((project, index) => (
          <div key={project._id} className="w-full h-full">
            {mounted && project.previewVideo?.playbackId && (
              <video
                ref={(el) => {
                  if (el && !el._hlsInstance) {
                    videoRefs.current[index] = el;
                    console.log(`[FeaturedProjectsTransitions] Video ref ${index} set:`, el, 'isHTMLVideo:', el instanceof HTMLVideoElement);

                    // Initialize HLS.js for native video element
                    if (Hls.isSupported()) {
                      const hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: false,
                      });
                      hls.loadSource(`https://stream.mux.com/${project.previewVideo.playbackId}.m3u8`);
                      hls.attachMedia(el);

                      hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        console.log(`[FeaturedProjectsTransitions] Video ${index} HLS manifest loaded`);
                        el.play().catch(e => console.log('Autoplay prevented:', e));
                      });

                      // Store HLS instance for cleanup
                      el._hlsInstance = hls;
                    } else if (el.canPlayType('application/vnd.apple.mpegurl')) {
                      // Native HLS support (Safari)
                      el.src = `https://stream.mux.com/${project.previewVideo.playbackId}.m3u8`;
                      el.load();
                      console.log(`[FeaturedProjectsTransitions] Video ${index} using native HLS`);
                    }
                  } else if (el === null) {
                    // Cleanup when element is unmounted
                    const oldVideo = videoRefs.current[index];
                    if (oldVideo?._hlsInstance) {
                      oldVideo._hlsInstance.destroy();
                      delete oldVideo._hlsInstance;
                    }
                    videoRefs.current[index] = null;
                  }
                }}
                autoPlay
                muted
                loop
                playsInline
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* WebGPU Video Transition Canvas */}
      {mounted && videoRefs.current[currentIndex] && videoRefs.current[nextIndex] && (() => {
        const video1 = videoRefs.current[currentIndex];
        const video2 = videoRefs.current[nextIndex];

        console.log('[FeaturedProjectsTransitions] Rendering VideoTransition:', {
          currentIndex,
          nextIndex,
          hasVideo1: !!video1,
          hasVideo2: !!video2,
          video1Src: video1?.src,
          video2Src: video2?.src,
          video1ReadyState: video1?.readyState,
          video2ReadyState: video2?.readyState,
          transitionProgress
        });
        return (
          <VideoTransition
            video1={video1}
            video2={video2}
            progress={transitionProgress}
            transitionType="dissolve" // Can be 'dissolve', 'wipe', or 'slide'
          />
        );
      })()}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-2xl mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-franklin uppercase">
            {currentProject.title}
          </h1>

          {currentProject.client && (
            <p className="text-sm md:text-base text-white/70 uppercase tracking-wider font-franklin">
              Client: {currentProject.client}
            </p>
          )}
        </div>
      </div>

      {/* Project Indicator */}
      <div className="absolute bottom-8 md:bottom-12 right-8 md:right-12 z-20">
        <div className="flex flex-col items-end space-y-2">
          <div className="text-white text-2xl md:text-3xl font-franklin">
            {String(currentIndex + 1).padStart(2, '0')} / {String(displayProjects.length).padStart(2, '0')}
          </div>

          <div className="flex space-x-2">
            {displayProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isScrolling && !isTransitioning && index !== currentIndex) {
                    const direction = index > currentIndex ? 1 : -1;
                    navigateProject(direction);
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

      {/* Scroll hint */}
      {currentIndex === 0 && !isTransitioning && (
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

export default FeaturedProjectsHeroWithTransitions;