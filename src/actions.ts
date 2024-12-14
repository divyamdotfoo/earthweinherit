"use server";

import { supa } from "./supabase/db";

export async function deleteChat(id: string) {
  return supa.from("chat").delete().eq("id", id);
}
