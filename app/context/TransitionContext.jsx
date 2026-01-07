"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [transitionLabel, setTransitionLabel] = useState("");
  const [showLabel, setShowLabel] = useState(false);
  const timeoutRef = useRef(null);

  const setTransitionLabelWithTiming = (label) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set the new label but don't show it yet
    setTransitionLabel(label);
    setShowLabel(false);

    // Show after 0.5 seconds
    setTimeout(() => {
      setShowLabel(true);
    }, 500);

    // Hide after 0.8 seconds total (0.5s delay + 0.3s visible)
    timeoutRef.current = setTimeout(() => {
      setShowLabel(false);
    }, 2000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TransitionContext.Provider value={{
      transitionLabel,
      showLabel,
      setTransitionLabel: setTransitionLabelWithTiming
    }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return context;
}
