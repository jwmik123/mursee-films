import HeroSection from "./components/HeroSection";
import MainNavigation from "./components/MainNavigation";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import ApproachSection from "./components/ApproachSection";

const projects = [
  {
    id: "1",
    title: "Project One",
    imageUrl: "/images/groeten.jpg",
  },
  {
    id: "2",
    title: "Project Two",
    imageUrl: "/images/province.jpg",
  },
  {
    id: "3",
    title: "Project Three",
    imageUrl: "/images/race.jpg",
  },
  {
    id: "4",
    title: "Project Four",
    imageUrl: "/images/triple.jpg",
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

      <ApproachSection />

      <section
        className={`w-full bg-black h-[300vh] transition-opacity duration-500`}
      ></section>
    </main>
  );
}
