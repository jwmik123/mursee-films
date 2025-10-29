"use client";

import React, { useRef, useEffect, useState } from "react";
import ProjectImage from "./ProjectImage";
import Core from "smooothy";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";

// Utility function for smooth damping
function damp(current, target, lambda, deltaTime) {
  return current + (target - current) * (1 - Math.exp(-lambda * deltaTime));
}

// Extended Smooothy class with parallax
class ParallaxSlider extends Core {
  constructor(wrapper, config) {
    super(wrapper, config);
    this.parallaxElements = [...wrapper.querySelectorAll('[data-parallax]')];
    this.lerpedSpeed = 0;
  }

  onUpdate({ speed, deltaTime, parallaxValues }) {
    // Smooth out the speed for more gradual effects
    this.lerpedSpeed = damp(this.lerpedSpeed, speed, 5, deltaTime);

    // Disable pointer events on links while dragging
    const links = this.wrapper.querySelectorAll('a');
    const isDragging = Math.abs(speed) > 0.01;

    links.forEach(link => {
      link.style.pointerEvents = isDragging ? 'none' : 'auto';
    });

    // Apply parallax to child elements (not the slides themselves)
    this.parallaxElements.forEach((element, i) => {
      if (parallaxValues && parallaxValues[i] !== undefined) {
        // Parallax effect on inner element
        const parallaxOffset = parallaxValues[i] * 15;

        // Speed-based additional offset for bouncy effect
        const speedOffset = this.lerpedSpeed * 5;

        // Combine both effects
        const totalOffset = parallaxOffset + speedOffset;

        element.style.transform = `translateX(${totalOffset}%)`;
      }
    });
  }
}

// Smooothy hook
function useSmooothy(config = {}) {
  const sliderRef = useRef(null);
  const [slider, setSlider] = useState(null);

  const refCallback = (node) => {
    if (node && !slider) {
      const instance = new ParallaxSlider(node, {
        infinite: true,
        snap: true,
        dragSensitivity: 0.005,
        lerpFactor: 0.3,
        speedDecay: 0.85,
        snapStrength: 0.1,
        ...config
      });
      gsap.ticker.add(instance.update.bind(instance));
      setSlider(instance);
    }
    sliderRef.current = node;
  };

  useEffect(() => {
    return () => {
      if (slider) {
        gsap.ticker.remove(slider.update.bind(slider));
        slider.destroy();
      }
    };
  }, [slider]);

  return { ref: refCallback, slider };
}

const ProjectsSection = ({ projects }) => {
  const titleRef = useRef(null);
  const splitTextRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { ref: sliderRef } = useSmooothy();

  useGSAP(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Use SplitText to split the title text into words
    if (titleRef.current && !splitTextRef.current) {
      // Add CSS style for title-text-word class
      const style = document.createElement("style");
      style.textContent = `
        .title-text-word {
          display: inline-block;
          margin-right: 0.3em;
        }
      `;
      document.head.appendChild(style);

      splitTextRef.current = new SplitText(titleRef.current, {
        type: "chars",
        wordsClass: "title-text-word",
      });

      // Set initial styles
      gsap.set(splitTextRef.current.chars, {
        x: 5,
        opacity: 0,
        filter: "blur(8px)",
      });

      // Create staggered animation on scroll
      gsap.to(splitTextRef.current.chars, {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.03,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 90%",
          end: "top -10%",
          scrub: 0.8,
          markers: false,
        },
      });
    }

    return () => {
      // Clean up any split text instances
      if (splitTextRef.current) {
        splitTextRef.current.revert();
      }
    };
  }, []);

  // Button component for "Alle projecten"
  const AlleProjectenButton = () => (
    <a
      href="/projects"
      className="text-white relative group px-3 py-2 inline-block w-full md:w-auto text-center"
    >
      <span className="font-tinos text-lg relative z-10">Alle projecten</span>
      <span className="absolute w-2 h-2 border-t border-l border-white top-0 left-0 group-hover:-top-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="absolute w-2 h-2 border-t border-r border-white top-0 right-0 group-hover:-top-1 group-hover:-right-1 transition-all duration-300"></span>
      <span className="absolute w-2 h-2 border-b border-l border-white bottom-0 left-0 group-hover:-bottom-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="absolute w-2 h-2 border-b border-r border-white bottom-0 right-0 group-hover:-bottom-1 group-hover:-right-1 transition-all duration-300"></span>
    </a>
  );

  return (
    <>
      <div
        className={`flex flex-row items-center justify-between transition-opacity duration-500`}
      >
        <div>
          <h2
            ref={titleRef}
            className="text-white text-6xl md:text-7xl font-franklin uppercase"
          >
            Laatste werk
          </h2>
          <p className="font-tinos self-end text-white text-xl mt-2">
            Van evenementen tot commercials
          </p>
        </div>
        {!isMobile && (
          <div>
            <AlleProjectenButton />
          </div>
        )}
      </div>
      <div className="mt-12 bg-black text-white">
        {isMobile ? (
          <div className="flex flex-col space-y-6">
            {projects.map((project) => (
              <div key={project._id}>
                <a
                  href={`/projects/${project.slug}`}
                  className="project-card block"
                >
                  <ProjectImage project={project} />
                </a>
                <div className="mt-2 flex items-center justify-between">
                  <h3 className="text-white text-sm uppercase font-franklin">
                    {project.title}
                  </h3>
                  <p className="text-white text-xs uppercase font-tinos tracking-tighter">
                    {project.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative -mx-4 md:-mx-8 lg:-mx-12">
            <div
              tabIndex={0}
              className="flex w-screen overflow-x-hidden px-[calc(50%-40vw)] md:px-[calc(50%-15vw)] focus:outline-none cursor-grab active:cursor-grabbing pb-8"
              ref={sliderRef}
            >
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="flex aspect-[4/3] w-[80vw] md:w-[30vw] shrink-0 items-center justify-center p-1"
                >
                  <div className="relative h-full w-full p-1">
                    <div
                      data-parallax
                      className="h-full w-full flex flex-col"
                    >
                      <a
                        href={`/projects/${project.slug}`}
                        className="project-card block flex-1"
                      >
                        <ProjectImage project={project} />
                      </a>
                      <div className="px-2 py-2 flex items-center justify-between">
                        <h3 className="text-white text-sm md:text-md uppercase font-franklin">
                          {project.title}
                        </h3>
                        <p className="text-white text-xs md:text-sm uppercase font-tinos tracking-tighter">
                          {project.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isMobile && (
        <div className="mt-8 flex justify-center">
          <AlleProjectenButton />
        </div>
      )}
    </>
  );
};

export default ProjectsSection;
