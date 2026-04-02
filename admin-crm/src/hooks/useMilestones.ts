import { useState, useEffect, useCallback } from "react";
import {
  getJson,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getMilestone,
  addMilestoneUpdate,
  addMilestoneBlocker,
  updateMilestoneBlocker,
  addMilestoneDeliverable,
} from "../lib/api";

export function useMilestones(organizationId?: string) {
  const [milestones, setMilestones] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson<Array<Record<string, unknown>>>("/api/milestones", { organizationId });
      setMilestones(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch milestones");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateMilestone = useCallback(async (orgId: string, projectId: string, title: string, dueDate?: string, description?: string) => {
    await createMilestone({ organizationId: orgId, projectId, title, dueDate, description });
    await fetchData();
  }, [fetchData]);

  const handleUpdateMilestone = useCallback(async (orgId: string, id: string, data: any) => {
    await updateMilestone({ organizationId: orgId, id, ...data });
    await fetchData();
  }, [fetchData]);

  const handleDeleteMilestone = useCallback(async (orgId: string, id: string) => {
    await deleteMilestone({ organizationId: orgId, id });
    await fetchData();
  }, [fetchData]);

  const addUpdate = useCallback(async (orgId: string, milestoneId: string, data: any) => {
    const res = await addMilestoneUpdate({ organizationId: orgId, milestoneId, ...data });
    await fetchData();
    return res;
  }, [fetchData]);

  const addBlocker = useCallback(async (orgId: string, milestoneId: string, data: any) => {
    const res = await addMilestoneBlocker({ organizationId: orgId, milestoneId, ...data });
    await fetchData();
    return res;
  }, [fetchData]);

  const updateBlocker = useCallback(async (orgId: string, milestoneId: string, blockerId: string, data: any) => {
    const res = await updateMilestoneBlocker({ organizationId: orgId, milestoneId, blockerId, ...data });
    await fetchData();
    return res;
  }, [fetchData]);

  const addDeliverable = useCallback(async (orgId: string, milestoneId: string, data: any) => {
    const res = await addMilestoneDeliverable({ organizationId: orgId, milestoneId, ...data });
    await fetchData();
    return res;
  }, [fetchData]);

  return {
    milestones,
    loading,
    error,
    refetch: fetchData,
    createMilestone: handleCreateMilestone,
    updateMilestone: handleUpdateMilestone,
    deleteMilestone: handleDeleteMilestone,
    addUpdate,
    addBlocker,
    updateBlocker,
    addDeliverable
  };
}

export function useMilestoneDetail(organizationId: string, milestoneId: string) {
  const [milestone, setMilestone] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!organizationId || !milestoneId) return;
    setLoading(true);
    try {
      const data = await getMilestone(organizationId, milestoneId);
      setMilestone(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch milestone");
    } finally {
      setLoading(false);
    }
  }, [organizationId, milestoneId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    milestone,
    loading,
    error,
    refetch: fetchData
  };
}