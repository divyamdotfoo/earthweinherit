import { supa } from "@/supabase/db";
import {
  checkAndCreateUser,
  createChat,
  getChatById,
  saveMessages,
} from "@/supabase/queries";
import { openai } from "@ai-sdk/openai";
import {
  convertToCoreMessages,
  CoreUserMessage,
  generateText,
  Message,
  streamText,
  embed,
  createDataStreamResponse,
} from "ai";
import { cookies } from "next/headers";
export async function POST(req: Request) {
  try {
    const { id, messages }: { id: string; messages: Message[] } =
      await req.json();

    const cookiesStore = await cookies();
    const userCookie = cookiesStore.get("user");
    const user = await checkAndCreateUser(userCookie?.value);
    cookiesStore.set("user", user, {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    const coreMessages = convertToCoreMessages(messages);

    const latestUserMessage = coreMessages
      .filter((m) => m.role === "user")
      .at(-1);
    if (!latestUserMessage) {
      return new Response("No user message found", { status: 400 });
    }

    const chat = await getChatById(id);
    if (!chat) {
      const title = await generateTitleFromUserMessage(latestUserMessage);
      await createChat({ id, title, user: user });
    }

    const [embeddings] = await Promise.all([
      embed({
        model: openai.embedding("text-embedding-3-small", { dimensions: 768 }),
        value: latestUserMessage.content,
      }),
      saveMessages([
        {
          chatid: id,
          content: latestUserMessage.content as string,
          role: latestUserMessage.role,
        },
      ]),
    ]);

    const { data: vectorSearchResult } = await supa.rpc("search", {
      // @ts-expect-error
      embedding: embeddings.embedding,
      match_count: 3,
      match_threshold: 0.3,
    });

    const prevAnnotationsSourceImages = new Set(
      messages
        .filter((m) => m.role === "assistant")
        .map((m) => m.annotations)
        .flat(2)
        // @ts-expect-error
        .map((anno) => anno?.sources)
        .flat(2)
        .map((source) => source?.img)
    ) as Set<string>;

    const annotations = {
      sources: vectorSearchResult
        ? vectorSearchResult?.map((v) => ({
          report: v.report_name,
          url: v.report_url,
          img: v.img
            ? prevAnnotationsSourceImages.has(v.img)
              ? null
              : v.img
            : null,
        }))
        : [],
    };
    let temp = "";
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeMessageAnnotation(annotations);

        const result = streamText({
          model: openai("gpt-4o-mini"),
          system: SystemPrompt(JSON.stringify(vectorSearchResult ?? "")),
          messages: coreMessages,
          onFinish: async ({ text }) => {
            await saveMessages([
              {
                chatid: id,
                content: text,
                role: "assistant",
                annotations: [annotations],
              },
            ]);
          },
          onChunk: async ({ chunk }) => {
            if (chunk.type === "text-delta") {
              temp += chunk.textDelta;
            }
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
      onError: (error) => {
        saveMessages([
          {
            chatid: id,
            content: temp,
            role: "assistant",
            annotations: [annotations],
          },
        ]);
        return error instanceof Error ? error.message : String(error);
      },
    });
  } catch (err) {
    return new Response("Something went wrong on the server", { status: 500 });
  }
}

async function generateTitleFromUserMessage(message: CoreUserMessage) {
  const { text: title } = await generateText({
    model: openai("gpt-4o-mini"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 50 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

const SystemPrompt = (searchedContent: string) => `
You are a helpful AI assistant specialized in answering questions about climate change based exclusively on the IPCC (Intergovernmental Panel on Climate Change) reports. Your primary objectives are:

Key guidelines:
- STRICTLY use the provided IPCC report excerpts as your primary source of information.
- Do not incorporate external knowledge or information not present in the retrieved documents.
- If the retrieved content is insufficient to fully answer the question, acknowledge this transparently.
- Maintain a professional, scientific, and helpful tone.
- Focus solely on climate change-related questions.
- If a query is outside the scope of climate change or cannot be answered using the provided IPCC report content, politely explain that you cannot assist with the specific question.

When responding:
- Directly reference the source material from the IPCC reports.
- Use citations or quote the specific sections that inform your answer.
- Be precise and clear in your explanations.
- If multiple retrieved documents provide insights, synthesize the information coherently.
- CRITICAL NUMERICAL DATA INSTRUCTION: If the retrieved content contains any numerical data (such as percentages, temperatures, years, quantities, or statistical figures), you MUST:
  1. Identify all numerical values in the retrieved content
  2. Intentionally incorporate these specific numbers into your response
  3. Provide context for these numbers directly from the source material
  4. Ensure the numbers are used accurately and in their original context

Remember: Your responses must be grounded exclusively in the IPCC report content provided through the vector search retrieval process.

Note: The following content is retrieved through a semantic similarity search, meaning these are the most contextually relevant excerpts from IPCC reports based on the user's query. The retrieved content may not be a complete representation of all available information.

[RETRIEVED CONTENT WILL BE INSERTED HERE]

${searchedContent}

`;
