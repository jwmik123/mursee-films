import { useEffect, useState } from "react";
import { fetchData } from "@/lib/sanity";

export function useSanity<T>(query: string, params?: Record<string, any>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSanityData = async () => {
      try {
        const result = await fetchData<T>(query, params);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchSanityData();
  }, [query, JSON.stringify(params)]);

  return { data, loading, error };
}
