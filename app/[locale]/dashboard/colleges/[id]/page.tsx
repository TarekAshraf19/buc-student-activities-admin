"use client";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  ExternalLink,
  FileCheck2,
  FileX2,
} from "lucide-react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import {
  useTranslations,
} from "next-intl";

import {
  useAdminCollegeDetails,
} from "@/hooks/useAdminCollegeDetails";

import {
  useLocale,
} from "@/hooks/useLocale";

export default function CollegeDetailsPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const locale =
    useLocale();

  const t =
    useTranslations(
      "CollegeDetails"
    );

  const {
    data,
    loading,
    error,
  } =
    useAdminCollegeDetails(
      params.id
    );

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
      <div className="space-y-4">
        <Link
          href={`/${locale}/dashboard/colleges`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          {locale === "ar" ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}

          {t("back")}
        </Link>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
          {t("error")}
        </div>
      </div>
    );
  }

  const {
    college,
    activities,
  } = data;

  const collegeName =
    college.name?.[
      locale === "ar"
        ? "ar"
        : "en"
    ] ||
    college.name?.en ||
    college.name?.ar ||
    "";

  const collegeDescription =
    college.description?.[
      locale === "ar"
        ? "ar"
        : "en"
    ] ||
    college.description?.en ||
    college.description?.ar ||
    t(
      "descriptionUnavailable"
    );

  const hasPlan =
    Boolean(
      college.planUrl
    );

  return (
    <div className="space-y-8">
      <section>
        <Link
          href={`/${locale}/dashboard/colleges`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          {locale === "ar" ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}

          {t("back")}
        </Link>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="grid lg:grid-cols-[320px_1fr]">
          <div className="h-64 bg-slate-100 lg:h-full lg:min-h-80">
            {college.image ? (
              <img
                src={
                  college.image
                }
                alt={
                  collegeName
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Building2 className="h-16 w-16 text-slate-300" />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold text-blue-600">
              {t(
                "overview"
              )}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {
                collegeName
              }
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {
                collegeDescription
              }
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Activity className="h-5 w-5" />
                  </div>

                  <p className="text-sm font-semibold text-slate-500">
                    {t(
                      "totalActivities"
                    )}
                  </p>
                </div>

                <p className="mt-4 text-3xl font-bold text-slate-900">
                  {
                    activities.length
                  }
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      hasPlan
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {hasPlan ? (
                      <FileCheck2 className="h-5 w-5" />
                    ) : (
                      <FileX2 className="h-5 w-5" />
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-500">
                    {t(
                      "planStatus"
                    )}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p
                    className={`text-base font-bold ${
                      hasPlan
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }`}
                  >
                    {hasPlan
                      ? t(
                          "submitted"
                        )
                      : t(
                          "notSubmitted"
                        )}
                  </p>

                  {hasPlan &&
                    college.planUrl && (
                      <a
                        href={
                          college.planUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <ExternalLink className="h-4 w-4" />

                        {t(
                          "openPlan"
                        )}
                      </a>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t(
                "latestActivities"
              )}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {activities.length}{" "}
              {t(
                "activities"
              )}
            </p>
          </div>
        </div>

        {activities.length ===
        0 ? (
          <div className="p-10 text-center">
            <Activity className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              {t(
                "noActivities"
              )}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map(
              (
                activity
              ) => {
                const activityTitle =
                  activity.title?.[
                    locale ===
                    "ar"
                      ? "ar"
                      : "en"
                  ] ||
                  activity.title?.en ||
                  activity.title?.ar ||
                  "";

                const activityCategory =
                  activity.category?.[
                    locale ===
                    "ar"
                      ? "ar"
                      : "en"
                  ] ||
                  activity.category?.en ||
                  activity.category?.ar ||
                  "-";

                return (
                  <article
                    key={
                      activity.id
                    }
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6"
                  >
                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-24">
                      {activity.image ? (
                        <img
                          src={
                            activity.image
                          }
                          alt={
                            activityTitle
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Activity className="h-6 w-6 text-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900">
                        {
                          activityTitle
                        }
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />

                          {t(
                            "activityDate"
                          )}
                          :{" "}
                          {
                            activity.date
                          }
                        </span>

                        <span>
                          {t(
                            "activityCategory"
                          )}
                          :{" "}
                          {
                            activityCategory
                          }
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/${locale}/dashboard/activities/${activity.id}`}
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      {t(
                        "viewActivity"
                      )}
                    </Link>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
}