import { getChatsByUser } from "@/supabase/queries";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const store = await cookies();
    const user = store.get("user")?.value ?? null;
    if (!user) return NextResponse.json({ data: [] }, { status: 200 });

    const chats = await getChatsByUser(user);
    return NextResponse.json({ data: chats }, { status: 200 });
  } catch (err) {
    return NextResponse.json({}, { status: 500 });
  }
}
