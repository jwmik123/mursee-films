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
  try {
    // Check if required environment variables are present
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      throw new Error(
        "Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable"
      );
    }

    console.log("Sanity config:", {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      hasToken: !!process.env.SANITY_API_TOKEN,
    });

    const result = await client.fetch<T>(query, params);
    return result;
  } catch (error) {
    console.error("Sanity fetch error:", error);

    // If it's a network error or HTML response, provide more context
    if (error instanceof Error) {
      if (error.message.includes("Unexpected token '<'")) {
        console.error(
          "Received HTML instead of JSON - likely a configuration or network issue"
        );
        console.error("Check your Sanity project ID and dataset configuration");
      }
    }

    throw error;
  }
}
