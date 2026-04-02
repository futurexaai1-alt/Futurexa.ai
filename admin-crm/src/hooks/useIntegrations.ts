import { useState, useEffect, useCallback } from "react";
import { getJson } from "../lib/api";

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/integrations");
      setIntegrations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch integrations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    integrations,
    loading,
    error,
    refetch: fetchData,
  };
}