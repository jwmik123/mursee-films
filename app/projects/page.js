"use client";

import { useState, useEffect, useRef } from "react";
import { fetchData } from "@/lib/sanity";
import MuxPlayer from "@mux/mux-player-react";
import { gsap } from "gsap";

// Define the query for film data including duration and proper Mux video data
const filmQuery = `*[_type == "film"] {
  _id,
  title,
  "slug": slug.current,
  category,
  description,
  year,
  client,
  "imageUrl": image.asset->url,
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

export default function ProjectsPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("LIST"); // GRID or LIST
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [currentBgVideo, setCurrentBgVideo] = useState(null);
  const [previousBgVideo, setPreviousBgVideo] = useState(null);

  // Refs for GSAP animations
  const currentVideoRef = useRef(null);
  const previousVideoRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const loadFilms = async () => {
      try {
        const filmsData = await fetchData(filmQuery);
        console.log("Films data:", filmsData); // Debug log

        // Debug: Check video data specifically
        filmsData.forEach((film, index) => {
          console.log(`Film ${index + 1} (${film.title}):`, {
            hasPreviewVideo: !!film.previewVideo,
            previewVideo: film.previewVideo,
            playbackId: film.previewVideo?.playbackId,
            status: film.previewVideo?.status,
            duration: film.duration,
            fullVideoData: film.fullVideo?.data,
          });
        });

        setFilms(filmsData);
      } catch (error) {
        console.error("Error fetching films:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFilms();
  }, []);

  // Handle background video changes
  useEffect(() => {
    console.log("Hover effect triggered:", {
      hoveredProject: hoveredProject?.title,
      hasPreviewVideo: !!hoveredProject?.previewVideo,
      playbackId: hoveredProject?.previewVideo?.playbackId,
      currentBgVideo,
      previousBgVideo,
    });

    if (
      hoveredProject &&
      hoveredProject.previewVideo &&
      hoveredProject.previewVideo.playbackId
    ) {
      console.log(
        "Setting background video:",
        hoveredProject.previewVideo.playbackId
      );
      // Only change if the video is different
      if (currentBgVideo !== hoveredProject.previewVideo.playbackId) {
        // Clean up previous video immediately
        setPreviousBgVideo(null);
        // Set new current video immediately without transition
        setCurrentBgVideo(hoveredProject.previewVideo.playbackId);
      }
    } else {
      console.log("Clearing background video");
      // When not hovering, fade out current video with animation
      if (currentBgVideo) {
        // Animate fade out of current video before clearing it
        if (currentVideoRef.current) {
          gsap.to(currentVideoRef.current, {
            opacity: 0,
            scale: 1.05,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
              // Clear current video
              setCurrentBgVideo(null);
              setPreviousBgVideo(null);
            },
          });

          // Also animate overlay back to normal
          gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          });
        } else {
          // Fallback if ref is not available
          setCurrentBgVideo(null);
          setPreviousBgVideo(null);
        }
      }
    }
  }, [hoveredProject]);

  // Handle initial video load - immediate display
  useEffect(() => {
    if (currentVideoRef.current && currentBgVideo) {
      // Set video to visible immediately
      gsap.set(currentVideoRef.current, {
        opacity: 0.6,
        scale: 1,
      });
    }
  }, [currentBgVideo]);

  // Calculate category counts
  const getCategoryCounts = () => {
    const counts = {
      ALL: films.length,
      COMMERCIAL: films.filter((f) =>
        f.category?.toLowerCase().includes("commercial")
      ).length,
      BEDRIJFSFILM: films.filter((f) =>
        f.category?.toLowerCase().includes("bedrijfsfilm")
      ).length,
      SOCIAL: films.filter(
        (f) =>
          f.category?.toLowerCase().includes("social-video") ||
          f.category?.toLowerCase().includes("social")
      ).length,
    };
    return counts;
  };

  // Filter films based on active filter
  const getFilteredFilms = () => {
    if (activeFilter === "ALL") return films;

    return films.filter((film) => {
      const category = film.category?.toLowerCase() || "";
      switch (activeFilter) {
        case "COMMERCIAL":
          return category.includes("commercial");
        case "BEDRIJFSFILM":
          return category.includes("bedrijfsfilm");
        case "SOCIAL":
          return (
            category.includes("social-video") || category.includes("social")
          );
        default:
          return true;
      }
    });
  };

  // Format duration from Mux video data (comes as seconds)
  const formatDuration = (duration) => {
    if (!duration) return "00:00";

    // If it's already in mm:ss format, return as is
    if (typeof duration === "string" && duration.includes(":")) {
      return duration;
    }

    // If it's in seconds (from Mux), convert to mm:ss
    if (typeof duration === "number") {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    return "00:00";
  };

  const counts = getCategoryCounts();
  const filteredFilms = getFilteredFilms();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl font-light text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white px-5 md:px-10 py-8">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 min-h-full overflow-hidden">
        {/* Current Video */}
        {currentBgVideo && (
          <MuxPlayer
            ref={currentVideoRef}
            playbackId={currentBgVideo}
            autoPlay
            muted
            thumbnailTime="0"
            loop
            playsInline
            controls={false}
            nohotkeys
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              width: "100%",
              // height: "100%",
              objectFit: "cover",
              opacity: 1,
            }}
            onError={(e) => {
              console.error("Current video error:", e);
              console.error(
                "Failed to load video with playbackId:",
                currentBgVideo
              );
            }}
            onLoadStart={() =>
              console.log("Current video load started:", currentBgVideo)
            }
            onCanPlay={() =>
              console.log("Current video can play:", currentBgVideo)
            }
          />
        )}

        {/* Dark overlay for better text readability */}
        {/* <div ref={overlayRef} className="absolute inset-0 bg-black/40" /> */}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-16 pt-16 md:pt-32">
          <h1 className="text-6xl uppercase md:text-8xl font-bold text-white mb-2">
            Projecten
          </h1>
        </div>

        {/* Navigation and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          {/* View Toggle */}
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveView("GRID")}
              className={`text-lg font-medium transition-colors ${
                activeView === "GRID"
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              GRID
            </button>
            <button
              onClick={() => setActiveView("LIST")}
              className={`text-lg font-medium transition-colors ${
                activeView === "LIST"
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              LIST
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex space-x-6">
            {Object.entries(counts).map(([category, count]) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`text-lg transition-colors ${
                  activeFilter === category
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {category} <span className="text-sm">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeView === "LIST" ? (
          <div
            className="space-y-1"
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-8 pb-4 border-b border-gray-800">
              <div className="text-gray-400 text-sm font-medium">NAME</div>
              <div className="text-gray-400 text-sm font-medium">CLIENT</div>
              <div className="text-gray-400 text-sm font-medium text-right">
                DURATION
              </div>
            </div>

            {/* Table Rows */}
            {filteredFilms.map((film) => (
              <a
                key={film._id}
                href={`/projects/${film.slug}`}
                className="relative grid grid-cols-3 gap-8 py-2 border-b border-gray-900 transition-colors group overflow-hidden"
                onMouseEnter={() => setHoveredProject(film)}
                style={{
                  position: "relative",
                }}
              >
                {/* White background animation from bottom to top */}
                <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />

                <div className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
                  {film.title}
                </div>
                <div className="relative z-10 text-gray-400 group-hover:text-gray-700 transition-colors duration-300">
                  {film.client || "—"}
                </div>
                <div className="relative z-10 text-gray-400 group-hover:text-gray-700 transition-colors duration-300 text-right">
                  {formatDuration(film.duration)}
                </div>
              </a>
            ))}

            {filteredFilms.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No projects found for this category.
              </div>
            )}
          </div>
        ) : (
          // Grid view (placeholder for now)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFilms.map((film) => (
              <a
                key={film._id}
                href={`/projects/${film.slug}`}
                className="group"
              >
                <div className="aspect-video bg-gray-800 rounded-lg mb-3 overflow-hidden">
                  {film.imageUrl && (
                    <img
                      src={film.imageUrl}
                      alt={film.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-white group-hover:text-gray-300 transition-colors">
                    {film.title}
                  </h3>
                  <span className="text-gray-400 text-sm">
                    {formatDuration(film.duration)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
