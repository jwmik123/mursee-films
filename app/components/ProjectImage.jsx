"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Flip } from "gsap/dist/Flip";
import { useFlip } from "../context/FlipContext";

gsap.registerPlugin(Flip);

export default function ProjectImage({ project, isDetail = false }) {
  const { flipState, setFlipState } = useFlip();
  const imageRef = useRef(null);
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle the initial state when coming from another page
  useEffect(() => {
    if (
      isDetail &&
      flipState.activeProjectId === project.id &&
      flipState.elementRect
    ) {
      const image = imageRef.current;

      // Position the image in the center of the screen initially
      gsap.set(image, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: flipState.elementRect.width,
        height: flipState.elementRect.height,
        zIndex: 100,
        margin: 0,
      });

      // Animate to the final position
      gsap.to(image, {
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "50vh",
        objectFit: "cover",
        transform: "none",
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Only reset position properties, keep dimensions and object-fit
          gsap.set(image, {
            position: "relative",
            top: "auto",
            left: "auto",
            zIndex: "auto",
            margin: "0",
          });
        },
      });
    }
  }, [isDetail, project.id, flipState]);

  // Handle click on the project image in the listing page
  const handleProjectClick = () => {
    if (isAnimating || isDetail) return;

    setIsAnimating(true);
    const image = imageRef.current;

    // Get the exact dimensions and position
    const rect = image.getBoundingClientRect();

    // Update context with the current project and element dimensions
    setFlipState({
      activeProjectId: project.id,
      elementRect: {
        width: rect.width,
        height: rect.height,
      },
    });

    // Create an overlay for the background
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "#1c1c1c";
    overlay.style.opacity = "0";
    overlay.style.zIndex = "50";
    document.body.appendChild(overlay);

    // Fade in the overlay
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.inOut",
    });

    // Fix the image in its current position
    gsap.set(image, {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      zIndex: 100,
      margin: 0,
    });

    // Fade out other elements, but NOT the project image or its container
    const imageSection = image.closest("section");
    const projectCard = image.closest(".project-card");

    // Select all sections except the one containing our project
    const otherSections = Array.from(
      document.querySelectorAll("main > section")
    ).filter((section) => section !== imageSection);

    // Select all project cards except the one containing our image
    const otherCards = Array.from(
      document.querySelectorAll(".project-card")
    ).filter((card) => card !== projectCard);

    // Select navigation
    const nav = document.querySelector("nav");

    // Fade out all elements except our project
    gsap.to([...otherSections, ...otherCards, nav], {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
    });

    // Also fade out siblings within the same project card if needed
    if (projectCard) {
      const siblings = Array.from(projectCard.children).filter(
        (child) => !child.contains(image) && child !== image
      );

      gsap.to(siblings, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    // Now animate to the center of the screen
    gsap.to(image, {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        // Don't remove the overlay here, let the next page handle it
        router.push(`/project/${project.id}`);
      },
    });
  };

  return (
    <img
      id={`project-image-${project.id}`}
      ref={imageRef}
      src={project.imageUrl}
      alt={project.title}
      className={`project-image ${isDetail ? "detail-view" : ""}`}
      style={{
        cursor: isDetail ? "default" : "pointer",
        objectFit: isDetail ? "cover" : "cover",
      }}
      onClick={handleProjectClick}
    />
  );
}
