import HeroSection from "./components/HeroSection";
import MainNavigation from "./components/MainNavigation";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import ApproachSection from "./components/ApproachSection";
import StickyCards from "./components/StickyCards";
const projects = [
  {
    id: "1",
    title: "Het Park",
    imageUrl: "/images/groeten.jpg",
    category: "Bedrijfsfilm",
  },
  {
    id: "2",
    title: "Provincie Noord-Holland",
    imageUrl: "/images/province.jpg",
    category: "Bedrijsfilm",
  },
  {
    id: "3",
    title: "Porsche 911 GT3",
    imageUrl: "/images/race.jpg",
    category: "Commercial",
  },
  {
    id: "4",
    title: "Triple Solar",
    imageUrl: "/images/triple.jpg",
    category: "Commercial",
  },
  // ... more projects
];

export default function Home() {
  return (
    <main>
      <MainNavigation />
      <HeroSection />
      <AboutSection />

      {/* <section
        className={`w-full px-5 md:px-10 bg-black pt-16 pb-24 transition-opacity duration-500`}
      ></section> */}

      <section className="w-full px-5 md:px-10 bg-black pt-16 pb-24">
        <ProjectsSection projects={projects} />
      </section>
      <StickyCards />
      <ApproachSection />

      {/* <section
        className={`w-full bg-black h-[100vh] transition-opacity duration-500`}
      ></section> */}
    </main>
  );
}
