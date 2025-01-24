import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { readdir } from "fs/promises";
import path from "path";

async function main() {
  let total = 0;
  const [directory] = process.argv.slice(2);
  const files = (await readdir(directory)).filter((f) => f.endsWith(".pdf"));
  for (const file of files) {
    const loader = new PDFLoader(path.join(directory, file), {
      splitPages: false,
    });
    const data = await loader.load();
    console.log(file, data[0].metadata.pdf.totalPages);
    total += data[0].metadata.pdf.totalPages;
  }
  console.log("total ", total);
}

main();
