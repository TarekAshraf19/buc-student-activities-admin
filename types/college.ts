export type LocalizedText = {
  en: string;
  ar: string;
};

export type College = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  userId: string;
  planName?: string;
  planUrl?: string;
};

export type AdminCollege = College & {
  activitiesCount: number;
};