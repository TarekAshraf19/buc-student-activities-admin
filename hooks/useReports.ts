"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getReportsData,
} from "@/services/report.service";

import type {
  ReportsData,
} from "@/types/report";

export function useReports() {
  const [
    data,
    setData,
  ] =
    useState<ReportsData | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    let active = true;

    async function loadReports() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getReportsData();

        if (active) {
          setData(result);
        }
      } catch (error) {
        console.error(
          "Failed to load reports:",
          error
        );

        if (active) {
          setError(
            "Failed to load reports"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
  };
}