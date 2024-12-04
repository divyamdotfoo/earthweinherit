import { Database } from "@/supabase/types";
import { createClient } from "@supabase/supabase-js";

export const supa = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
