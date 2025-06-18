"use client";

import { useState, useEffect, useRef, use } from "react";
import { fetchData } from "@/lib/sanity";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./media-player.module.css";

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

// Query to fetch all films for navigation
const allFilmsQuery = `*[_type == "film"] | order(_createdAt asc) {
  _id,
  title,
  "slug": slug.current
}`;

export default function ProjectDetailPage({ params }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);

  const [film, setFilm] = useState(null);
  const [allFilms, setAllFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);
  const titleRef = useRef(null);
  const stillsRef = useRef(null);
  const videoElementRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both the current film and all films for navigation
        const [filmData, allFilmsData] = await Promise.all([
          fetchData(filmQuery, { slug: resolvedParams.slug }),
          fetchData(allFilmsQuery),
        ]);

        console.log("Film data:", filmData);
        console.log("All films:", allFilmsData);

        setFilm(filmData);
        setAllFilms(allFilmsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
        { y: 50, opacity: 0 },
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

  // Calculate next project for navigation
  const currentIndex = allFilms.findIndex(
    (p) => p.slug === resolvedParams.slug
  );
  const nextIndex =
    currentIndex !== -1 ? (currentIndex + 1) % allFilms.length : 0;
  const nextProject = allFilms[nextIndex];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Project Information Section */}
      <div ref={titleRef} className="px-5 md:px-10 pb-16 pt-44">
        <div className="container mx-auto">
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
            <div className="space-y-8 md:text-right">
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
      {/* Video Player */}
      <div className="relative w-full overflow-hidden bg-black">
        {/* Simple Media Chrome Player */}
        <MediaController
          ref={playerRef}
          className={`w-full ${styles.mediaController}`}
          breakpoints="sm:384 md:576 lg:768 xl:960"
          style={{
            width: "100%",
            aspectRatio: "16/9",
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
            className="w-full h-full"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
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
        {/* <div className="absolute top-6 left-6 z-20">
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
        </div> */}
      </div>

      {/* Stills Gallery */}
      {film.stills && film.stills.length > 0 && (
        <div ref={stillsRef} className="px-5 md:px-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6 md:gap-8">
              {film.stills.map((still, index) => (
                <div key={index} className="still-item group cursor-pointer">
                  <div className="aspect-video overflow-hidden bg-gray-800">
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

      {/* Next Project Section */}
      {nextProject && (
        <div
          className="w-full bg-black text-white py-24 cursor-pointer hover:bg-white hover:text-black transition-colors duration-300"
          onClick={() => {
            window.location.href = `/projects/${nextProject.slug}`;
          }}
        >
          <div className="container mx-auto px-5 md:px-10 text-right">
            <p className="text-sm uppercase tracking-wider text-gray-400 mb-2 font-franklin">
              Volgende Project
            </p>
            <h2 className="text-4xl md:text-6xl font-franklin uppercase tracking-wider">
              {nextProject.title}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
