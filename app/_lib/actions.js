"use server";

import { redirect } from "next/dist/server/api-utils";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}
