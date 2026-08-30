"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Tag,
} from "lucide-react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import {
  useTranslations,
} from "next-intl";

import {
  useAdminActivity,
} from "@/hooks/useAdminActivity";

import {
  useLocale,
} from "@/hooks/useLocale";

export default function AdminActivityDetailsPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const locale =
    useLocale();

  const t =
    useTranslations(
      "ActivityDetails"
    );

  const {
    activity,
    loading,
    error,
  } = useAdminActivity(
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
    !activity
  ) {
    return (
      <div className="space-y-4">
        <Link
          href={`/${locale}/dashboard/activities`}
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

  const title =
    activity.title?.[
      locale === "ar"
        ? "ar"
        : "en"
    ] ||
    activity.title?.en ||
    activity.title?.ar ||
    "";

  const description =
    activity.description?.[
      locale === "ar"
        ? "ar"
        : "en"
    ] ||
    activity.description?.en ||
    activity.description?.ar ||
    t(
      "descriptionUnavailable"
    );

  const category =
    activity.category?.[
      locale === "ar"
        ? "ar"
        : "en"
    ] ||
    activity.category?.en ||
    activity.category?.ar ||
    "-";

  const scopeName =
    activity.scopeName?.[
      locale === "ar"
        ? "ar"
        : "en"
    ] ||
    activity.scopeName?.en ||
    activity.scopeName?.ar ||
    "-";

  return (
    <div className="space-y-8">
      <section>
        <Link
          href={`/${locale}/dashboard/activities`}
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
        <div className="grid lg:grid-cols-[420px_1fr]">
          <div className="h-72 bg-slate-100 lg:h-full lg:min-h-[420px]">
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
              {title}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {
                description
              }
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-600" />

                  <p className="text-sm font-semibold text-slate-500">
                    {t(
                      "date"
                    )}
                  </p>
                </div>

                <p className="mt-3 font-bold text-slate-900">
                  {
                    activity.date
                  }
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-blue-600" />

                  <p className="text-sm font-semibold text-slate-500">
                    {t(
                      "category"
                    )}
                  </p>
                </div>

                <p className="mt-3 font-bold text-slate-900">
                  {
                    category
                  }
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-blue-600" />

                  <p className="text-sm font-semibold text-slate-500">
                    {t(
                      "scope"
                    )}
                  </p>
                </div>

                <p className="mt-3 font-bold text-slate-900">
                  {
                    scopeName
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}