"use client";

import { useState, useEffect, useRef, use } from "react";
import { fetchData } from "@/lib/sanity";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Import media-chrome React components
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
} from "media-chrome/react";
import HlsVideo from "hls-video-element/react";

// Query to fetch a single film by slug
const filmQuery = `*[_type == "film" && slug.current == $slug][0] {
  _id,
  title,
  category,
  description,
  year,
  client,
  "imageUrl": image.asset->url,
  "stills": stills[]{
    "url": asset->url,
    "alt": asset->altText
  },
  "previewVideo": previewVideo.asset->{
    _id,
    assetId,
    playbackId,
    status,
    data
  },
  "fullVideo": fullVideo.asset->{
    _id,
    assetId,
    playbackId,
    status,
    data
  },
  "duration": fullVideo.asset->data.duration
}`;

export default function ProjectDetailPage({ params }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);

  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);
  const titleRef = useRef(null);
  const stillsRef = useRef(null);
  const videoElementRef = useRef(null);

  useEffect(() => {
    const loadFilm = async () => {
      try {
        const filmData = await fetchData(filmQuery, {
          slug: resolvedParams.slug,
        });
        console.log("Film data:", filmData);
        setFilm(filmData);
      } catch (error) {
        console.error("Error fetching film:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFilm();
  }, [resolvedParams.slug]);

  // Video event handlers
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [film]);

  // GSAP animations
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          },
        }
      );
    }

    if (stillsRef.current) {
      const stillItems = stillsRef.current.querySelectorAll(".still-item");
      gsap.fromTo(
        stillItems,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stillsRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );
    }
  }, [film]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl font-light text-white">Loading...</div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl font-light text-white">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fullscreen Video Player */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Simple Media Chrome Player */}
        <MediaController
          ref={playerRef}
          className="absolute inset-0 w-full h-full"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <HlsVideo
            ref={videoElementRef}
            slot="media"
            src={`https://stream.mux.com/${film.fullVideo?.playbackId}.m3u8`}
            preload="auto"
            muted
            crossOrigin=""
            playsInline
            className="w-full h-full object-cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              console.error("Video error:", e);
            }}
          />
          <MediaControlBar>
            <MediaPlayButton></MediaPlayButton>
            <MediaSeekBackwardButton></MediaSeekBackwardButton>
            <MediaSeekForwardButton></MediaSeekForwardButton>
            <MediaTimeRange></MediaTimeRange>
            <MediaTimeDisplay showDuration></MediaTimeDisplay>
            <MediaMuteButton></MediaMuteButton>
            <MediaVolumeRange></MediaVolumeRange>
          </MediaControlBar>
        </MediaController>

        {/* Back Button Overlay */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => window.history.back()}
            className="text-white hover:text-gray-300 transition-colors bg-black/50 backdrop-blur-sm rounded-full p-3"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Project Information Section */}
      <div ref={titleRef} className="px-5 md:px-10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Left Column - Title and Description */}
            <div>
              <h1 className="text-4xl md:text-6xl font-franklin uppercase tracking-wider mb-6">
                {film.title}
              </h1>
              {film.description && (
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-tinos">
                  {film.description}
                </p>
              )}
            </div>

            {/* Right Column - Project Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2 font-franklin">
                  Client
                </h3>
                <p className="text-xl font-tinos">{film.client}</p>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2 font-franklin">
                  Category
                </h3>
                <p className="text-xl font-tinos capitalize">
                  {film.category?.replace("-", " ")}
                </p>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2 font-franklin">
                  Year
                </h3>
                <p className="text-xl font-tinos">{film.year}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stills Gallery */}
      {film.stills && film.stills.length > 0 && (
        <div
          ref={stillsRef}
          className="px-5 md:px-10 py-16 md:py-24 bg-gray-900"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-franklin uppercase tracking-wider mb-12 text-center">
              Stills
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {film.stills.map((still, index) => (
                <div key={index} className="still-item group cursor-pointer">
                  <div className="aspect-video overflow-hidden rounded-lg bg-gray-800">
                    <Image
                      src={still.url}
                      alt={still.alt || `Still ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
