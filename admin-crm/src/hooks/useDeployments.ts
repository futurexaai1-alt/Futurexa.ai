import { useState, useEffect, useCallback } from "react";
import {
  getJson,
  createDeployment,
  updateDeploymentStatus,
  deleteDeployment,
} from "../lib/api";

export function useDeployments() {
  const [deployments, setDeployments] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/deployments");
      setDeployments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch deployments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateDeployment = useCallback(async (organizationId: string, name: string, environment?: string, projectId?: string) => {
    await createDeployment({ organizationId, name, environment, projectId });
    await fetchData();
  }, [fetchData]);

  const handleUpdateDeploymentStatus = useCallback(async (organizationId: string, id: string, status: string) => {
    await updateDeploymentStatus({ organizationId, id, status });
    await fetchData();
  }, [fetchData]);

  const handleDeleteDeployment = useCallback(async (organizationId: string, id: string) => {
    await deleteDeployment({ organizationId, id });
    await fetchData();
  }, [fetchData]);

  return {
    deployments,
    loading,
    error,
    refetch: fetchData,
    createDeployment: handleCreateDeployment,
    updateDeploymentStatus: handleUpdateDeploymentStatus,
    deleteDeployment: handleDeleteDeployment,
  };
}