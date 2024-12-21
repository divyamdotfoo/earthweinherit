import { supa } from "@/supabase/db";
export async function Indicators() {
  const { data, error } = await supa
    .from("climate_change_indicators")
    .select("*");

  return <div>One</div>;
}
