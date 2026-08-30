import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  Activity,
  LocalizedText,
} from "@/types/activity";

import type {
  ReportsData,
  ReportCategoryItem,
  ReportCollegeRankingItem,
  ReportMonthItem,
  ReportScopeItem,
} from "@/types/report";

type CollegeDocument = {
  name: LocalizedText;
};

function getMonthKey(
  dateValue: string
) {
  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}`;
}

export async function getReportsData(): Promise<
  ReportsData
> {
  const [
    activitiesSnapshot,
    collegesSnapshot,
  ] =
    await Promise.all([
      getDocs(
        collection(
          db,
          "activities"
        )
      ),
      getDocs(
        collection(
          db,
          "colleges"
        )
      ),
    ]);

  const activities =
    activitiesSnapshot.docs.map(
      (document) => ({
        id: document.id,
        ...document.data(),
      })
    ) as Activity[];

  const colleges =
    collegesSnapshot.docs.map(
      (document) => ({
        id: document.id,
        ...document.data(),
      })
    ) as Array<
      CollegeDocument & {
        id: string;
      }
    >;

  const collegeActivityCounts =
    new Map<
      string,
      number
    >();

  for (const activity of activities) {
    if (
      activity.scopeType !==
      "college"
    ) {
      continue;
    }

    collegeActivityCounts.set(
      activity.scopeId,
      (
        collegeActivityCounts.get(
          activity.scopeId
        ) ?? 0
      ) + 1
    );
  }

  const collegeRanking: ReportCollegeRankingItem[] =
    colleges
      .map(
        (college) => ({
          id: college.id,
          name:
            college.name,
          activitiesCount:
            collegeActivityCounts.get(
              college.id
            ) ?? 0,
        })
      )
      .sort(
        (a, b) =>
          b.activitiesCount -
          a.activitiesCount
      );

  const scopeCounts =
    new Map<
      ReportScopeItem["scope"],
      number
    >([
      ["college", 0],
      ["student-club", 0],
      ["local-regional", 0],
      ["scientific-society", 0],
    ]);

  for (const activity of activities) {
    const current =
      scopeCounts.get(
        activity.scopeType
      ) ?? 0;

    scopeCounts.set(
      activity.scopeType,
      current + 1
    );
  }

  const scopeDistribution: ReportScopeItem[] =
    Array.from(
      scopeCounts.entries()
    ).map(
      ([
        scope,
        count,
      ]) => ({
        scope,
        count,
      })
    );

  const monthlyCounts =
    new Map<
      string,
      number
    >();

  for (const activity of activities) {
    const month =
      getMonthKey(
        activity.date
      );

    if (!month) {
      continue;
    }

    monthlyCounts.set(
      month,
      (
        monthlyCounts.get(
          month
        ) ?? 0
      ) + 1
    );
  }

  const monthlyActivity: ReportMonthItem[] =
    Array.from(
      monthlyCounts.entries()
    )
      .map(
        ([
          month,
          count,
        ]) => ({
          month,
          count,
        })
      )
      .sort(
        (a, b) =>
          a.month.localeCompare(
            b.month
          )
      );

  const categoryCounts =
    new Map<
      string,
      ReportCategoryItem
    >();

  for (const activity of activities) {
    const key =
      `${activity.category?.en ?? ""}|||${activity.category?.ar ?? ""}`;

    const existing =
      categoryCounts.get(
        key
      );

    if (existing) {
      existing.count += 1;
    } else {
      categoryCounts.set(
        key,
        {
          name: {
            en:
              activity.category
                ?.en ?? "",
            ar:
              activity.category
                ?.ar ?? "",
          },
          count: 1,
        }
      );
    }
  }

  const categoryDistribution =
    Array.from(
      categoryCounts.values()
    ).sort(
      (a, b) =>
        b.count -
        a.count
    );

  return {
    totalActivities:
      activities.length,
    collegeRanking,
    scopeDistribution,
    monthlyActivity,
    categoryDistribution,
  };
}