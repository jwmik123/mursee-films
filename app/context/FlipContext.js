"use client";

import { createContext, useContext, useState } from "react";

const FlipContext = createContext();

export function FlipProvider({ children }) {
  const [flipState, setFlipState] = useState({
    activeProjectId: null,
    elementRect: null,
  });

  return (
    <FlipContext.Provider value={{ flipState, setFlipState }}>
      {children}
    </FlipContext.Provider>
  );
}

export function useFlip() {
  return useContext(FlipContext);
}
