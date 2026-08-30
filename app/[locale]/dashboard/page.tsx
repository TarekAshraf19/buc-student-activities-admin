"use client";

import {
  Activity,
  Building2,
  FlaskConical,
  MapPinned,
  Trophy,
  Users,
} from "lucide-react";

import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";
import { useOverview } from "@/hooks/useOverview";

import type {
  ActivityScopeType,
} from "@/types/activity";

export default function DashboardPage() {
  const t =
    useTranslations("Overview");

  const locale =
    useLocale();

  const {
    data,
    loading,
    error,
  } = useOverview();

  const getScopeLabel = (
    scopeType: ActivityScopeType
  ) => {
    switch (scopeType) {
      case "college":
        return t(
          "collegeScope"
        );

      case "student-club":
        return t(
          "studentClubScope"
        );

      case "local-regional":
        return t(
          "localRegionalScope"
        );

      case "scientific-society":
        return t(
          "scientificSocietyScope"
        );

      default:
        return "";
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

  if (
    error ||
    !data
  ) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {t("error")}
      </div>
    );
  }

  const stats = [
    {
      label: t(
        "totalActivities"
      ),
      value:
        data.totalActivities,
      icon: Activity,
    },
    {
      label: t(
        "totalColleges"
      ),
      value:
        data.totalColleges,
      icon: Building2,
    },
    {
      label: t(
        "studentFamilies"
      ),
      value:
        data.totalStudentFamilies,
      icon: Users,
    },
    {
      label: t(
        "scientificSocieties"
      ),
      value:
        data.totalScientificSocieties,
      icon: FlaskConical,
    },
    {
      label: t(
        "localRegional"
      ),
      value:
        data.totalLocalRegional,
      icon: MapPinned,
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold text-blue-600">
          {t("eyebrow")}
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {label}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {value}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Trophy className="h-5 w-5" />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              {t(
                "collegeRanking"
              )}
            </h2>
          </div>

          {data.collegeRanking.length ===
          0 ? (
            <p className="p-6 text-sm text-slate-500">
              {t(
                "noColleges"
              )}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-5 py-3 text-start font-semibold">
                      {t(
                        "rank"
                      )}
                    </th>

                    <th className="px-5 py-3 text-start font-semibold">
                      {t(
                        "college"
                      )}
                    </th>

                    <th className="px-5 py-3 text-start font-semibold">
                      {t(
                        "activities"
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data.collegeRanking.map(
                    (
                      college,
                      index
                    ) => (
                      <tr
                        key={
                          college.id
                        }
                      >
                        <td className="px-5 py-4">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                            {index +
                              1}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {
                            college
                              .name[
                              locale ===
                              "ar"
                                ? "ar"
                                : "en"
                            ]
                          }
                        </td>

                        <td className="px-5 py-4 font-bold text-slate-900">
                          {
                            college.activitiesCount
                          }
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900">
              {t(
                "latestActivities"
              )}
            </h2>
          </div>

          {data.latestActivities
            .length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              {t(
                "noActivities"
              )}
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.latestActivities.map(
                (
                  activity
                ) => (
                  <article
                    key={
                      activity.id
                    }
                    className="flex items-start gap-4 px-5 py-4 sm:px-6"
                  >
                    {activity.image ? (
                      <img
                        src={
                          activity.image
                        }
                        alt={
                          activity
                            .title[
                            locale ===
                            "ar"
                              ? "ar"
                              : "en"
                          ]
                        }
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <Activity className="h-5 w-5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-slate-900">
                        {
                          activity
                            .title[
                            locale ===
                            "ar"
                              ? "ar"
                              : "en"
                          ]
                        }
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                          {t(
                            "scope"
                          )}
                          :{" "}
                          {getScopeLabel(
                            activity.scopeType
                          )}
                        </span>

                        <span>
                          {t(
                            "date"
                          )}
                          :{" "}
                          {
                            activity.date
                          }
                        </span>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}