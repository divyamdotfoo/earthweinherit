"use server";

import { supa } from "./supabase/db";

export async function deleteChat(id: string) {
  return supa.from("chat").delete().eq("id", id);
}

export async function getChatById(id: string) {
  return supa.from("chat").select("*").eq("id", id);
}
