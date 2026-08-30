"use client";

import {
  Activity as ActivityIcon,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Users,
} from "lucide-react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import {
  useTranslations,
} from "next-intl";

import {
  useLocale,
} from "@/hooks/useLocale";

import {
  useStudentFamilyCategory,
} from "@/hooks/useStudentFamilies";

import type {
  StudentClubCategory,
} from "@/types/activity";

const validCategories: StudentClubCategory[] = [
  "social-media",
  "social",
  "sports",
  "cultural",
  "art",
];

export default function StudentFamilyCategoryPage() {
  const params =
    useParams<{
      category: string;
    }>();

  const locale =
    useLocale();

  const t =
    useTranslations(
      "StudentFamilies"
    );

  const category =
    validCategories.includes(
      params.category as StudentClubCategory
    )
      ? (params.category as StudentClubCategory)
      : null;

  const {
    activities,
    loading,
    error,
  } =
    useStudentFamilyCategory(
      category ??
        "social-media"
    );

  if (!category) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {t("error")}
      </div>
    );
  }

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
        <Link
          href={`/${locale}/dashboard/student-families`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          {locale === "ar" ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}

          {t("back")}
        </Link>

        <p className="mt-6 text-sm font-semibold text-blue-600">
          {t(
            "committeeActivities"
          )}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {t(
            `committees.${category}`
          )}
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          {t(
            "activities"
          )}
          :{" "}
          <span className="font-bold text-slate-900">
            {
              activities.length
            }
          </span>
        </p>
      </section>

      {activities.length ===
      0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <ActivityIcon className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            {t(
              "noActivities"
            )}
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-slate-50">
                <tr className="text-sm text-slate-500">
                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "activities"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "family"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "category"
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
                {activities.map(
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

                    const categoryName =
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

                    const familyName =
                      activity
                        .familyName?.[
                        locale ===
                        "ar"
                          ? "ar"
                          : "en"
                      ] ||
                      activity
                        .familyName
                        ?.en ||
                      activity
                        .familyName
                        ?.ar ||
                      "-";

                    return (
                      <tr
                        key={
                          activity.id
                        }
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
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

                            <p className="font-semibold text-slate-900">
                              {
                                title
                              }
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />

                            <span className="text-sm font-semibold text-slate-700">
                              {
                                familyName
                              }
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {
                            categoryName
                          }
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