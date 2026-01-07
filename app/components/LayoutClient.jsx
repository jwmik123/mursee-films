"use client";

import { TransitionProvider, useTransition } from "@/app/context/TransitionContext";
import { LenisProvider } from "@/providers/LenisProvider";
import SimpleNavigation from "./SimpleNavigation";
import Footer from "./Footer";
import TitleOnBlur from "./TitleOnBlur";
import PageTransition from "./PageTransition";

function LayoutContent({ children }) {
  const { transitionLabel, showLabel } = useTransition();

  return (
    <>
      <TitleOnBlur />
      <LenisProvider>
        <PageTransition>
       
          <SimpleNavigation />
          <div className="page-content opacity-0">
            {children}
     
          <Footer />
          </div>
        </PageTransition>
      </LenisProvider>

      {/* Display transition label - only visible for 0.5s after nav click */}
      {showLabel && transitionLabel && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <p className="text-black text-4xl font-franklin">
            {transitionLabel}
          </p>
        </div>
      )}
    </>
  );
}

export default function LayoutClient({ children }) {
  return (
    <TransitionProvider>
      <LayoutContent>{children}</LayoutContent>
    </TransitionProvider>
  );
}
