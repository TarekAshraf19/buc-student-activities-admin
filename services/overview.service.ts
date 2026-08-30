import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { Activity } from "@/types/activity";
import type {
  CollegeRankingItem,
  OverviewData,
} from "@/types/overview";

type CollegeDocument = {
  name?: {
    en?: string;
    ar?: string;
  };
};

export async function getOverviewData(): Promise<OverviewData> {
  const [
    activitiesSnapshot,
    collegesSnapshot,
    studentFamiliesSnapshot,
    scientificSocietiesSnapshot,
    localRegionalSnapshot,
  ] = await Promise.all([
    getDocs(collection(db, "activities")),
    getDocs(collection(db, "colleges")),
    getDocs(collection(db, "student_club")),
    getDocs(
      collection(
        db,
        "Scientific Societies"
      )
    ),
    getDocs(
      collection(
        db,
        "Local & Regional Activities"
      )
    ),
  ]);

  const activities: Activity[] =
    activitiesSnapshot.docs.map(
      (document) => ({
        id: document.id,
        ...document.data(),
      })
    ) as Activity[];

  const collegeActivityCounts =
    new Map<string, number>();

  for (const activity of activities) {
    if (
      activity.scopeType !==
      "college"
    ) {
      continue;
    }

    const currentCount =
      collegeActivityCounts.get(
        activity.scopeId
      ) ?? 0;

    collegeActivityCounts.set(
      activity.scopeId,
      currentCount + 1
    );
  }

  const collegeRanking: CollegeRankingItem[] =
    collegesSnapshot.docs
      .map((document) => {
        const data =
          document.data() as CollegeDocument;

        return {
          id: document.id,
          name: {
            en:
              data.name?.en ??
              "Unknown College",
            ar:
              data.name?.ar ??
              "كلية غير معروفة",
          },
          activitiesCount:
            collegeActivityCounts.get(
              document.id
            ) ?? 0,
        };
      })
      .sort(
        (a, b) =>
          b.activitiesCount -
          a.activitiesCount
      );

  const latestActivities =
    [...activities]
      .sort((a, b) => {
        return (
          new Date(
            b.date
          ).getTime() -
          new Date(
            a.date
          ).getTime()
        );
      })
      .slice(0, 5);

  return {
    totalActivities:
      activities.length,

    totalColleges:
      collegesSnapshot.size,

    totalStudentFamilies:
      studentFamiliesSnapshot.size,

    totalScientificSocieties:
      scientificSocietiesSnapshot.size,

    totalLocalRegional:
      localRegionalSnapshot.size,

    collegeRanking,

    latestActivities,
  };
}