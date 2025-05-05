import { client } from "@/lib/sanity/client";
import { getAllFilms, getFilmsByCategory } from "@/lib/sanity/queries";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    console.log("Fetching films with params:", { category });
    console.log("Sanity client config:", {
      projectId: client.config().projectId,
      dataset: client.config().dataset,
    });

    let films;
    if (category) {
      films = await client.fetch(getFilmsByCategory, { category });
    } else {
      films = await client.fetch(getAllFilms);
    }

    console.log("Films response:", films);

    // Ensure we always return an array
    if (!Array.isArray(films)) {
      console.error("Sanity returned non-array response:", films);
      return Response.json([]);
    }

    return Response.json(films);
  } catch (error) {
    console.error("Error fetching films:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
