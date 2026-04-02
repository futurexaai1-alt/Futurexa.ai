import { useState, useEffect, useCallback } from "react";
import { getJson, deleteFile, updateFile } from "../lib/api";

export function useFiles() {
  const [files, setFiles] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/files");
      setFiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = useCallback(async (organizationId: string, id: string, data: { visibility?: string }) => {
    try {
      await updateFile({ organizationId, id, ...data });
    } catch (e) {
      console.error(e);
    }
    await fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(async (organizationId: string, id: string) => {
    try {
      await deleteFile({ organizationId, id });
    } catch (e) {
      console.error(e);
    }
    await fetchData();
  }, [fetchData]);

  return {
    files,
    loading,
    error,
    refetch: fetchData,
    updateFile: handleUpdate,
    deleteFile: handleDelete,
  };
}