import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  AdministrationAccount,
  AdministrationAccountType,
  AdministrationStats,
  LocalizedText,
} from "@/types/administration";

type FirestoreEntityData = {
  name?: LocalizedText | string;
  title?: LocalizedText | string;

  userId?: string;
  email?: string;

  role?: string;
  active?: boolean;
};

function normalizeLocalizedText(
  value?: LocalizedText | string
): LocalizedText {
  if (!value) {
    return {
      en: "Unknown",
      ar: "غير معروف",
    };
  }

  if (typeof value === "string") {
    return {
      en: value,
      ar: value,
    };
  }

  return {
    en: value.en || value.ar || "Unknown",
    ar: value.ar || value.en || "غير معروف",
  };
}

function getCollectionName(
  type: AdministrationAccountType
): string {
  switch (type) {
    case "college":
      return "colleges";

    case "student-club":
      return "student_club";

    case "local-regional":
      return "Local & Regional Activities";

    case "scientific-society":
      return "Scientific Societies";

    case "admin":
      return "admins";
  }
}

async function getAccountsFromCollection(
  collectionName: string,
  type: AdministrationAccountType
): Promise<AdministrationAccount[]> {
  const snapshot = await getDocs(
    collection(db, collectionName)
  );

  return snapshot.docs.map((document) => {
    const data =
      document.data() as FirestoreEntityData;

    return {
      id: document.id,

      name: normalizeLocalizedText(
        data.name || data.title
      ),

      type,

      userId: data.userId,
      email: data.email,

      role: data.role,

      // Existing accounts without the field
      // are considered active.
      active: data.active !== false,
    };
  });
}

export async function getAdministrationAccounts(): Promise<
  AdministrationAccount[]
> {
  const [
    colleges,
    studentClubs,
    localRegional,
    scientificSocieties,
    admins,
  ] = await Promise.all([
    getAccountsFromCollection(
      "colleges",
      "college"
    ),

    getAccountsFromCollection(
      "student_club",
      "student-club"
    ),

    getAccountsFromCollection(
      "Local & Regional Activities",
      "local-regional"
    ),

    getAccountsFromCollection(
      "Scientific Societies",
      "scientific-society"
    ),

    getAccountsFromCollection(
      "admins",
      "admin"
    ),
  ]);

  return [
    ...colleges,
    ...studentClubs,
    ...localRegional,
    ...scientificSocieties,
    ...admins,
  ];
}

export async function updateAdministrationAccountStatus(
  account: AdministrationAccount,
  active: boolean
): Promise<void> {
  const collectionName =
    getCollectionName(account.type);

  const accountRef = doc(
    db,
    collectionName,
    account.id
  );

  await updateDoc(accountRef, {
    active,
  });
}

export function getAdministrationStats(
  accounts: AdministrationAccount[]
): AdministrationStats {
  return {
    total: accounts.length,

    colleges: accounts.filter(
      (account) =>
        account.type === "college"
    ).length,

    studentClubs: accounts.filter(
      (account) =>
        account.type === "student-club"
    ).length,

    localRegional: accounts.filter(
      (account) =>
        account.type === "local-regional"
    ).length,

    scientificSocieties: accounts.filter(
      (account) =>
        account.type ===
        "scientific-society"
    ).length,

    admins: accounts.filter(
      (account) =>
        account.type === "admin"
    ).length,
  };
}