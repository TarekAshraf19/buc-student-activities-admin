"use client";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  useEffect,
  useState,
} from "react";

import {
  auth,
  db,
} from "@/lib/firebase";

import type { Admin } from "@/types/admin";

type UseAdminAuthResult = {
  user: User | null;
  admin: Admin | null;
  loading: boolean;
  isAdmin: boolean;
};

export function useAdminAuth(): UseAdminAuthResult {
  const [
    user,
    setUser,
  ] = useState<User | null>(null);

  const [
    admin,
    setAdmin,
  ] = useState<Admin | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          try {
            if (!currentUser) {
              setUser(null);
              setAdmin(null);
              setLoading(false);
              return;
            }

            const adminRef =
              doc(
                db,
                "admins",
                currentUser.uid
              );

            const snapshot =
              await getDoc(adminRef);

            if (!snapshot.exists()) {
              setUser(currentUser);
              setAdmin(null);
              setLoading(false);
              return;
            }

            const data =
              snapshot.data() as Omit<
                Admin,
                "uid"
              >;

            if (
              data.role !== "admin" ||
              data.active !== true
            ) {
              setUser(currentUser);
              setAdmin(null);
              setLoading(false);
              return;
            }

            setUser(currentUser);

            setAdmin({
              uid: currentUser.uid,
              ...data,
            });
          } catch (error) {
            console.error(
              "Admin auth error:",
              error
            );

            setUser(currentUser);
            setAdmin(null);
          } finally {
            setLoading(false);
          }
        }
      );

    return unsubscribe;
  }, []);

  return {
    user,
    admin,
    loading,
    isAdmin: Boolean(admin),
  };
}