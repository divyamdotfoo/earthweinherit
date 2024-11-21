import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import fs from "fs/promises";
import path from "path";
const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI,
  model: "gpt-4o-mini",
  maxTokens: 800,
});

const generateSummaryForImage = async (
  imagePath: string,
  imageName: string,
  baseUrl: string
) => {
  try {
    const imageData = await fs.readFile(imagePath);
    console.log("read image", imagePath);
    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: "You are analyzing an image derived from a climate change report. Generate a detailed, standalone summary of the key information and insights represented, ensuring it reads naturally alongside textual data. Focus on communicating the underlying information or findings without directly referencing the image (e.g., avoid phrases like 'this image shows'). Identify and prioritize any specific words, phrases, or technical terms that appear in the image and integrate them naturally into the summary to enhance its relevance. Make the summary concise but comprehensive, capturing all essential points. This summary will be used for embedding and must rank effectively in a vector search alongside textual content.",
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
      pageContent: res.content,
      metaData: {
        img: `${baseUrl}${imageName}`,
      },
    };
  } catch (error) {
    console.error(`Error processing image ${imageName}:`, error);
    return null;
  }
};

const processDirectory = async (directory: string, baseUrl: string) => {
  try {
    const files = await fs.readdir(directory);
    const pngFiles = files.filter((file) => file.endsWith(".png"));

    const data = [];

    const summaries = await Promise.all(
      pngFiles.map((file) => {
        const filePath = path.join(directory, file);
        return generateSummaryForImage(filePath, file, baseUrl);
      })
    );

    data.push(...summaries.filter((summary) => summary !== null));

    await fs.writeFile("data.json", JSON.stringify(data, null, 2));
    console.log("Summaries written to data.json");
  } catch (error) {
    console.error("Error processing directory:");
  }
};

const [directory, baseUrl] = process.argv.slice(2);

if (!directory || !baseUrl) {
  console.error("Usage: node script.js <directory> <base-url>");
  process.exit(1);
}

processDirectory(directory, baseUrl);
