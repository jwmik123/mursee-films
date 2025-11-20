import ApproachSection from "../components/ApproachSection";
import StickyCards from "../components/StickyCards";
import ImageGrid from "../components/ImageGrid";

const Studio = () => {
  return (
    <div className="pt-32">
      <StickyCards />
      {/* <div className="h-screen bg-black" /> */}
      <ImageGrid />
      <ApproachSection />
    </div>
  );
};

export default Studio;
