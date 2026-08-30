"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Activity,
  Building2,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  FileX2,
  Search,
  Target,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  useLocale,
} from "@/hooks/useLocale";

import {
  useAdminCollegePlans,
} from "@/hooks/useAdminCollegePlans";

type PlanFilter =
  | "all"
  | "submitted"
  | "missing";

export default function CollegePlansPage() {
  const locale =
    useLocale();

  const t =
    useTranslations(
      "CollegePlans"
    );

  const {
    plans,
    loading,
    error,
  } =
    useAdminCollegePlans();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] =
    useState<PlanFilter>(
      "all"
    );

  const submittedCount =
    useMemo(
      () =>
        plans.filter(
          (plan) =>
            plan.hasPlan
        ).length,
      [plans]
    );

  const missingCount =
    plans.length -
    submittedCount;

  const totalPlannedActivities =
    useMemo(
      () =>
        plans.reduce(
          (
            total,
            plan
          ) =>
            total +
            plan.plannedActivities,
          0
        ),
      [plans]
    );

  const totalCompletedActivities =
    useMemo(
      () =>
        plans.reduce(
          (
            total,
            plan
          ) =>
            total +
            plan.completedActivities,
          0
        ),
      [plans]
    );

  const overallCompletionRate =
    totalPlannedActivities > 0
      ? Math.round(
          (
            totalCompletedActivities /
            totalPlannedActivities
          ) * 100
        )
      : 0;

  const filteredPlans =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return plans.filter(
        (plan) => {
          const nameEn =
            plan.collegeName
              ?.en
              ?.toLowerCase() ??
            "";

          const nameAr =
            plan.collegeName
              ?.ar ??
            "";

          const planName =
            plan.planName
              ?.toLowerCase() ??
            "";

          const academicYear =
            plan.academicYear
              ?.toLowerCase() ??
            "";

          const matchesSearch =
            !query ||
            nameEn.includes(
              query
            ) ||
            nameAr.includes(
              search.trim()
            ) ||
            planName.includes(
              query
            ) ||
            academicYear.includes(
              query
            );

          const matchesFilter =
            filter ===
              "all" ||
            (
              filter ===
                "submitted" &&
              plan.hasPlan
            ) ||
            (
              filter ===
                "missing" &&
              !plan.hasPlan
            );

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      plans,
      search,
      filter,
    ]);

  const getSemesterLabel = (
    semester:
      | "first"
      | "second"
      | "summer"
      | null
  ) => {
    switch (semester) {
      case "first":
        return t(
          "firstSemester"
        );

      case "second":
        return t(
          "secondSemester"
        );

      case "summer":
        return t(
          "summerSemester"
        );

      default:
        return "-";
    }
  };

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
      {/* Header */}

      <section>
        <p className="text-sm font-semibold text-blue-600">
          {t("eyebrow")}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          {t("description")}
        </p>
      </section>

      {/* Summary */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>

            <span className="text-3xl font-bold text-slate-900">
              {submittedCount}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            {t(
              "submittedPlans"
            )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {missingCount}{" "}
            {t(
              "notSubmitted"
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Target className="h-5 w-5" />
            </div>

            <span className="text-3xl font-bold text-slate-900">
              {
                totalPlannedActivities
              }
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            {t(
              "plannedActivities"
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Activity className="h-5 w-5" />
            </div>

            <span className="text-3xl font-bold text-slate-900">
              {
                totalCompletedActivities
              }
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            {t(
              "completedActivities"
            )}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <span className="text-3xl font-bold text-slate-900">
              {
                overallCompletionRate
              }
              %
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            {t(
              "completionRate"
            )}
          </p>
        </article>
      </section>

      {/* Search */}

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
            value={filter}
            onChange={(
              event
            ) =>
              setFilter(
                event.target
                  .value as PlanFilter
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 lg:min-w-56"
          >
            <option value="all">
              {t("all")}
            </option>

            <option value="submitted">
              {t(
                "submitted"
              )}
            </option>

            <option value="missing">
              {t(
                "notSubmitted"
              )}
            </option>
          </select>
        </div>
      </section>

      {/* Table */}

      {filteredPlans.length ===
      0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            {t(
              "noResults"
            )}
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px]">
              <thead className="bg-slate-50">
                <tr className="text-sm text-slate-500">
                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "college"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "plan"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "academicYear"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "semester"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "progress"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "completionRate"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "status"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "actions"
                    )}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map(
                  (plan) => {
                    const collegeName =
                      plan
                        .collegeName?.[
                        locale ===
                        "ar"
                          ? "ar"
                          : "en"
                      ] ||
                      plan
                        .collegeName
                        ?.en ||
                      plan
                        .collegeName
                        ?.ar ||
                      "-";

                    return (
                      <tr
                        key={
                          plan.collegeId
                        }
                        className="transition hover:bg-slate-50"
                      >
                        {/* College */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {plan.collegeImage ? (
                                <img
                                  src={
                                    plan.collegeImage
                                  }
                                  alt={
                                    collegeName
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Building2 className="h-5 w-5 text-slate-300" />
                                </div>
                              )}
                            </div>

                            <p className="font-bold text-slate-900">
                              {
                                collegeName
                              }
                            </p>
                          </div>
                        </td>

                        {/* Plan */}

                        <td className="px-5 py-4">
                          {plan.hasPlan ? (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 shrink-0 text-blue-500" />

                              <span className="max-w-48 truncate text-sm font-medium text-slate-700">
                                {plan.planName ||
                                  t(
                                    "submitted"
                                  )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              {t(
                                "noPlan"
                              )}
                            </span>
                          )}
                        </td>

                        {/* Academic Year */}

                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {plan.academicYear ||
                            "-"}
                        </td>

                        {/* Semester */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {getSemesterLabel(
                            plan.semester
                          )}
                        </td>

                        {/* Progress */}

                        <td className="px-5 py-4">
                          {plan.hasStructuredPlan ? (
                            <div className="text-sm">
                              <span className="font-bold text-slate-900">
                                {
                                  plan.completedActivities
                                }
                              </span>

                              <span className="text-slate-400">
                                {" "}
                                /{" "}
                                {
                                  plan.plannedActivities
                                }
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">
                              -
                            </span>
                          )}
                        </td>

                        {/* Completion */}

                        <td className="px-5 py-4">
                          {plan.hasStructuredPlan ? (
                            <div className="min-w-32">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-bold text-slate-900">
                                  {
                                    plan.completionRate
                                  }
                                  %
                                </span>
                              </div>

                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-blue-600 transition-all"
                                  style={{
                                    width: `${plan.completionRate}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400">
                              -
                            </span>
                          )}
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          {plan.hasPlan ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                              <FileCheck2 className="h-3.5 w-3.5" />

                              {t(
                                "submitted"
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                              <FileX2 className="h-3.5 w-3.5" />

                              {t(
                                "notSubmitted"
                              )}
                            </span>
                          )}
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/${locale}/dashboard/colleges/${plan.collegeId}`}
                              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4" />

                              {t(
                                "viewCollege"
                              )}
                            </Link>

                            {plan.planUrl && (
                              <a
                                href={
                                  plan.planUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                              >
                                <ExternalLink className="h-4 w-4" />

                                {t(
                                  "openPlan"
                                )}
                              </a>
                            )}
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