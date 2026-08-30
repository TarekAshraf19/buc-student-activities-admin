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

export type ScientificSocietyEntity = {
  id: string;
  name: LocalizedText;
};

export type ScientificSocietyActivity =
  Activity & {
    entityName: LocalizedText;
  };

export async function getScientificSocietyEntities(): Promise<
  ScientificSocietyEntity[]
> {
  const snapshot =
    await getDocs(
      collection(
        db,
        "Scientific Societies"
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

export async function getScientificSocietyActivities(): Promise<
  ScientificSocietyActivity[]
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
          "scientific-society"
        )
      )
    ),
    getScientificSocietyEntities(),
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