"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

const MediaPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const containerRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className=" relative w-full  overflow-hidden p-2">
      <span className="absolute w-3 h-3 border-t border-l border-white top-0 left-0  group-hover:-top-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="absolute w-3 h-3 border-t border-r border-white top-0 right-0  group-hover:-top-1  group-hover:-right-1 transition-all duration-300"></span>
      <span className="absolute w-3 h-3 border-b border-l border-white bottom-0 left-0  group-hover:-bottom-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="absolute w-3 h-3 border-b border-r border-white bottom-0 right-0  group-hover:-bottom-1 group-hover:-right-1 transition-all duration-300"></span>
      <div className="relative overflow-hidden">
        <div className="relative h-full">
          <video
            ref={previewVideoRef}
            autoPlay
            muted
            loop
            className={`w-full object-cover ${isPlaying ? "hidden" : "block"}`}
          >
            <source src="/placeholder-reel.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <video
          ref={videoRef}
          loop
          className={`w-full ${isPlaying ? "block" : "hidden"}`}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src="/showreel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Play overlay */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {/* <Play className="w-10 h-10" /> */}
          {/* <span className="font-tinos">Bekijk onze showreel</span> */}
          <svg
            width="64"
            height="64"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 29.3334C23.3638 29.3334 29.3333 23.3638 29.3333 16C29.3333 8.63622 23.3638 2.66669 16 2.66669C8.6362 2.66669 2.66667 8.63622 2.66667 16C2.66667 23.3638 8.6362 29.3334 16 29.3334Z"
              fill="black"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 12.6667L19 16L14 19.3334V12.6667Z"
              fill="white"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Controls - Only show when playing */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0  p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
            </div>

            <button
              onClick={handleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Maximize2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPlayer;
