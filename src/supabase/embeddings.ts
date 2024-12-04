import fs from "fs/promises";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getEncoding } from "js-tiktoken";
import path from "path";
import { supa } from "@/supabase/db";

const getTokenCount = (z: string) => getEncoding("gpt2").encode(z).length;

const llm = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI,
  dimensions: 768,
  model: "text-embedding-3-small",
});

async function main() {
  const directory = process.argv[2];
  const files = await fs.readdir(directory);
  if (!files) return;
  let index = 0;
  files.forEach(async (f) => {
    const data = JSON.parse(
      await fs.readFile(path.join(directory, f), "utf-8")
    ) as any[];
    const rows = await Promise.all(
      data.map(async (section) => ({
        content: section.pageContent,
        token_count: getTokenCount(section.pageContent as string),
        report_name: section?.metadata?.report ?? null,
        report_url: section?.metadata?.url ?? null,
        type: section?.metadata?.type ?? "",
        img: section?.metadata?.img ?? null,
        embedding: await llm.embedQuery(section.pageContent),
      }))
    );
    index += rows.length;
    console.log("total ", index);
    // @ts-ignore
    const res = await supa.from("page").insert(rows);
    console.log("supa ", res);
  });
}

// main();
