"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getScientificSocietyActivities,
  getScientificSocietyEntities,
} from "@/services/scientific-society.service";

import type {
  ScientificSocietyActivity,
  ScientificSocietyEntity,
} from "@/services/scientific-society.service";

export function useScientificSocieties() {
  const [
    entities,
    setEntities,
  ] = useState<
    ScientificSocietyEntity[]
  >([]);

  const [
    activities,
    setActivities,
  ] = useState<
    ScientificSocietyActivity[]
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
            getScientificSocietyEntities(),
            getScientificSocietyActivities(),
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
          "Failed to load scientific societies:",
          error
        );

        if (active) {
          setError(
            "Failed to load scientific societies"
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