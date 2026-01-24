"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MediaController } from "media-chrome/react";
import HlsVideo from "hls-video-element/react";

const PROJECT_ID = "4cc9423d-5ae7-42c8-ba8f-2cfd8e78f2b5";

export default function FloatingProject() {
  const [project, setProject] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 24, y: 144 });
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const query = `*[_type == "film" && _id == "${PROJECT_ID}"][0] {
          _id,
          title,
          "slug": slug.current,
          "previewVideo": previewVideo.asset->{
            playbackId
          }
        }`;

        const res = await fetch(
          `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2025-02-13/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setProject(data.result);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest("button")) return;

    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = {
      x: e.clientX + position.x,
      y: e.clientY + position.y,
    };
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    hasDraggedRef.current = true;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newX = Math.max(0, Math.min(window.innerWidth - rect.width, dragStartRef.current.x - e.clientX));
    const newY = Math.max(0, Math.min(window.innerHeight - rect.height, dragStartRef.current.y - e.clientY));

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleClick = () => {
    if (hasDraggedRef.current) return;
    if (project?.slug) {
      router.push(`/projecten/${project.slug}`);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!project || !isVisible) return null;

  const playbackId = project.previewVideo?.playbackId;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        right: position.x,
        bottom: position.y,
      }}
      className={`fixed z-50 bg-black rounded-lg overflow-hidden shadow-2xl w-72 select-none hidden md:block ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
        aria-label="Close"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {playbackId && (
        <MediaController className="w-full aspect-video pointer-events-none">
          <HlsVideo
            ref={videoRef}
            slot="media"
            src={`https://stream.mux.com/${playbackId}.m3u8`}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </MediaController>
      )}

      <div className="p-3 cursor-pointer hover:bg-white/10 transition-colors">
        <p className="text-white font-franklin text-sm uppercase tracking-wider flex items-center gap-2">
          {project.title}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
            <path d="M4.5 2H2.5C1.95 2 1.5 2.45 1.5 3V9.5C1.5 10.05 1.95 10.5 2.5 10.5H9C9.55 10.5 10 10.05 10 9.5V7.5M7 1.5H10.5M10.5 1.5V5M10.5 1.5L5 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </p>
      </div>
    </div>
  );
}
