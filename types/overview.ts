import type { Activity } from "@/types/activity";

export type CollegeRankingItem = {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  activitiesCount: number;
};

export type OverviewData = {
  totalActivities: number;
  totalColleges: number;
  totalStudentFamilies: number;
  totalScientificSocieties: number;
  totalLocalRegional: number;
  collegeRanking: CollegeRankingItem[];
  latestActivities: Activity[];
};