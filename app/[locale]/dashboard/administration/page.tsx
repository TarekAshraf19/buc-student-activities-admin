"use client";

import {
  Building2,
  Globe2,
  GraduationCap,
  RefreshCcw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import {
  useAdministration,
} from "@/hooks/useAdministration";

import type {
  AdministrationAccountType,
} from "@/types/administration";

const filters: Array<
  "all" | AdministrationAccountType
> = [
  "all",
  "college",
  "student-club",
  "local-regional",
  "scientific-society",
  "admin",
];

export default function AdministrationPage() {
  const t =
    useTranslations(
      "Administration"
    );

  const locale =
    useLocale();

  const {
    accounts,
    stats,
    loading,
    error,
    updatingId,

    filter,
    setFilter,

    search,
    setSearch,

    changeAccountStatus,
    refresh,
  } = useAdministration();

  const getTypeLabel = (
    type: AdministrationAccountType
  ) => {
    switch (type) {
      case "college":
        return t(
          "types.college"
        );

      case "student-club":
        return t(
          "types.studentClub"
        );

      case "local-regional":
        return t(
          "types.localRegional"
        );

      case "scientific-society":
        return t(
          "types.scientificSociety"
        );

      case "admin":
        return t(
          "types.admin"
        );
    }
  };

  const statsCards = [
    {
      label: t(
        "stats.totalAccounts"
      ),
      value: stats.total,
      icon: Users,
    },
    {
      label: t(
        "stats.colleges"
      ),
      value: stats.colleges,
      icon: GraduationCap,
    },
    {
      label: t(
        "stats.studentFamilies"
      ),
      value:
        stats.studentClubs,
      icon: Users,
    },
    {
      label: t(
        "stats.localRegional"
      ),
      value:
        stats.localRegional,
      icon: Globe2,
    },
    {
      label: t(
        "stats.scientificSocieties"
      ),
      value:
        stats.scientificSocieties,
      icon: Building2,
    },
    {
      label: t(
        "stats.admins"
      ),
      value: stats.admins,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("title")}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {t(
              "description"
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          {t("refresh")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statsCards.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Icon
                  size={20}
                />
              </div>

              <p className="text-2xl font-bold text-slate-900">
                {value}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {label}
              </p>
            </div>
          )
        )}
      </div>

      {/* Filters + Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setFilter(
                      item
                    )
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    filter ===
                    item
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item ===
                  "all"
                    ? t(
                        "filters.all"
                      )
                    : getTypeLabel(
                        item
                      )}
                </button>
              )
            )}
          </div>

          <div className="relative w-full xl:w-80">
            <Search
              size={18}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                locale ===
                "ar"
                  ? "right-3"
                  : "left-3"
              }`}
            />

            <input
              type="text"
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event
                    .target
                    .value
                )
              }
              placeholder={t(
                "searchPlaceholder"
              )}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:bg-white ${
                locale ===
                "ar"
                  ? "pr-10 pl-4"
                  : "pl-10 pr-4"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center p-8 text-sm text-slate-500">
            {t(
              "loading"
            )}
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-sm text-red-600">
              {t(
                "error"
              )}
            </p>

            <button
              type="button"
              onClick={
                refresh
              }
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {t(
                "tryAgain"
              )}
            </button>
          </div>
        ) : accounts.length ===
          0 ? (
          <div className="flex min-h-64 items-center justify-center p-8 text-sm text-slate-500">
            {t(
              "empty"
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(
                      "table.name"
                    )}
                  </th>

                  <th className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(
                      "table.type"
                    )}
                  </th>

                  <th className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(
                      "table.email"
                    )}
                  </th>

                  <th className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(
                      "table.userId"
                    )}
                  </th>

                  <th className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(
                      "table.status"
                    )}
                  </th>

                  <th className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(
                      "table.actions"
                    )}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {accounts.map(
                  (
                    account
                  ) => {
                    const name =
                      locale ===
                      "ar"
                        ? account
                            .name
                            .ar
                        : account
                            .name
                            .en;

                    const accountKey =
                      `${account.type}-${account.id}`;

                    const isUpdating =
                      updatingId ===
                      accountKey;

                    const isActive =
                      account.active !==
                      false;

                    return (
                      <tr
                        key={
                          accountKey
                        }
                        className="transition hover:bg-slate-50"
                      >
                        {/* Name */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {name}
                          </p>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {getTypeLabel(
                              account.type
                            )}
                          </span>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {account.email ||
                            t(
                              "notAvailable"
                            )}
                        </td>

                        {/* User ID */}
                        <td className="px-6 py-4">
                          {account.userId ? (
                            <code className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                              {
                                account.userId
                              }
                            </code>
                          ) : (
                            <span className="text-sm text-slate-400">
                              {t(
                                "notAvailable"
                              )}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {isActive ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                              {t(
                                "status.active"
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                              {t(
                                "status.inactive"
                              )}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              changeAccountStatus(
                                account
                              )
                            }
                            className={`rounded-xl px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              isActive
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {isUpdating
                              ? t(
                                  "status.updating"
                                )
                              : isActive
                                ? t(
                                    "status.deactivate"
                                  )
                                : t(
                                    "status.activate"
                                  )}
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}