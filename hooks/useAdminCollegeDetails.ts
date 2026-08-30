"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getCollegeActivities,
  getCollegeById,
} from "@/services/college.service";

import type {
  Activity,
} from "@/types/activity";

import type {
  College,
} from "@/types/college";

type AdminCollegeDetailsData = {
  college: College;
  activities: Activity[];
};

export function useAdminCollegeDetails(
  collegeId: string
) {
  const [
    data,
    setData,
  ] =
    useState<AdminCollegeDetailsData | null>(
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

    async function loadDetails() {
      if (!collegeId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          college,
          activities,
        ] =
          await Promise.all([
            getCollegeById(
              collegeId
            ),
            getCollegeActivities(
              collegeId
            ),
          ]);

        if (!college) {
          if (active) {
            setError(
              "College not found"
            );
          }

          return;
        }

        if (active) {
          setData({
            college,
            activities,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load college details:",
          error
        );

        if (active) {
          setError(
            "Failed to load college details"
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

    loadDetails();

    return () => {
      active = false;
    };
  }, [collegeId]);

  return {
    data,
    loading,
    error,
  };
}