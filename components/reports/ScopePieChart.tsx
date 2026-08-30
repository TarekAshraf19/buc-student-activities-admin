"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useTranslations } from "next-intl";

import type { ReportScopeItem } from "@/types/report";

type ScopePieChartProps = {
  data: ReportScopeItem[];
  locale: string;
};

const COLORS = {
  college: "#2563eb",
  "student-club": "#8b5cf6",
  "local-regional": "#f59e0b",
  "scientific-society": "#10b981",
};

export default function ScopePieChart({
  data,
  locale,
}: ScopePieChartProps) {
  const t = useTranslations("Reports");

  const isArabic = locale === "ar";

  const chartData = data.map((item) => ({
    ...item,
    value: item.count,
    color: COLORS[item.scope],
  }));

  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="mt-5 w-full"
    >
      {/* Legend */}
      <div className="mb-5 flex flex-wrap justify-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: COLORS.college,
            }}
          />
          <span className="text-sm font-semibold text-slate-600">
            {t("collegeScope")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: COLORS["student-club"],
            }}
          />
          <span className="text-sm font-semibold text-slate-600">
            {t("studentClubScope")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: COLORS["local-regional"],
            }}
          />
          <span className="text-sm font-semibold text-slate-600">
            {t("localRegionalScope")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: COLORS["scientific-society"],
            }}
          />
          <span className="text-sm font-semibold text-slate-600">
            {t("scientificSocietyScope")}
          </span>
        </div>
      </div>

      {/* Pie */}
      <div className="relative h-[300px] w-full">
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">
              {total}
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("totalActivities")}
            </p>
          </div>
        </div>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={108}
              paddingAngle={3}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {chartData.map((item) => (
                <Cell
                  key={item.scope}
                  fill={item.color}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [
                value,
                t("activities"),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}