"use client";

import { useEffect } from "react";

export default function TitleOnBlur() {
  useEffect(() => {
    const documentTitleStore = document.title;
    const documentTitleOnBlur = "Hier moet je zijn...";

    const handleFocus = () => {
      document.title = documentTitleStore;
    };

    const handleBlur = () => {
      document.title = documentTitleOnBlur;
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return null;
}
