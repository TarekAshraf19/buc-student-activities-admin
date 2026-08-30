"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAdminActivities,
} from "@/services/activity.service";

import type {
  ActivityWithScopeName,
} from "@/types/activity";

export function useAdminActivities() {
  const [
    activities,
    setActivities,
  ] = useState<
    ActivityWithScopeName[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    let active = true;

    async function loadActivities() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getAdminActivities();

        if (active) {
          setActivities(
            result
          );
        }
      } catch (error) {
        console.error(
          "Failed to load activities:",
          error
        );

        if (active) {
          setError(
            "Failed to load activities"
          );
        }
      } finally {
        if (active) {
          setLoading(
            false
          );
        }
      }
    }

    loadActivities();

    return () => {
      active = false;
    };
  }, []);

  return {
    activities,
    loading,
    error,
  };
}