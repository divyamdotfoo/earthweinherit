import { OpenAIEmbeddings } from "@langchain/openai";
import fs from "fs/promises";
import { supa } from "@/supabase/db";

const llm = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI,
  dimensions: 768,
  model: "text-embedding-3-small",
});

export async function search() {
  const query = process.argv[2];
  if (!query) return;
  const embeddedQuery = await llm.embedQuery(query);
  const { data, error } = await supa.rpc("search", {
    // @ts-expect-error
    embedding: embeddedQuery,
    match_threshold: 0.3,
    match_count: 10,
  });

  fs.writeFile("search.json", JSON.stringify(data));
}

search();
