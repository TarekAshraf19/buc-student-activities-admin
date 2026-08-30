"use client";

import {
  Activity as ActivityIcon,
  CalendarDays,
  FlaskConical,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  useLocale,
} from "@/hooks/useLocale";

import {
  useScientificSocieties,
} from "@/hooks/useScientificSocieties";

export default function ScientificSocietiesPage() {
  const locale =
    useLocale();

  const t =
    useTranslations(
      "ScientificSocieties"
    );

  const {
    entities,
    activities,
    loading,
    error,
  } =
    useScientificSocieties();

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
          {t("eyebrow")}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          {t("description")}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ActivityIcon className="h-5 w-5" />
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
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FlaskConical className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {t(
                "totalEntities"
              )}
            </p>
          </div>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {
              entities.length
            }
          </p>
        </article>
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
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50">
                <tr className="text-sm text-slate-500">
                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "activity"
                    )}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t(
                      "entity"
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

                    const entityName =
                      activity
                        .entityName?.[
                        locale ===
                        "ar"
                          ? "ar"
                          : "en"
                      ] ||
                      activity
                        .entityName
                        ?.en ||
                      activity
                        .entityName
                        ?.ar ||
                      "-";

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
                            <FlaskConical className="h-4 w-4 text-blue-500" />

                            <span className="text-sm font-semibold text-slate-700">
                              {
                                entityName
                              }
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {
                            category
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