// app/components/CustomLink.jsx
"use client";
import { Link } from "next-view-transitions";
import { React } from "react";

export default function CustomLink({
  href,
  children,
  className = "",
  onClick,
}) {
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
