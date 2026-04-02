import { useState, useEffect, useCallback } from "react";
import {
  getJson,
  deleteUser,
  suspendUser,
  unsuspendUser,
  restoreUser,
} from "../lib/api";

export function useUsers() {
  const [users, setUsers] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/users");
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = useCallback(async (id: string) => {
    try {
      await deleteUser(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  }, [fetchData]);

  const handleSuspendUser = useCallback(async (id: string, reason: string) => {
    await suspendUser({ id, reason });
    await fetchData();
  }, [fetchData]);

  const handleUnsuspendUser = useCallback(async (id: string) => {
    await unsuspendUser(id);
    await fetchData();
  }, [fetchData]);

  const handleRestoreUser = useCallback(async (id: string) => {
    await restoreUser(id);
    await fetchData();
  }, [fetchData]);

  return {
    users,
    loading,
    error,
    refetch: fetchData,
    deleteUser: handleDeleteUser,
    suspendUser: handleSuspendUser,
    unsuspendUser: handleUnsuspendUser,
    restoreUser: handleRestoreUser,
  };
}