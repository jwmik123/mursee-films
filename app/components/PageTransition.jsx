"use client";

import gsap from "gsap";
import { useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { navigation } from "@/app/data/data";
import { useTransition } from "@/app/context/TransitionContext";

export default function PageTransition({ children }) {

    const router = useRouter();
    const pathname = usePathname();
    const overlayRef = useRef(null);
    const isTransitioning = useRef(false);
    const hasPlayedInitial = useRef(false);
    const previousPathname = useRef(null);
    const { setTransitionLabel } = useTransition();


    useEffect(() => {
        if (hasPlayedInitial.current && !isTransitioning.current) return;

        playEntryAnimation();
        hasPlayedInitial.current = true;
    }, [pathname]);


    const playEntryAnimation = () => {
       const isRouteChange = previousPathname.current !== null;

       const entryTL = gsap.timeline({
        onComplete: () => {
            isTransitioning.current = false;
            previousPathname.current = pathname;
        },
       });

       if (isRouteChange) {
        entryTL
        .set(overlayRef.current, {
            translateY: "100%",
            scale: 0.5,
      
        })
        .to(overlayRef.current, {
            translateY: 0,
            scale: 1,
            rotate: 0,
            duration: 0.8,
            ease: "power2.inOut",
        });
       }
       
       entryTL.to(".page-content", {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
       });
       entryTL.play();
    };

    useEffect(() => {
        const handleClick = async (e) => {
            e.preventDefault();
            const href = (e.currentTarget).getAttribute("href");

            if(href) {
                const url = new URL(href, window.location.origin).pathname;
                if (url !== pathname && !isTransitioning.current) {
                    let label = "";

                    // Check if it's a project detail page (e.g., /projecten/some-slug)
                    const projectMatch = url.match(/^\/projecten\/([^\/]+)$/);

                    if (projectMatch) {
                        // For project pages, use the title from the link text or data attribute
                        const linkElement = e.currentTarget;
                        // First try data-title attribute, then fall back to text content
                        label = linkElement.getAttribute("data-title") || linkElement.textContent.trim();
                    } else {
                        // For regular navigation items
                        const navItem = navigation.find(item => item.href === url);
                        label = navItem ? navItem.label : "";
                    }

                    // Set the label in context so it's available to layout
                    setTransitionLabel(label);

                    isTransitioning.current = true;
                    hasPlayedInitial.current = false;
                    exitPage(url);
                }
            }
        }


    const links = document.querySelectorAll("a[href^='/']");

    links.forEach(link => {
        link.addEventListener("click", handleClick);
    });
    return () => {
        links.forEach(link => {
            link.removeEventListener("click", handleClick);
        });
    };
}, [pathname, setTransitionLabel]);

const exitPage = (url) => {
    const exitTl = gsap.timeline({
        onComplete: () => {
            router.push(url);
        }
    })

    exitTl.to(".page-content", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
    });

    exitTl.to(overlayRef.current, {
        translateY: "-200%",
        scale: 0.5,

        duration: 0.8,
        ease: "power2.inOut",
    }, "-=0.3");

    exitTl.play();
}
  return (
    <>
    <div ref={overlayRef} className="transition-overlay fixed top-0 left-0 -z-10 w-full h-full bg-black pointer-events-none">
    </div>
    {children}
    </>
  );
}