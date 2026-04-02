import { useState, useEffect, useCallback } from "react";
import {
  getJson,
  createProject,
  updateProject,
  deleteProject,
} from "../lib/api";

export function useProjects() {
  const [projects, setProjects] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/projects");
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateProject = useCallback(async (organizationId: string, name: string, description?: string) => {
    await createProject({ organizationId, name, description });
    await fetchData();
  }, [fetchData]);

  const handleUpdateProject = useCallback(async (organizationId: string, id: string, data: { name?: string; description?: string; status?: string }) => {
    await updateProject({ organizationId, id, ...data });
    await fetchData();
  }, [fetchData]);

  const handleDeleteProject = useCallback(async (organizationId: string, id: string) => {
    await deleteProject({ organizationId, id });
    await fetchData();
  }, [fetchData]);

  return {
    projects,
    loading,
    error,
    refetch: fetchData,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
  };
}