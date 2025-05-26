// import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import ApproachSection from "./components/ApproachSection";
import StickyCards from "./components/StickyCards";
import ImageGrid from "./components/ImageGrid";
import { fetchData } from "@/lib/sanity";
import MobileCards from "./components/MobileCards";
import OpenAnimation from "./components/OpenAnimation";

// Define the type for our film data
const filmQuery = `*[_type == "film"] {
  _id,
  title,
  category,
  description,
  year,
  client,
  "imageUrl": image.asset->url,
  "videoUrl": videoFile.asset->url
}`;

export default async function Home() {
  const films = await fetchData(filmQuery);

  const images = [
    "/images/logos/hetpark.png",
    "/images/logos/enza.png",
    "/images/logos/nh.webp",
    "/images/logos/schouten.png",
    "/images/logos/staan.png",
    "/images/logos/tracking.png",
    "/images/logos/vattenfal.png",
  ];

  return (
    <main>
      {/* <HeroSection /> */}
      <OpenAnimation />
      <AboutSection />

      {/* <section
        className={`w-full px-5 md:px-10 bg-black pt-16 pb-24 transition-opacity duration-500`}
      ></section> */}

      <section className="projects w-full px-5 md:px-10 bg-black py-32">
        <ProjectsSection projects={films} />
      </section>
      <div className="hidden md:block">
        <StickyCards />
      </div>
      <div className="block md:hidden">
        <MobileCards />
      </div>
      <ImageGrid images={images} />
      <ApproachSection />

      {/* <section
        className={`w-full bg-black h-[100vh] transition-opacity duration-500`}
      ></section> */}
    </main>
  );
}
