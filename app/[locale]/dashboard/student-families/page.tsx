"use client";

import {
  ArrowLeft,
  ArrowRight,
  Palette,
  Radio,
  Trophy,
  Users,
  Volleyball,
} from "lucide-react";

import Link from "next/link";

import {
  useTranslations,
} from "next-intl";

import {
  useLocale,
} from "@/hooks/useLocale";

import {
  useStudentFamilyCommittees,
} from "@/hooks/useStudentFamilies";

import type {
  StudentClubCategory,
} from "@/types/activity";

export default function StudentFamiliesPage() {
  const locale =
    useLocale();

  const t =
    useTranslations(
      "StudentFamilies"
    );

  const {
    committees,
    loading,
    error,
  } =
    useStudentFamilyCommittees();

  const getIcon = (
    category: StudentClubCategory
  ) => {
    switch (category) {
      case "social-media":
        return Radio;

      case "social":
        return Users;

      case "sports":
        return Volleyball;

      case "cultural":
        return Trophy;

      case "art":
        return Palette;

      default:
        return Users;
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

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {committees.map(
          (committee) => {
            const Icon =
              getIcon(
                committee.id
              );

            return (
              <article
                key={
                  committee.id
                }
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
                    <p className="text-xl font-bold text-slate-900">
                      {
                        committee.activitiesCount
                      }
                    </p>

                    <p className="text-xs font-medium text-slate-500">
                      {t(
                        "activities"
                      )}
                    </p>
                  </div>
                </div>

                <h2 className="mt-6 text-lg font-bold text-slate-900">
                  {t(
                    `committees.${committee.id}`
                  )}
                </h2>

                <Link
                  href={`/${locale}/dashboard/student-families/${committee.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
                >
                  {t(
                    "viewCommittee"
                  )}

                  {locale ===
                  "ar" ? (
                    <ArrowLeft className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Link>
              </article>
            );
          }
        )}
      </section>
    </div>
  );
}