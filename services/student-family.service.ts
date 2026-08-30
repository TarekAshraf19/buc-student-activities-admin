import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  Activity,
  StudentClubCategory,
} from "@/types/activity";

export type StudentFamilyCommittee = {
  id: StudentClubCategory;
  activitiesCount: number;
};

export async function getStudentFamilyCommittees(): Promise<
  StudentFamilyCommittee[]
> {
  const snapshot = await getDocs(
    query(
      collection(db, "activities"),
      where("scopeType", "==", "student-club")
    )
  );

  const activities = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Activity[];

  const committees: StudentClubCategory[] = [
    "social-media",
    "social",
    "sports",
    "cultural",
    "art",
  ];

  return committees.map((committee) => ({
    id: committee,
    activitiesCount: activities.filter(
      (activity) => activity.subcategoryId === committee
    ).length,
  }));
}

export async function getStudentFamilyActivitiesByCategory(
  category: StudentClubCategory
): Promise<Activity[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "activities"),
      where("scopeType", "==", "student-club"),
      where("subcategoryId", "==", category)
    )
  );

  const activities = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Activity[];

  return activities.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );
}

export async function getStudentFamilyNames() {
  const snapshot = await getDocs(
    collection(db, "student_club")
  );

  const names = new Map<
    string,
    {
      en: string;
      ar: string;
    }
  >();

  snapshot.docs.forEach((document) => {
    const data = document.data();

    names.set(document.id, {
      en:
        data.name?.en ??
        data.title?.en ??
        "",
      ar:
        data.name?.ar ??
        data.title?.ar ??
        "",
    });
  });

  return names;
}