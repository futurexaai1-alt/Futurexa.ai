import { useState, useEffect, useCallback } from "react";
import {
  getJson,
  createTask,
  updateTask,
  deleteTask,
} from "../lib/api";

export function useTasks(organizationId: string = "") {
  const [tasks, setTasks] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!organizationId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/tasks", { organizationId });
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = useCallback(async (orgId: string, projectId: string, title: string, extra?: { priority?: string; milestoneId?: string; dueDate?: string }) => {
    await createTask({ organizationId: orgId, projectId, title, ...extra });
    await fetchData();
  }, [fetchData]);

  const handleUpdateTask = useCallback(async (orgId: string, id: string, data: { title?: string; status?: string; priority?: string }) => {
    await updateTask({ organizationId: orgId, id, ...data });
    await fetchData();
  }, [fetchData]);

  const handleDeleteTask = useCallback(async (orgId: string, id: string) => {
    await deleteTask({ organizationId: orgId, id });
    await fetchData();
  }, [fetchData]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchData,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
  };
}