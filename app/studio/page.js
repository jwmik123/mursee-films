"use client";

import ApproachSection from "../components/ApproachSection";
import StickyCards from "../components/StickyCards";
import MobileCards from "../components/MobileCards";
import ImageGrid from "../components/ImageGrid";
import { useMediaQuery } from "react-responsive";

const Studio = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="pt-32">
      {isMobile ? <MobileCards /> : <StickyCards />}
      <ImageGrid />
      <ApproachSection />
    </div>
  );
};

export default Studio;
