"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdministrationAccounts,
  getAdministrationStats,
  updateAdministrationAccountStatus,
} from "@/services/administration.service";

import type {
  AdministrationAccount,
  AdministrationAccountType,
} from "@/types/administration";

export type AdministrationFilter =
  | "all"
  | AdministrationAccountType;

export function useAdministration() {
  const [accounts, setAccounts] =
    useState<AdministrationAccount[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [filter, setFilter] =
    useState<AdministrationFilter>("all");

  const [search, setSearch] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const loadAccounts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getAdministrationAccounts();

        setAccounts(data);
      } catch (error) {
        console.error(
          "Failed to load administration accounts:",
          error
        );

        setError(
          "FAILED_TO_LOAD_ACCOUNTS"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const changeAccountStatus = async (
    account: AdministrationAccount
  ): Promise<boolean> => {
    const nextActive =
      account.active === false;

    try {
      setUpdatingId(
        `${account.type}-${account.id}`
      );

      await updateAdministrationAccountStatus(
        account,
        nextActive
      );

      setAccounts((current) =>
        current.map((item) => {
          if (
            item.id === account.id &&
            item.type === account.type
          ) {
            return {
              ...item,
              active: nextActive,
            };
          }

          return item;
        })
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to update account status:",
        error
      );

      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(
    () =>
      getAdministrationStats(
        accounts
      ),
    [accounts]
  );

  const filteredAccounts =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return accounts.filter(
        (account) => {
          const matchesType =
            filter === "all" ||
            account.type === filter;

          if (!matchesType) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const searchableText = [
            account.name.en,
            account.name.ar,
            account.email,
            account.userId,
            account.role,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedSearch
          );
        }
      );
    }, [
      accounts,
      filter,
      search,
    ]);

  return {
    accounts: filteredAccounts,

    stats,

    loading,
    error,
    updatingId,

    filter,
    setFilter,

    search,
    setSearch,

    changeAccountStatus,

    refresh: loadAccounts,
  };
}