import { supa } from "@/supabase/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const store = await headers();
  const secret = store.get("secret");
  if (!secret || secret !== process.env.SECRET!)
    return NextResponse.json({}, { status: 500 });

  const randomIds: number[] = [];

  for (let i = 0; i < 5; i++) {
    randomIds.push(Math.floor(Math.random() * (5000 - 100 + 1)) + 100);
  }

  const { data, error } = await supa
    .from("page")
    .select("id")
    .in("id", randomIds);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(data);

  const ids = data?.map((row) => row.id) || [];

  return NextResponse.json({ cron: "successfull", ids }, { status: 200 });
}
