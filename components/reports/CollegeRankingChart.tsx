"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ReportCollegeRankingItem } from "@/types/report";

type CollegeRankingChartProps = {
  data: ReportCollegeRankingItem[];
  locale: string;
};

type ChartItem = {
  name: string;
  activities: number;
};

type CustomTooltipProps = {
  active?: boolean;

  payload?: Array<{
    payload: ChartItem;
    value: number;
  }>;
};

export default function CollegeRankingChart({
  data,
  locale,
}: CollegeRankingChartProps) {
  const isArabic =
    locale === "ar";

  const chartData: ChartItem[] =
    data.map((college) => ({
      name:
        college.name[
          isArabic
            ? "ar"
            : "en"
        ] ||
        college.name.en ||
        college.name.ar ||
        "-",

      activities:
        college.activitiesCount,
    }));

  const chartHeight =
    Math.max(
      520,
      chartData.length * 46
    );

  function CustomTooltip({
    active,
    payload,
  }: CustomTooltipProps) {
    if (
      !active ||
      !payload ||
      payload.length === 0
    ) {
      return null;
    }

    const item =
      payload[0].payload;

    return (
      <div
        dir={
          isArabic
            ? "rtl"
            : "ltr"
        }
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl"
      >
        <p className="text-sm font-bold text-slate-900">
          {item.name}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {isArabic
            ? "عدد الأنشطة"
            : "Activities"}
          :{" "}
          <span className="font-bold text-blue-600">
            {
              item.activities
            }
          </span>
        </p>
      </div>
    );
  }

  return (
    <div
      className="mt-6 w-full"
      dir="ltr"
      style={{
        height:
          chartHeight,
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={
            chartData
          }
          layout="vertical"
          barCategoryGap="30%"
          margin={{
            top: 10,
            right: 50,
            bottom: 20,
            left: 10,
          }}
        >
          <CartesianGrid
            horizontal={
              false
            }
            vertical
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />

          <XAxis
            type="number"
            allowDecimals={
              false
            }
            axisLine={
              false
            }
            tickLine={
              false
            }
            tick={{
              fontSize: 11,
              fill: "#94a3b8",
            }}
          />

          <YAxis
            type="category"
            dataKey="name"
            orientation="left"
            width={
              isArabic
                ? 200
                : 185
            }
            axisLine={
              false
            }
            tickLine={
              false
            }
            tick={{
              fontSize: 12,
              fill: "#334155",
            }}
          />

          <Tooltip
            cursor={{
              fill: "#f8fafc",
            }}
            content={
              <CustomTooltip />
            }
          />

          <Bar
            dataKey="activities"
            fill="#2563eb"
            maxBarSize={26}
            radius={[
              0,
              6,
              6,
              0,
            ]}
          >
            <LabelList
              dataKey="activities"
              position="right"
              fill="#7c3aed"
              fontSize={12}
              fontWeight={700}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}