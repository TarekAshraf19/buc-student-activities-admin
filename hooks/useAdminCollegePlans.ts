"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAdminCollegePlans,
} from "@/services/college-plan.service";

import type {
  AdminCollegePlan,
} from "@/services/college-plan.service";

export function useAdminCollegePlans() {
  const [
    plans,
    setPlans,
  ] = useState<
    AdminCollegePlan[]
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

    async function loadPlans() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getAdminCollegePlans();

        if (active) {
          setPlans(result);
        }
      } catch (error) {
        console.error(
          "Failed to load college plans:",
          error
        );

        if (active) {
          setError(
            "Failed to load college plans"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPlans();

    return () => {
      active = false;
    };
  }, []);

  return {
    plans,
    loading,
    error,
  };
}