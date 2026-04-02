import { useState, useEffect, useCallback } from "react";
import { getJson } from "../lib/api";

export function useWebhooks() {
  const [webhooks, setWebhooks] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/webhooks");
      setWebhooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch webhooks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    webhooks,
    loading,
    error,
    refetch: fetchData,
  };
}