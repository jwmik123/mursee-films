"use client";
import Link from "next/link";
import { useState } from "react";
import ContactDialog from "./ContactDialog";

const SimpleNavigation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "PROJECTEN", href: "/projects" },
    { label: "OVER ONS", href: "/about" },
  ];

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <nav className="flex items-center justify-between px-10 py-6 mx-auto">
          {/* Left section (empty for balance) */}
          <div className="w-32">
            <h1 className="font-franklin text-white text-4xl">MF</h1>
          </div>

          {/* Middle section - Navigation links */}
          <div className="flex justify-center">
            <ul className="flex space-x-8">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm uppercase text-white hover:text-gray-300 transition-colors font-franklin"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right section - CTA button */}
          <div className=" flex justify-end">
            <button
              onClick={handleContactClick}
              className="px-4 py-2 bg-white text-black text-sm uppercase font-franklin hover:bg-gray-200 transition-colors"
            >
              Start een project
            </button>
          </div>
        </nav>
      </header>

      <ContactDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
};

export default SimpleNavigation;
