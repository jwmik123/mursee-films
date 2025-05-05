import { client } from "@/lib/sanity/client";
import { getAllFilms, getFilmsByCategory } from "@/lib/sanity/queries";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let films;
    if (category) {
      films = await client.fetch(getFilmsByCategory, { category });
    } else {
      films = await client.fetch(getAllFilms);
    }

    return Response.json(films);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
