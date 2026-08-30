"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Activity,
  Building2,
  ExternalLink,
  FileCheck2,
  FileX2,
  Search,
} from "lucide-react";

import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  useAdminColleges,
} from "@/hooks/useAdminColleges";

import {
  useLocale,
} from "@/hooks/useLocale";

export default function CollegesPage() {
  const t =
    useTranslations(
      "Colleges"
    );

  const locale =
    useLocale();

  const {
    colleges,
    loading,
    error,
  } =
    useAdminColleges();

  const [
    search,
    setSearch,
  ] = useState("");

  const filteredColleges =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return colleges;
      }

      return colleges.filter(
        (college) => {
          const nameEn =
            college.name?.en
              ?.toLowerCase() ??
            "";

          const nameAr =
            college.name?.ar ??
            "";

          return (
            nameEn.includes(
              query
            ) ||
            nameAr.includes(
              search.trim()
            )
          );
        }
      );
    }, [
      colleges,
      search,
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
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
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
        </div>

        <div className="relative w-full lg:max-w-sm">
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
            className="h-12 w-full rounded-xl border border-slate-200 bg-white ps-11 pe-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </section>

      {filteredColleges.length ===
      0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Building2 className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            {t(
              "noResults"
            )}
          </p>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredColleges.map(
            (college) => {
              const collegeName =
                college.name?.[
                  locale ===
                  "ar"
                    ? "ar"
                    : "en"
                ] ||
                college.name?.en ||
                college.name?.ar ||
                "";

              const hasPlan =
                Boolean(
                  college.planUrl
                );

              return (
                <article
                  key={
                    college.id
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300"
                >
                  <div className="relative h-44 bg-slate-100">
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
                        <Building2 className="h-12 w-12 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="line-clamp-2 min-h-14 text-lg font-bold text-slate-900">
                      {
                        collegeName
                      }
                    </h2>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Activity className="h-4 w-4" />

                          <span className="text-xs font-semibold">
                            {t(
                              "activities"
                            )}
                          </span>
                        </div>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {
                            college.activitiesCount
                          }
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          {hasPlan ? (
                            <FileCheck2 className="h-4 w-4" />
                          ) : (
                            <FileX2 className="h-4 w-4" />
                          )}

                          <span className="text-xs font-semibold">
                            {t(
                              "plan"
                            )}
                          </span>
                        </div>

                        <p
                          className={`mt-2 text-sm font-bold ${
                            hasPlan
                              ? "text-emerald-600"
                              : "text-slate-500"
                          }`}
                        >
                          {hasPlan
                            ? t(
                                "planAvailable"
                              )
                            : t(
                                "noPlan"
                              )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                      <Link
                        href={`/${locale}/dashboard/colleges/${college.id}`}
                        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        {t(
                          "viewDetails"
                        )}
                      </Link>

                      {hasPlan &&
                        college.planUrl && (
                          <a
                            href={
                              college.planUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            <ExternalLink className="h-4 w-4" />

                            {t(
                              "viewPlan"
                            )}
                          </a>
                        )}
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </section>
      )}
    </div>
  );
}