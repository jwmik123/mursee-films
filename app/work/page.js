"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to projects page
    router.replace("/projects");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">Redirecting...</div>
    </div>
  );
}
