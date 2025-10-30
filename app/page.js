// import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import ApproachSection from "./components/ApproachSection";
import StickyCards from "./components/StickyCards";
import ImageGrid from "./components/ImageGrid";
import { fetchData } from "@/lib/sanity";
import MobileCards from "./components/MobileCards";
import FeaturedProjectsHero from "./components/FeaturedProjectsHero";
import FeaturedProjectsTransitions from "./components/FeaturedProjectsTransitions";
import CurtainsVideoTransition from "./components/CurtainsVideoTransition";

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Define the type for our film data
const filmQuery = `*[_type == "film"] {
  _id,
  title,
  "slug": slug.current,
  category,
  description,
  year,
  client,
  featured,
  "imageUrl": image.asset->url,
  "videoUrl": videoFile.asset->url,
  "previewVideo": previewVideo.asset->{
    _id,
    assetId,
    playbackId,
    status,
    data
  }
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
    <main className="min-h-[100svh] overflow-hidden">
      {/* Featured Projects Hero Section */}
      {/* <FeaturedProjectsHero projects={films} /> */}
      {/* <FeaturedProjectsTransitions projects={films} /> */}
      <CurtainsVideoTransition projects={films} transitionType="perlinLine" />

      {/* <AboutSection /> */}

      {/* <section
        className={`w-full px-5 md:px-10 bg-black pt-16 pb-24 transition-opacity duration-500`}
      ></section> */}

      {/* <section className="projects w-full px-5 md:px-10 bg-black py-32">
        <ProjectsSection projects={films} />
      </section>
      <div className="hidden md:block">
        <StickyCards />
      </div>
      <div className="block md:hidden">
        <MobileCards />
      </div>
      <ImageGrid images={images} />
      <ApproachSection /> */}

      {/* <section
        className={`w-full bg-black h-[100vh] transition-opacity duration-500`}
      ></section> */}
    </main>
  );
}
