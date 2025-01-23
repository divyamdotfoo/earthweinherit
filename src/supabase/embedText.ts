import { OpenAIEmbeddings } from "@langchain/openai";
import { getEncoding } from "js-tiktoken";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TokenTextSplitter } from "@langchain/textsplitters";
// import fs from "fs/promises";
export const supa = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const getTokenCount = (z: string) => getEncoding("gpt2").encode(z).length;

const llm = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI,
  dimensions: 768,
  model: "text-embedding-3-small",
});

async function main() {
  const filePath = process.argv[2];
  if (!filePath) return;
  const pdfLoader = new PDFLoader(filePath, { splitPages: false });

  const pdfData = await pdfLoader.load();

  const tokenSplitter = new TokenTextSplitter({
    chunkSize: 256,
    chunkOverlap: 20,
  });

  const documents = (await tokenSplitter.splitDocuments(pdfData)).map((d) => ({
    pageContent: d.pageContent.replace(/[^\x20-\x7E]/g, ""),
  }));
  // fs.writeFile("data.json", JSON.stringify(documents));

  // return;
  const data = await Promise.all(
    documents.map(async (d) => ({
      content: d.pageContent,
      token_count: 256,
      report_name: "For people and planet: the UNEP strategy for 2022-2025",
      report_url:
        "https://www.unep.org/resources/people-and-planet-unep-strategy-2022-2025",
      type: "report",
      img: null,
      source: "UNEP",
      source_img: "https://www.google.com/s2/favicons?sz=64&domain=unep.org/",
      embedding: await llm.embedQuery(d.pageContent),
    }))
  );
  console.log(data.length);
  const res = await supa.from("page").insert(data);
  console.log(res);
}

main();
