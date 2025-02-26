// app/utils/animationUtils.js
"use client";

import { gsap } from "gsap";

// Helper function to get viewport dimensions
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

// Create a smooth page transition with a white overlay
export const createPageTransition = (duration = 0.5) => {
  // Create overlay element
  const overlay = document.createElement("div");
  document.body.appendChild(overlay);

  // Style the overlay
  gsap.set(overlay, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0a0a",
    zIndex: 9999,
    opacity: 0,
  });

  // Animation timeline
  const tl = gsap.timeline();

  // Fade in
  tl.to(overlay, {
    opacity: 1,
    duration: duration,
    ease: "power2.inOut",
  });

  // Return the timeline and overlay for further manipulation
  return { tl, overlay };
};

// Helper function to calculate center position
export const calculateCenterPosition = (element) => {
  const rect = element.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return {
    x: viewportWidth / 2 - rect.width / 2,
    y: viewportHeight / 2 - rect.height / 2,
  };
};

// Calculate how large the image should be in fullscreen mode while maintaining aspect ratio
export const calculateFullscreenDimensions = (
  originalWidth,
  originalHeight,
  padding = 0
) => {
  const viewportWidth = window.innerWidth - padding * 2;
  const viewportHeight = window.innerHeight - padding * 2;
  const aspectRatio = originalWidth / originalHeight;

  let width, height;

  if (viewportWidth / viewportHeight > aspectRatio) {
    // Viewport is wider than the image's aspect ratio
    height = viewportHeight;
    width = height * aspectRatio;
  } else {
    // Viewport is taller than the image's aspect ratio
    width = viewportWidth;
    height = width / aspectRatio;
  }

  return { width, height };
};
