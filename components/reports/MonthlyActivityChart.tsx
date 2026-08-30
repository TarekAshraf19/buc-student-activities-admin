"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  ReportMonthItem,
} from "@/types/report";

type MonthlyActivityChartProps = {
  data: ReportMonthItem[];
  locale: string;
};

export default function MonthlyActivityChart({
  data,
  locale,
}: MonthlyActivityChartProps) {
  const isArabic =
    locale === "ar";

  return (
    <div
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      className="h-[320px] w-full"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            bottom: 10,
            left: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            reversed={
              isArabic
            }
            tick={{
              fontSize: 12,
            }}
          />

          <YAxis
            allowDecimals={
              false
            }
            orientation={
              isArabic
                ? "right"
                : "left"
            }
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}