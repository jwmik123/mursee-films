import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-13", // Use today's date or your preferred version
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  perspective: "published", // or "previewDrafts" for draft content
  stega: false,
  requestTagPrefix: "mursee-films",
  timeout: 30000, // Increase timeout to 30 seconds
});

// Helper function to fetch data
export async function fetchData<T>(
  query: string,
  params?: Record<string, any>,
  options?: { cache?: RequestCache; next?: { revalidate?: number } }
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
      hasToken: !!process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
    });

    // Default cache options for server-side rendering
    const defaultOptions = {
      cache: "no-store" as RequestCache,
      next: { revalidate: 0 },
    };

    const result = await client.fetch<T>(query, params, {
      ...defaultOptions,
      ...options,
    });
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
