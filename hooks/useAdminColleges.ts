"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAdminColleges,
} from "@/services/college.service";

import type {
  AdminCollege,
} from "@/types/college";

export function useAdminColleges() {
  const [
    colleges,
    setColleges,
  ] = useState<
    AdminCollege[]
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

    async function loadColleges() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getAdminColleges();

        if (active) {
          setColleges(
            result
          );
        }
      } catch (error) {
        console.error(
          "Failed to load colleges:",
          error
        );

        if (active) {
          setError(
            "Failed to load colleges"
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

    loadColleges();

    return () => {
      active = false;
    };
  }, []);

  return {
    colleges,
    loading,
    error,
  };
}