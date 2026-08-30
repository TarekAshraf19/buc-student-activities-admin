"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getLocalRegionalActivities,
  getLocalRegionalEntities,
} from "@/services/local-regional.service";

import type {
  LocalRegionalActivity,
  LocalRegionalEntity,
} from "@/services/local-regional.service";

export function useLocalRegional() {
  const [
    entities,
    setEntities,
  ] = useState<
    LocalRegionalEntity[]
  >([]);

  const [
    activities,
    setActivities,
  ] = useState<
    LocalRegionalActivity[]
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

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [
          entitiesResult,
          activitiesResult,
        ] =
          await Promise.all([
            getLocalRegionalEntities(),
            getLocalRegionalActivities(),
          ]);

        if (active) {
          setEntities(
            entitiesResult
          );

          setActivities(
            activitiesResult
          );
        }
      } catch (error) {
        console.error(
          "Failed to load local and regional activities:",
          error
        );

        if (active) {
          setError(
            "Failed to load local and regional activities"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  return {
    entities,
    activities,
    loading,
    error,
  };
}