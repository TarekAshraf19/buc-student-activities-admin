export type LocalizedText = {
  en: string;
  ar: string;
};

export type AdministrationAccountType =
  | "college"
  | "student-club"
  | "local-regional"
  | "scientific-society"
  | "admin";

export type AdministrationAccount = {
  id: string;
  name: LocalizedText;
  type: AdministrationAccountType;

  userId?: string;
  email?: string;

  role?: string;
  active?: boolean;
};

export type AdministrationStats = {
  total: number;
  colleges: number;
  studentClubs: number;
  localRegional: number;
  scientificSocieties: number;
  admins: number;
};