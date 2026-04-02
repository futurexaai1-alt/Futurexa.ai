import { useState, useEffect, useCallback } from "react";
import { getJson } from "../lib/api";

export function useBilling() {
  const [subscriptions, setSubscriptions] = useState<Array<Record<string, unknown>>>([]);
  const [payments, setPayments] = useState<Array<Record<string, unknown>>>([]);
  const [invoices, setInvoices] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [subs, pays, invs] = await Promise.all([
        getJson<Array<Record<string, unknown>>>("/api/billing/subscriptions"),
        getJson<Array<Record<string, unknown>>>("/api/billing/payments"),
        getJson<Array<Record<string, unknown>>>("/api/billing/invoices"),
      ]);
      setSubscriptions(subs || []);
      setPayments(pays || []);
      setInvoices(invs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch billing data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    subscriptions,
    payments,
    invoices,
    loading,
    error,
    refetch: fetchData,
  };
}