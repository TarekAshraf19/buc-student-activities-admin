export type ReportCollegeRankingItem = {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  activitiesCount: number;
};

export type ReportScopeItem = {
  scope:
    | "college"
    | "student-club"
    | "local-regional"
    | "scientific-society";
  count: number;
};

export type ReportMonthItem = {
  month: string;
  count: number;
};

export type ReportCategoryItem = {
  name: {
    en: string;
    ar: string;
  };
  count: number;
};

export type ReportsData = {
  totalActivities: number;
  collegeRanking: ReportCollegeRankingItem[];
  scopeDistribution: ReportScopeItem[];
  monthlyActivity: ReportMonthItem[];
  categoryDistribution: ReportCategoryItem[];
};