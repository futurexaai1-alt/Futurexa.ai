import { useState, useEffect, useCallback } from "react";
import { getJson, updateTicketStatus, deleteTicket } from "../lib/api";

export function useTickets() {
  const [tickets, setTickets] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/tickets");
      setTickets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = useCallback(async (organizationId: string, id: string, status: string) => {
    await updateTicketStatus({ organizationId, id, status });
    await fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(async (organizationId: string, id: string) => {
    await deleteTicket({ organizationId, id });
    await fetchData();
  }, [fetchData]);

  return {
    tickets,
    loading,
    error,
    refetch: fetchData,
    updateTicketStatus: handleUpdateStatus,
    deleteTicket: handleDelete,
  };
}