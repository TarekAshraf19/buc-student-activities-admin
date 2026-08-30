import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  Activity,
  LocalizedText,
} from "@/types/activity";

export type LocalRegionalEntity = {
  id: string;
  name: LocalizedText;
};

export type LocalRegionalActivity =
  Activity & {
    entityName: LocalizedText;
  };

export async function getLocalRegionalEntities(): Promise<
  LocalRegionalEntity[]
> {
  const snapshot =
    await getDocs(
      collection(
        db,
        "Local & Regional Activities"
      )
    );

  return snapshot.docs.map(
    (document) => {
      const data =
        document.data();

      return {
        id: document.id,
        name: {
          en:
            data.name?.en ??
            data.title?.en ??
            "",
          ar:
            data.name?.ar ??
            data.title?.ar ??
            "",
        },
      };
    }
  );
}

export async function getLocalRegionalActivities(): Promise<
  LocalRegionalActivity[]
> {
  const [
    activitiesSnapshot,
    entities,
  ] = await Promise.all([
    getDocs(
      query(
        collection(
          db,
          "activities"
        ),
        where(
          "scopeType",
          "==",
          "local-regional"
        )
      )
    ),
    getLocalRegionalEntities(),
  ]);

  const entityMap =
    new Map<
      string,
      LocalizedText
    >();

  entities.forEach(
    (entity) => {
      entityMap.set(
        entity.id,
        entity.name
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

        return {
          ...activity,
          entityName:
            entityMap.get(
              activity.scopeId
            ) ?? {
              en: "",
              ar: "",
            },
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