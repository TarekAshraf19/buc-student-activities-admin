import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  Activity,
  ActivityWithScopeName,
  LocalizedText,
} from "@/types/activity";

type EntityMap =
  Map<string, LocalizedText>;

function getLocalizedName(
  data: Record<string, any>
): LocalizedText {
  return {
    en:
      data.name?.en ??
      data.title?.en ??
      "",
    ar:
      data.name?.ar ??
      data.title?.ar ??
      "",
  };
}

async function getScopeName(
  activity: Activity
): Promise<LocalizedText> {
  let collectionName = "";

  switch (
    activity.scopeType
  ) {
    case "college":
      collectionName =
        "colleges";
      break;

    case "student-club":
      collectionName =
        "student_club";
      break;

    case "scientific-society":
      collectionName =
        "Scientific Societies";
      break;

    case "local-regional":
      collectionName =
        "Local & Regional Activities";
      break;
  }

  if (!collectionName) {
    return {
      en: "",
      ar: "",
    };
  }

  const entityRef = doc(
    db,
    collectionName,
    activity.scopeId
  );

  const entitySnapshot =
    await getDoc(
      entityRef
    );

  if (!entitySnapshot.exists()) {
    return {
      en: "",
      ar: "",
    };
  }

  return getLocalizedName(
    entitySnapshot.data()
  );
}

export async function getAdminActivities(): Promise<
  ActivityWithScopeName[]
> {
  const [
    activitiesSnapshot,
    collegesSnapshot,
    studentFamiliesSnapshot,
    scientificSocietiesSnapshot,
    localRegionalSnapshot,
  ] = await Promise.all([
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

    getDocs(
      collection(
        db,
        "student_club"
      )
    ),

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

  const colleges: EntityMap =
    new Map();

  collegesSnapshot.docs.forEach(
    (document) => {
      colleges.set(
        document.id,
        getLocalizedName(
          document.data()
        )
      );
    }
  );

  const studentFamilies: EntityMap =
    new Map();

  studentFamiliesSnapshot.docs.forEach(
    (document) => {
      studentFamilies.set(
        document.id,
        getLocalizedName(
          document.data()
        )
      );
    }
  );

  const scientificSocieties: EntityMap =
    new Map();

  scientificSocietiesSnapshot.docs.forEach(
    (document) => {
      scientificSocieties.set(
        document.id,
        getLocalizedName(
          document.data()
        )
      );
    }
  );

  const localRegional: EntityMap =
    new Map();

  localRegionalSnapshot.docs.forEach(
    (document) => {
      localRegional.set(
        document.id,
        getLocalizedName(
          document.data()
        )
      );
    }
  );

  const activities =
    activitiesSnapshot.docs.map(
      (document) => {
        const activity = {
          id: document.id,
          ...document.data(),
        } as Activity;

        let scopeName: LocalizedText =
          {
            en: "",
            ar: "",
          };

        switch (
          activity.scopeType
        ) {
          case "college":
            scopeName =
              colleges.get(
                activity.scopeId
              ) ?? scopeName;
            break;

          case "student-club":
            scopeName =
              studentFamilies.get(
                activity.scopeId
              ) ?? scopeName;
            break;

          case "scientific-society":
            scopeName =
              scientificSocieties.get(
                activity.scopeId
              ) ?? scopeName;
            break;

          case "local-regional":
            scopeName =
              localRegional.get(
                activity.scopeId
              ) ?? scopeName;
            break;
        }

        return {
          ...activity,
          scopeName,
        };
      }
    );

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

export async function getAdminActivityById(
  activityId: string
): Promise<ActivityWithScopeName | null> {
  const activityRef = doc(
    db,
    "activities",
    activityId
  );

  const snapshot =
    await getDoc(
      activityRef
    );

  if (!snapshot.exists()) {
    return null;
  }

  const activity = {
    id: snapshot.id,
    ...snapshot.data(),
  } as Activity;

  const scopeName =
    await getScopeName(
      activity
    );

  return {
    ...activity,
    scopeName,
  };
}