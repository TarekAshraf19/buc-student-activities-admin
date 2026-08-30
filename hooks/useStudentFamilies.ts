"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getStudentFamilyActivitiesByCategory,
  getStudentFamilyCommittees,
  getStudentFamilyNames,
} from "@/services/student-family.service";

import type {
  Activity,
  StudentClubCategory,
} from "@/types/activity";

import type {
  StudentFamilyCommittee,
} from "@/services/student-family.service";

export function useStudentFamilyCommittees() {
  const [
    committees,
    setCommittees,
  ] = useState<
    StudentFamilyCommittee[]
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

    async function loadCommittees() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getStudentFamilyCommittees();

        if (active) {
          setCommittees(result);
        }
      } catch (error) {
        console.error(
          "Failed to load student family committees:",
          error
        );

        if (active) {
          setError(
            "Failed to load committees"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCommittees();

    return () => {
      active = false;
    };
  }, []);

  return {
    committees,
    loading,
    error,
  };
}

type ActivityWithFamilyName =
  Activity & {
    familyName: {
      en: string;
      ar: string;
    };
  };

export function useStudentFamilyCategory(
  category: StudentClubCategory
) {
  const [
    activities,
    setActivities,
  ] = useState<
    ActivityWithFamilyName[]
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

        const [
          categoryActivities,
          familyNames,
        ] =
          await Promise.all([
            getStudentFamilyActivitiesByCategory(
              category
            ),
            getStudentFamilyNames(),
          ]);

        const result =
          categoryActivities.map(
            (activity) => ({
              ...activity,
              familyName:
                familyNames.get(
                  activity.scopeId
                ) ?? {
                  en: "",
                  ar: "",
                },
            })
          );

        if (active) {
          setActivities(result);
        }
      } catch (error) {
        console.error(
          "Failed to load student family activities:",
          error
        );

        if (active) {
          setError(
            "Failed to load activities"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      active = false;
    };
  }, [category]);

  return {
    activities,
    loading,
    error,
  };
}