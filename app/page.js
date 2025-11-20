import { fetchData } from "@/lib/sanity";
import HomeWithLoader from "./components/HomeWithLoader";

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Define the type for our film data
const filmQuery = `*[_type == "film"] {
  _id,
  title,
  "slug": slug.current,
  category,
  description,
  year,
  client,
  featured,
  "imageUrl": image.asset->url,
  "videoUrl": videoFile.asset->url,
  "previewVideo": previewVideo.asset->{
    _id,
    assetId,
    playbackId,
    status,
    data
  }
}`;

export default async function Home() {
  const films = await fetchData(filmQuery);

  return <HomeWithLoader films={films} />;
}
