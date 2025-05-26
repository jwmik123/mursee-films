import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenis() {
  const lenisRef = useRef();

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return;

    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Create animation frame
    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    // Start animation frame
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return lenisRef;
}
