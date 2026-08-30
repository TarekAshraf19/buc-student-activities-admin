"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Activity as ActivityIcon,
  Building2,
  CalendarDays,
  FlaskConical,
  MapPinned,
  Search,
  Users,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  useAdminActivities,
} from "@/hooks/useAdminActivities";

import {
  useLocale,
} from "@/hooks/useLocale";

import type {
  ActivityScopeType,
} from "@/types/activity";

type ScopeFilter =
  | "all"
  | ActivityScopeType;

export default function ActivitiesPage() {
  const t =
    useTranslations(
      "Activities"
    );

  const locale =
    useLocale();

  const {
    activities,
    loading,
    error,
  } =
    useAdminActivities();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    scopeFilter,
    setScopeFilter,
  ] =
    useState<ScopeFilter>(
      "all"
    );

  const getScopeLabel = (
    scopeType: ActivityScopeType
  ) => {
    switch (scopeType) {
      case "college":
        return t(
          "college"
        );

      case "student-club":
        return t(
          "studentClub"
        );

      case "local-regional":
        return t(
          "localRegional"
        );

      case "scientific-society":
        return t(
          "scientificSociety"
        );

      default:
        return "";
    }
  };

  const getScopeIcon = (
    scopeType: ActivityScopeType
  ) => {
    switch (scopeType) {
      case "college":
        return Building2;

      case "student-club":
        return Users;

      case "local-regional":
        return MapPinned;

      case "scientific-society":
        return FlaskConical;

      default:
        return ActivityIcon;
    }
  };

  const filteredActivities =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return activities.filter(
        (activity) => {
          const titleEn =
            activity.title?.en
              ?.toLowerCase() ??
            "";

          const titleAr =
            activity.title?.ar ??
            "";

          const categoryEn =
            activity.category?.en
              ?.toLowerCase() ??
            "";

          const categoryAr =
            activity.category?.ar ??
            "";

          const scopeNameEn =
            activity.scopeName?.en
              ?.toLowerCase() ??
            "";

          const scopeNameAr =
            activity.scopeName?.ar ??
            "";

          const matchesSearch =
            !query ||
            titleEn.includes(
              query
            ) ||
            titleAr.includes(
              search.trim()
            ) ||
            categoryEn.includes(
              query
            ) ||
            categoryAr.includes(
              search.trim()
            ) ||
            scopeNameEn.includes(
              query
            ) ||
            scopeNameAr.includes(
              search.trim()
            );

          const matchesScope =
            scopeFilter ===
              "all" ||
            activity.scopeType ===
              scopeFilter;

          return (
            matchesSearch &&
            matchesScope
          );
        }
      );
    }, [
      activities,
      search,
      scopeFilter,
    ]);

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {t("error")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold text-blue-600">
          {t(
            "eyebrow"
          )}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          {t(
            "description"
          )}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              placeholder={t(
                "search"
              )}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 ps-11 pe-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <select
            value={
              scopeFilter
            }
            onChange={(
              event
            ) =>
              setScopeFilter(
                event.target
                  .value as ScopeFilter
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 lg:min-w-60"
          >
            <option value="all">
              {t(
                "allScopes"
              )}
            </option>

            <option value="college">
              {t(
                "college"
              )}
            </option>

            <option value="student-club">
              {t(
                "studentClub"
              )}
            </option>

            <option value="local-regional">
              {t(
                "localRegional"
              )}
            </option>

            <option value="scientific-society">
              {t(
                "scientificSociety"
              )}
            </option>
          </select>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {t(
            "results"
          )}
          :{" "}
          <span className="font-bold text-slate-900">
            {
              filteredActivities.length
            }
          </span>
        </p>
      </section>

      {filteredActivities.length ===
      0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <ActivityIcon className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            {t(
              "noResults"
            )}
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-slate-50">
                <tr className="text-sm text-slate-500">
                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "activity"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "category"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "scope"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "date"
                    )}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredActivities.map(
                  (
                    activity
                  ) => {
                    const title =
                      activity
                        .title?.[
                        locale ===
                        "ar"
                          ? "ar"
                          : "en"
                      ] ||
                      activity
                        .title
                        ?.en ||
                      activity
                        .title
                        ?.ar ||
                      "";

                    const category =
                      activity
                        .category?.[
                        locale ===
                        "ar"
                          ? "ar"
                          : "en"
                      ] ||
                      activity
                        .category
                        ?.en ||
                      activity
                        .category
                        ?.ar ||
                      "-";

                    const scopeName =
                      activity
                        .scopeName?.[
                        locale ===
                        "ar"
                          ? "ar"
                          : "en"
                      ] ||
                      activity
                        .scopeName
                        ?.en ||
                      activity
                        .scopeName
                        ?.ar ||
                      "-";

                    const ScopeIcon =
                      getScopeIcon(
                        activity.scopeType
                      );

                    return (
                      <tr
                        key={
                          activity.id
                        }
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {activity.image ? (
                                <img
                                  src={
                                    activity.image
                                  }
                                  alt={
                                    title
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <ActivityIcon className="h-5 w-5 text-slate-300" />
                                </div>
                              )}
                            </div>

                            <p className="max-w-sm font-semibold text-slate-900">
                              {
                                title
                              }
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-slate-600">
                            {
                              category
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <ScopeIcon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900">
                                {
                                  scopeName
                                }
                              </p>

                              <p className="mt-1 text-xs font-medium text-slate-500">
                                {getScopeLabel(
                                  activity.scopeType
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays className="h-4 w-4 text-slate-400" />

                            {
                              activity.date
                            }
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}