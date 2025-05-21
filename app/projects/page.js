import { fetchData } from "@/lib/sanity";
import Image from "next/image";

// Define the type for our film data
const filmQuery = `*[_type == "film"] {
  title,
  category,
  description,
  year,
  client,
  "imageUrl": image.asset->url,
  "videoUrl": videoFile.asset->url
}`;

export default async function ProjectsPage() {
  const films = await fetchData(filmQuery);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Our Films</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {films.map((film) => (
          <div
            key={film.title}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            {film.imageUrl && (
              <div className="relative h-48 w-full">
                <Image
                  src={film.imageUrl}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{film.title}</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Category:</span> {film.category}
                </p>
                <p>
                  <span className="font-medium">Year:</span> {film.year}
                </p>
                <p>
                  <span className="font-medium">Client:</span> {film.client}
                </p>
              </div>
              {film.description && (
                <p className="mt-2 text-gray-700">{film.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
