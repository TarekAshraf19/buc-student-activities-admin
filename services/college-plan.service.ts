import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  College,
} from "@/types/college";

type LocalizedText = {
  en: string;
  ar: string;
};

type CollegePlanSemester =
  | "first"
  | "second"
  | "summer";

type StructuredPlanItem = {
  id: string;

  title: LocalizedText;

  category: LocalizedText;

  plannedDate: string;

  status:
    | "planned"
    | "in-progress"
    | "completed"
    | "cancelled";

  activityId?: string;
};

type StructuredCollegePlan = {
  collegeId: string;

  academicYear: string;

  semester: CollegePlanSemester;

  items: StructuredPlanItem[];
};

export type AdminCollegePlan = {
  collegeId: string;

  collegeName: LocalizedText;

  collegeImage: string;

  planName: string | null;
  planUrl: string | null;

  hasPlan: boolean;
  hasStructuredPlan: boolean;

  academicYear: string | null;

  semester:
    | CollegePlanSemester
    | null;

  plannedActivities: number;

  completedActivities: number;

  completionRate: number;
};

export async function getAdminCollegePlans(): Promise<
  AdminCollegePlan[]
> {
  const [
    collegesSnapshot,
    structuredPlansSnapshot,
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
        "collegePlans"
      )
    ),

    getDocs(
      collection(
        db,
        "activities"
      )
    ),
  ]);

  const activityIds =
    new Set(
      activitiesSnapshot.docs.map(
        (document) =>
          document.id
      )
    );

  const structuredPlansMap =
    new Map<
      string,
      StructuredCollegePlan
    >();

  structuredPlansSnapshot.docs.forEach(
    (document) => {
      const data =
        document.data() as Partial<StructuredCollegePlan>;

      const collegeId =
        data.collegeId ||
        document.id;

      structuredPlansMap.set(
        collegeId,
        {
          collegeId,

          academicYear:
            data.academicYear ||
            "",

          semester:
            data.semester ||
            "first",

          items:
            Array.isArray(
              data.items
            )
              ? data.items
              : [],
        }
      );
    }
  );

  const plans =
    collegesSnapshot.docs.map(
      (document) => {
        const college = {
          id: document.id,
          ...document.data(),
        } as College;

        const structuredPlan =
          structuredPlansMap.get(
            college.id
          );

        const planName =
          college.planName?.trim() ||
          null;

        const planUrl =
          college.planUrl?.trim() ||
          null;

        const items =
          structuredPlan?.items ||
          [];

        const plannedActivities =
          items.length;

        const completedActivities =
          items.filter(
            (item) =>
              Boolean(
                item.activityId
              ) &&
              activityIds.has(
                item.activityId as string
              )
          ).length;

        const completionRate =
          plannedActivities > 0
            ? Math.round(
                (
                  completedActivities /
                  plannedActivities
                ) * 100
              )
            : 0;

        return {
          collegeId:
            college.id,

          collegeName:
            college.name,

          collegeImage:
            college.image,

          planName,
          planUrl,

          hasPlan:
            Boolean(
              planUrl ||
              structuredPlan
            ),

          hasStructuredPlan:
            Boolean(
              structuredPlan
            ),

          academicYear:
            structuredPlan
              ?.academicYear ||
            null,

          semester:
            structuredPlan
              ?.semester ||
            null,

          plannedActivities,

          completedActivities,

          completionRate,
        };
      }
    );

  return plans.sort(
    (a, b) => {
      if (
        a.hasPlan !==
        b.hasPlan
      ) {
        return a.hasPlan
          ? -1
          : 1;
      }

      if (
        a.completionRate !==
        b.completionRate
      ) {
        return (
          b.completionRate -
          a.completionRate
        );
      }

      return (
        a.collegeName.en ||
        ""
      ).localeCompare(
        b.collegeName.en ||
          ""
      );
    }
  );
}