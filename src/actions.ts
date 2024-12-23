"use server";

import { supa } from "./supabase/db";
import { cookies } from "next/headers";
export async function deleteChat(id: string) {
  const cookieStore = await cookies();
  const isUser = cookieStore.get("user");
  if (isUser && isUser.value) {
    await supa.from("chat").delete().eq("id", id).eq("userid", isUser.value);
  }
}

export async function getChatById(id: string) {
  return supa.from("chat").select("*").eq("id", id);
}
