import {
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/lib/firebase";

import type { Admin } from "@/types/admin";

export async function loginAdmin(
  email: string,
  password: string
): Promise<User> {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user =
    credential.user;

  const adminRef =
    doc(
      db,
      "admins",
      user.uid
    );

  const adminSnapshot =
    await getDoc(adminRef);

  if (!adminSnapshot.exists()) {
    await signOut(auth);

    throw new Error(
      "You are not authorized to access the admin portal."
    );
  }

  const adminData =
    adminSnapshot.data() as Omit<
      Admin,
      "uid"
    >;

  if (
    adminData.role !== "admin" ||
    adminData.active !== true
  ) {
    await signOut(auth);

    throw new Error(
      "Your admin account is inactive or unauthorized."
    );
  }

  return user;
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}