"use client";

import {
  Activity,
  BarChart3,
  Building2,
  CalendarDays,
  Medal,
  Trophy,
} from "lucide-react";

import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";
import { useReports } from "@/hooks/useReports";

import ScopePieChart from "@/components/reports/ScopePieChart";
import CollegeRankingChart from "@/components/reports/CollegeRankingChart";
import MonthlyActivityChart from "@/components/reports/MonthlyActivityChart";
import CategoryChart from "@/components/reports/CategoryChart";

export default function ReportsPage() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const t = useTranslations("Reports");

  const {
    data,
    loading,
    error,
  } = useReports();

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

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {t("error")}
      </div>
    );
  }

  const activeColleges = data.collegeRanking.filter(
    (college) => college.activitiesCount > 0
  ).length;

  const topCollege = data.collegeRanking.find(
    (college) => college.activitiesCount > 0
  );

  const getCollegeName = (
    name: {
      en: string;
      ar: string;
    }
  ) => {
    return (
      name[isArabic ? "ar" : "en"] ||
      name.en ||
      name.ar ||
      "-"
    );
  };

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

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
          {t("description")}
        </p>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total Activities */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {t("totalActivities")}
            </p>
          </div>

          <p className="mt-5 text-3xl font-bold text-slate-900">
            {data.totalActivities}
          </p>
        </article>

        {/* Active Colleges */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Building2 className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {t("activeColleges")}
            </p>
          </div>

          <p className="mt-5 text-3xl font-bold text-slate-900">
            {activeColleges}
          </p>
        </article>

        {/* Top College */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Trophy className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {t("topCollege")}
            </p>
          </div>

          {topCollege ? (
            <>
              <p className="mt-5 font-bold text-slate-900">
                {getCollegeName(
                  topCollege.name
                )}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {topCollege.activitiesCount}{" "}
                {t("activities")}
              </p>
            </>
          ) : (
            <p className="mt-5 text-sm text-slate-400">
              {t("noData")}
            </p>
          )}
        </article>
      </section>

      {/* Pie + Monthly */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Activity Distribution */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-bold text-slate-900">
              {t("scopeDistribution")}
            </h2>
          </div>

          {data.scopeDistribution.some(
            (item) => item.count > 0
          ) ? (
            <ScopePieChart
              data={data.scopeDistribution}
              locale={locale}
            />
          ) : (
            <div className="flex h-[340px] items-center justify-center">
              <p className="text-sm text-slate-400">
                {t("noData")}
              </p>
            </div>
          )}
        </article>

        {/* Monthly Activity */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-bold text-slate-900">
              {t("monthlyActivity")}
            </h2>
          </div>

          {data.monthlyActivity.length > 0 ? (
            <MonthlyActivityChart
              data={data.monthlyActivity}
              locale={locale}
            />
          ) : (
            <div className="flex h-[340px] items-center justify-center">
              <p className="text-sm text-slate-400">
                {t("noData")}
              </p>
            </div>
          )}
        </article>
      </section>

      {/* College Ranking + Category Distribution */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* College Ranking Chart */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-bold text-slate-900">
              {t("collegeRanking")}
            </h2>
          </div>

          {data.collegeRanking.length > 0 ? (
            <CollegeRankingChart
              data={data.collegeRanking}
              locale={locale}
            />
          ) : (
            <div className="flex h-[520px] items-center justify-center">
              <p className="text-sm text-slate-400">
                {t("noData")}
              </p>
            </div>
          )}
        </article>

        {/* Category Distribution */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600" />

            <h2 className="text-lg font-bold text-slate-900">
              {t("categoryDistribution")}
            </h2>
          </div>

          {data.categoryDistribution.length > 0 ? (
            <CategoryChart
              data={data.categoryDistribution}
              locale={locale}
            />
          ) : (
            <div className="flex h-[360px] items-center justify-center">
              <p className="text-sm text-slate-400">
                {t("noData")}
              </p>
            </div>
          )}
        </article>
      </section>

      {/* College Ranking Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <Medal className="h-5 w-5 text-blue-600" />

          <h2 className="text-lg font-bold text-slate-900">
            {t("collegeRanking")}
          </h2>
        </div>

        {data.collegeRanking.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-400">
              {t("noData")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead className="bg-slate-50">
                <tr className="text-sm text-slate-500">
                  <th className="px-5 py-4 text-start font-semibold">
                    {t("rank")}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t("college")}
                  </th>

                  <th className="px-5 py-4 text-start font-semibold">
                    {t("activities")}
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
                      key={college.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {index === 0 ? (
                            <Trophy className="h-4 w-4 text-amber-500" />
                          ) : null}

                          <span className="font-bold text-slate-500">
                            #{index + 1}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {getCollegeName(
                            college.name
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex min-w-12 justify-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                          {
                            college.activitiesCount
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}