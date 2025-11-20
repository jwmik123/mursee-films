"use client";

import { useState } from "react";
import OpenAnimation from "./OpenAnimation";
import CurtainsVideoTransition from "./CurtainsVideoTransition";

export default function HomeWithLoader({ films }) {
  const [loaderComplete, setLoaderComplete] = useState(false);

  return (
    <div className="relative">
      {/* Main content - always visible */}
      <main className="min-h-[100svh] overflow-hidden">
        <CurtainsVideoTransition projects={films} transitionType="perlinLine" />
      </main>

      {/* Loader overlay - slides up when complete */}
      {!loaderComplete && (
        <OpenAnimation onComplete={() => setLoaderComplete(true)} />
      )}
    </div>
  );
}
