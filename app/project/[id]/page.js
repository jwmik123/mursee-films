"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import ProjectImage from "../../components/ProjectImage";

function getProject(id) {
  return {
    id: id,
    title: `Project ${id}`,
    imageUrl: `/project${id}.webp`,
    description: `This is a detailed description for project ${id}.`,
  };
}

export default function ProjectDetail({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const project = getProject(unwrappedParams.id);

  // Clean up any overlay elements from the previous page
  useEffect(() => {
    // Remove any overlay that might have been created during transition
    const existingOverlays = document.querySelectorAll(
      'div[style*="position: fixed"][style*="z-index: 50"]'
    );
    existingOverlays.forEach((overlay) => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    });
  }, []);

  return (
    <div className="bg-[#1c1c1c] min-h-screen">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-white hover:bg-gray-200 rounded transition-colors"
      >
        Back
      </button>

      <div>
        {/* Using overflow-visible is crucial to prevent the image from being clipped during animation */}
        <div className="w-full h-[50vh] overflow-visible relative">
          <ProjectImage project={project} isDetail={true} />
        </div>
        <div className="p-6 text-white">
          <h1 className="text-3xl font-anton uppercase mb-4">
            {project.title}
          </h1>
          <p>{project.description}</p>
        </div>
      </div>
    </div>
  );
}
