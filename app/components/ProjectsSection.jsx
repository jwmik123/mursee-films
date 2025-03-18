import React, { useRef, useEffect } from "react";
import ProjectImage from "./ProjectImage";
const ProjectsSection = ({ projects }) => {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;

    if (!container || !section) return;

    // Set the width of the horizontal container based on number of projects
    const projectWidth = 400; // Adjust this value based on your design
    const gap = 32; // 8rem gap
    const totalWidth = (projectWidth + gap) * projects.length;

    container.style.width = `${totalWidth}px`;

    // Handle horizontal scrolling
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      // If we're within the section
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // Calculate how far to scroll horizontally
        const scrollProgress = (scrollPosition - sectionTop) / sectionHeight;
        const horizontalScroll =
          scrollProgress * (totalWidth - window.innerWidth);

        // Apply horizontal scroll
        container.style.transform = `translateX(-${horizontalScroll}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      className="w-full h-screen sticky top-0 overflow-hidden bg-[#1c1c1c] pt-16"
    >
      <div className="px-5 md:px-10">
        <div className="flex flex-row items-center justify-between transition-opacity duration-500">
          <h1 className="text-white text-[4vw] font-anton uppercase leading-none">
            Projecten
          </h1>
          <p className="font-medium self-end text-white text-xl">
            Van evenementen tot commercials
          </p>
        </div>
      </div>

      <div className="relative h-[calc(100vh-150px)] overflow-hidden mt-12">
        <div ref={containerRef} className="absolute flex flex-row gap-8 h-full">
          {projects.map((project) => (
            <div key={project.id} className="project-card w-96 flex-shrink-0">
              <ProjectImage project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* This empty div with height creates space for scrolling */}
      <div style={{ height: `${projects.length * 100}vh` }}></div>
    </section>
  );
};

export default ProjectsSection;
