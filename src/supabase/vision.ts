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
          text: `
       Analyze the climate change image and generate two complementary components for vector search optimization:

1. Summary Component:
- Create a concise, scientifically precise summary of the image's content
- Integrate key scientific terminology naturally
- Provide contextual insights into the climate change information

2. Question Generation Component:
- Develop a diverse set of 10-15 potential questions that could be asked about the image
- Cover a range of depths and perspectives:
  * Basic comprehension questions
  * Advanced scientific inquiry questions
  * Policy and impact-related questions
  * Technical and methodological questions

Ensure the questions:
- Are directly relevant to the image's content
- Span different levels of scientific expertise
- Could potentially match user search queries
- Provide multiple entry points for semantic search

The goal is to create a comprehensive, search-optimized textual representation that allows multiple pathways for discovery and ranking in vector search, enhancing the image's discoverability across various user queries about climate change.

JUST RETURN THE SUMMARY AND THE QUESTIONS AND NOTHING ELSE.
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
      pageContent: res.content,
      metadata: {
        img: `${baseUrl}${imageName}`,
        type: "image",
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
