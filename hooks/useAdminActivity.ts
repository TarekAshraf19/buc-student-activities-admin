"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAdminActivityById,
} from "@/services/activity.service";

import type {
  ActivityWithScopeName,
} from "@/types/activity";

export function useAdminActivity(
  activityId?: string
) {
  const [
    activity,
    setActivity,
  ] = useState<
    ActivityWithScopeName | null
  >(null);

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

    async function loadActivity() {
      if (!activityId) {
        setActivity(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result =
          await getAdminActivityById(
            activityId
          );

        if (!active) {
          return;
        }

        setActivity(
          result
        );
      } catch (error) {
        console.error(
          "Failed to load activity:",
          error
        );

        if (active) {
          setError(
            "FAILED_TO_LOAD_ACTIVITY"
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

    loadActivity();

    return () => {
      active = false;
    };
  }, [activityId]);

  return {
    activity,
    loading,
    error,
  };
}