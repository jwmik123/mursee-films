"use client";

import { createContext, useContext } from "react";
import { useLenis } from "@/hooks/useLenis";

const LenisContext = createContext({});

export function LenisProvider({ children }) {
  const lenisRef = useLenis();

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}

export const useLenisInstance = () => {
  return useContext(LenisContext);
};
