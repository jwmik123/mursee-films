// app/layout.js
import { Tinos } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LayoutClient from "./components/LayoutClient";
import { fetchData } from "@/lib/sanity";

const franklin = localFont({
  src: "../public/fonts/franklin.woff2",
  variable: "--font-franklin",
});

const tinos = Tinos({
  variable: "--font-tinos",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata() {
  try {
    const settings = await fetchData(`
      *[_type == "siteSettings" && _id == "siteSettings"][0]{
        title,
        description,
        siteUrl,
        "ogImage": ogImage.asset->url,
        "ogImageAlt": ogImage.alt,
        ogTitle,
        ogDescription,
        twitterHandle
      }
    `);

    // Fallback to default values if settings not found
    if (!settings) {
      return {
        title: "Mursee Films",
        description: "Mursee Films",
      };
    }

    return {
      title: settings.title || "Mursee Films",
      description: settings.description || "Mursee Films",
      openGraph: {
        title: settings.ogTitle || settings.title || "Mursee Films",
        description: settings.ogDescription || settings.description || "Mursee Films",
        url: settings.siteUrl,
        siteName: settings.title || "Mursee Films",
        images: settings.ogImage ? [
          {
            url: settings.ogImage,
            width: 1200,
            height: 630,
            alt: settings.ogImageAlt || settings.title || "Mursee Films",
          },
        ] : [],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: settings.ogTitle || settings.title || "Mursee Films",
        description: settings.ogDescription || settings.description || "Mursee Films",
        creator: settings.twitterHandle,
        images: settings.ogImage ? [settings.ogImage] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    // Return default metadata on error
    return {
      title: "Mursee Films",
      description: "Mursee Films",
    };
  }
}



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${franklin.variable} ${tinos.variable}  antialiased bg-white min-h-[100svh]`}
      >
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
