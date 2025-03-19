import React from "react";
import ProjectImage from "./ProjectImage";
const ProjectsSection = ({ projects }) => {
  return (
    <>
      <div
        className={`flex flex-row items-center justify-between transition-opacity duration-500`}
      >
        <p className="font-medium self-end text-white text-xl">
          Van evenementen tot commercials
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 bg-[#1c1c1c] text-white">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <ProjectImage project={project} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectsSection;
