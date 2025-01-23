import { supa } from "@/supabase/db";
import { saveChatContext } from "@/supabase/queries";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { chatContext, ...message } = await req.json();
  await supa.from("message").insert(message);
  await saveChatContext(message.chatid, chatContext);
  return NextResponse.json({}, { status: 200 });
}
