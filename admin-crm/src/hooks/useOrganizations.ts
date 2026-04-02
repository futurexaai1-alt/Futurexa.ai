import { useState, useEffect, useCallback } from "react";
import {
  getJson,
  createOrganization,
  deleteOrganization,
} from "../lib/api";

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/organizations");
      setOrganizations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateOrganization = useCallback(async (name: string) => {
    await createOrganization(name);
    await fetchData();
  }, [fetchData]);

  const handleDeleteOrganization = useCallback(async (id: string) => {
    await deleteOrganization(id);
    await fetchData();
  }, [fetchData]);

  return {
    organizations,
    loading,
    error,
    refetch: fetchData,
    createOrganization: handleCreateOrganization,
    deleteOrganization: handleDeleteOrganization,
  };
}