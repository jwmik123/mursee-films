import React from "react";
import ProjectImage from "./ProjectImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const ProjectsSection = ({ projects }) => {
  return (
    <>
      <div
        className={`flex flex-row items-center justify-between transition-opacity duration-500`}
      >
        <div>
          <h2 className="text-white text-7xl font-franklin uppercase">
            Laatste werk
          </h2>
          <p className="font-tinos self-end text-white text-2xl mt-2">
            Van evenementen tot commercials
          </p>
        </div>
        <div className="self-end">
          <a
            href="/projects"
            className="text-white relative group px-3 py-2 inline-block"
          >
            <span className="font-tinos text-lg relative z-10">
              Alle projecten
            </span>
            <span className="absolute w-2 h-2 border-t border-l border-white top-0 left-0  group-hover:-top-1 group-hover:-left-1 transition-all duration-300"></span>
            <span className="absolute w-2 h-2 border-t border-r border-white top-0 right-0  group-hover:-top-1  group-hover:-right-1 transition-all duration-300"></span>
            <span className="absolute w-2 h-2 border-b border-l border-white bottom-0 left-0  group-hover:-bottom-1 group-hover:-left-1 transition-all duration-300"></span>
            <span className="absolute w-2 h-2 border-b border-r border-white bottom-0 right-0  group-hover:-bottom-1 group-hover:-right-1 transition-all duration-300"></span>
          </a>
        </div>
      </div>
      <div className="mt-12 bg-black text-white">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
          }}
          className="projects-swiper"
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <a href={`/project/${project.id}`} className="project-card block">
                <ProjectImage project={project} />
              </a>
            </SwiperSlide>
          ))}
          {/* <div className="swiper-button-next !text-white after:!text-white"></div>
          <div className="swiper-button-prev !text-white after:!text-white"></div> */}
        </Swiper>
      </div>
    </>
  );
};

export default ProjectsSection;
