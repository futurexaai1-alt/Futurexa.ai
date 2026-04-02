import { useState, useEffect, useCallback } from "react";
import {
  getJson,
  updateRequestStatus,
  deleteRequest,
} from "../lib/api";

export function useLeads() {
  const [leads, setLeads] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/project-requests");
      setLeads(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = useCallback(async (organizationId: string, id: string, status: string, internalNote?: string, rejectionReason?: string) => {
    await updateRequestStatus({ organizationId, id, status, internalNote, rejectionReason });
    await fetchData();
  }, [fetchData]);

  const handleDeleteRequest = useCallback(async (id: string) => {
    await deleteRequest(id);
    await fetchData();
  }, [fetchData]);

  return {
    leads,
    loading,
    error,
    refetch: fetchData,
    updateStatus: handleUpdateStatus,
    deleteRequest: handleDeleteRequest,
  };
}