import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { Activity } from "@/types/activity";
import type {
  AdminCollege,
  College,
} from "@/types/college";

export async function getAdminColleges(): Promise<
  AdminCollege[]
> {
  const [
    collegesSnapshot,
    activitiesSnapshot,
  ] = await Promise.all([
    getDocs(
      collection(
        db,
        "colleges"
      )
    ),
    getDocs(
      collection(
        db,
        "activities"
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

  const activityCounts =
    new Map<string, number>();

  for (const activity of activities) {
    if (
      activity.scopeType !==
      "college"
    ) {
      continue;
    }

    const current =
      activityCounts.get(
        activity.scopeId
      ) ?? 0;

    activityCounts.set(
      activity.scopeId,
      current + 1
    );
  }

  const colleges =
    collegesSnapshot.docs.map(
      (document) => {
        const data =
          document.data() as Omit<
            College,
            "id"
          >;

        return {
          id: document.id,
          ...data,
          activitiesCount:
            activityCounts.get(
              document.id
            ) ?? 0,
        };
      }
    );

  return colleges.sort(
    (a, b) =>
      b.activitiesCount -
      a.activitiesCount
  );
}

export async function getCollegeById(
  collegeId: string
): Promise<College | null> {
  const collegeRef =
    doc(
      db,
      "colleges",
      collegeId
    );

  const snapshot =
    await getDoc(
      collegeRef
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as College;
}

export async function getCollegeActivities(
  collegeId: string
): Promise<Activity[]> {
  const activitiesQuery =
    query(
      collection(
        db,
        "activities"
      ),
      where(
        "scopeType",
        "==",
        "college"
      ),
      where(
        "scopeId",
        "==",
        collegeId
      )
    );

  const snapshot =
    await getDocs(
      activitiesQuery
    );

  const activities =
    snapshot.docs.map(
      (document) => ({
        id: document.id,
        ...document.data(),
      })
    ) as Activity[];

  return activities.sort(
    (a, b) =>
      new Date(
        b.date
      ).getTime() -
      new Date(
        a.date
      ).getTime()
  );
}