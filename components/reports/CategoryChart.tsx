"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  ReportCategoryItem,
} from "@/types/report";

type CategoryChartProps = {
  data: ReportCategoryItem[];
  locale: string;
};

export default function CategoryChart({
  data,
  locale,
}: CategoryChartProps) {
  const isArabic =
    locale === "ar";

  const chartData =
    data.map((item) => ({
      name:
        item.name[
          isArabic
            ? "ar"
            : "en"
        ] ||
        item.name.en ||
        item.name.ar ||
        "-",

      count: item.count,
    }));

  return (
    <div
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      className="h-[360px] w-full"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            bottom: 50,
            left: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            reversed={
              isArabic
            }
            angle={
              isArabic
                ? 25
                : -25
            }
            textAnchor={
              isArabic
                ? "start"
                : "end"
            }
            interval={0}
            tick={{
              fontSize: 11,
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

          <Bar
            dataKey="count"
            fill="#8b5cf6"
            radius={[
              6,
              6,
              0,
              0,
            ]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}