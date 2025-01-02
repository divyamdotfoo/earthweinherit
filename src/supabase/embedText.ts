import { OpenAIEmbeddings } from "@langchain/openai";
import { getEncoding } from "js-tiktoken";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs/promises";
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

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2500,
    chunkOverlap: 200,
  });

  const documents = await splitter.splitDocuments(pdfData);
  const data = await Promise.all(
    documents.map(async (d) => ({
      content: d.pageContent,
      token_count: getTokenCount(d.pageContent as string),
      report_name: "Global Carbon Budget 2023",
      report_url: "https://essd.copernicus.org/articles/15/5301/2023/",
      type: "report",
      img: null,
      source: "gcb",
      embedding: await llm.embedQuery(d.pageContent),
    }))
  );
  fs.writeFile("data.json", JSON.stringify(data));
  console.log(data.length);
  const res = await supa.from("page").insert(data);
  console.log(res);
}
