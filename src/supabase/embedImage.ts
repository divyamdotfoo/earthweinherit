import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import fs from "fs/promises";
import path from "path";
import { getEncoding } from "js-tiktoken";

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI,
  model: "gpt-4o-mini",
  maxTokens: 800,
});

const embed = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI,
  dimensions: 768,
  model: "text-embedding-3-small",
});

const getTokenCount = (z: string) => getEncoding("gpt2").encode(z).length;

const generateSummaryForImage = async (
  imagePath: string,
  imageName: string,
  baseUrl = "https://bjidogcgmawofbnescun.supabase.co/storage/v1/object/public/ipcc/"
) => {
  try {
    const imageData = await fs.readFile(imagePath);
    console.log("read image", imagePath);
    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: `
          Analyze the climate change image and generate a concise summary optimized for semantic search. The summary should:

          1. Provide a scientifically precise and concise description of the image's content.
          2. Use relevant scientific terminology naturally to enhance discoverability in vector search.
          3. Highlight key contextual insights related to climate change, ensuring that the summary reflects the image's core message.

         Ensure the summary is comprehensive and informative, making it suitable for matching a wide range of semantic search queries. However, avoid verbosity and keep the summary cohesive.

          JUST RETURN THE SUMMARY AND NOTHING ELSE.

`,
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${imageData.toString("base64")}`,
          },
        },
      ],
    });

    const res = await llm.invoke([message]);

    console.log("summary ", imagePath, res.content.slice(1, 50));

    return {
      content: res.content,
      token_count: getTokenCount(res.content as string),
      report_name: "",
      report_url: "",
      type: "image",
      img: `${baseUrl}${imageName}`,
      source: "",
      source_img: "",
      embedding: await embed.embedQuery(res.content as string),
    };
  } catch (error) {
    console.error(`Error processing image ${imageName}:`, error);
    return null;
  }
};

const processDirectory = async (directory: string) => {
  try {
    const files = await fs.readdir(directory);
    const pngFiles = files.filter((file) => file.endsWith(".png"));

    const data = [];

    const summaries = await Promise.all(
      pngFiles.map((file) => {
        const filePath = path.join(directory, file);
        return generateSummaryForImage(filePath, file);
      })
    );

    data.push(...summaries.filter((summary) => summary !== null));

    await fs.writeFile("data.json", JSON.stringify(data, null, 2));
    console.log("Summaries written to data.json");
  } catch (error) {
    console.error("Error processing directory:");
  }
};

const [directory] = process.argv.slice(2);

if (!directory) {
  console.error("Usage: node script.js <directory> <base-url>");
  process.exit(1);
}

processDirectory(directory);
