"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getOverviewData,
} from "@/services/overview.service";

import type {
  OverviewData,
} from "@/types/overview";

export function useOverview() {
  const [
    data,
    setData,
  ] =
    useState<OverviewData | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getOverviewData();

        if (active) {
          setData(result);
        }
      } catch (error) {
        console.error(
          "Overview error:",
          error
        );

        if (active) {
          setError(
            "Failed to load overview"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOverview();

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