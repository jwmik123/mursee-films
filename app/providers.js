"use client";

import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Create a context preserver component that doesn't rely on LayoutRouterContext
function ContextPreserver({ children }) {
  const [snapshot, setSnapshot] = useState(children);

  useEffect(() => {
    setSnapshot(children);
  }, [children]);

  return snapshot;
}

export function Animate({ children }) {
  const pathname = usePathname();

  // Animation variants
  const variants = {
    enter: { x: "100%" },
    center: { x: 0 },
    exit: { x: "-100%" },
  };

  // Consistent transition configuration
  const transition = {
    duration: 0.6,
    ease: "easeInOut",
  };

  // Style configuration
  const pageStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#98FC99",
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={pathname}
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          transition={transition}
          style={pageStyle}
        >
          <ContextPreserver>{children}</ContextPreserver>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
