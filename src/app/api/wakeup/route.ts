import { Database } from "@/supabase/types";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// My first response from the chatbot gets cut off in the middle every time, maybe this cron will fix it

export async function GET() {
  const store = await headers();
  const secret = store.get("secret");
  if (!secret || secret !== process.env.SECRET!)
    return NextResponse.json({}, { status: 500 });

  const supa = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  await supa.from("page").select("*").limit(100);

  return NextResponse.json({}, { status: 200 });
}
