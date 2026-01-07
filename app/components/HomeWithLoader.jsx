"use client";

import { useState, useEffect } from "react";
import OpenAnimation from "./OpenAnimation";
import CurtainsVideoTransition from "./CurtainsVideoTransition";

export default function HomeWithLoader({ films }) {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Check if the animation has been shown before in this session
    const hasSeenAnimation = sessionStorage.getItem("hasSeenOpenAnimation");

    if (!hasSeenAnimation) {
      setShowLoader(true);
      // Mark as seen in sessionStorage
      sessionStorage.setItem("hasSeenOpenAnimation", "true");
    } else {
      // Skip the animation
      setLoaderComplete(true);
    }
  }, []);

  return (
    <div className="relative">
      {/* Main content - always visible */}
      <main className="min-h-[100svh] overflow-hidden">
        <CurtainsVideoTransition projects={films} transitionType="perlinLine" />
      </main>

      {/* Loader overlay - slides up when complete */}
      {showLoader && !loaderComplete && (
        <OpenAnimation onComplete={() => setLoaderComplete(true)} />
      )}
    </div>
  );
}
