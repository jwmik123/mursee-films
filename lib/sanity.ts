import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-13", // Use today's date or your preferred version
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
});

// Helper function to fetch data
export async function fetchData<T>(
  query: string,
  params?: Record<string, any>
): Promise<T> {
  return client.fetch<T>(query, params);
}
