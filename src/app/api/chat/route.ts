import { Annotations, ChatContext, saveChatContext } from "@/supabase/queries";
import { supa } from "@/supabase/db";
import {
  checkOrCreateUser,
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
import { NextResponse } from "next/server";
import { Json } from "@/supabase/types";
export async function POST(req: Request) {
  const { id, messages }: { id: string; messages: Message[] } =
    await req.json();

  if (!id || !messages.length) return NextResponse.json({}, { status: 400 });
  let temp = "";
  let annotations: Annotations = [];
  let chatContext: ChatContext = [];
  try {
    const cookiesStore = await cookies();
    const userCookie = cookiesStore.get("user");
    const user = await checkOrCreateUser(userCookie?.value);

    cookiesStore.set("user", user, {
      expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
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
      match_count: 7,
      match_threshold: 0.3,
    });

    const prevAnnotationImages = new Set(
      messages
        .filter((m) => m.role === "assistant")
        .map((m) => m.annotations)
        .flat(2)
        .map((anno: any) => anno.img)
        .filter(Boolean)
    ) as Set<string>;

    annotations =
      vectorSearchResult?.map((v) => ({
        report_name: v.report_name,
        report_url: v.report_url,
        source: v.source,
        source_img: v.source_img,
        similarity: v.similarity,
        img: v.img ? (!prevAnnotationImages.has(v.img) ? v.img : "") : "",
      })) ?? [];

    chatContext =
      vectorSearchResult
        ?.filter((d) => d.type !== "image")
        .map((d) => ({
          content: d.content,
          similarity: d.similarity,
          id: d.id,
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3) ?? [];

    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeMessageAnnotation(annotations);

        const result = streamText({
          model: openai("gpt-4o-mini"),
          system: SystemPrompt(
            JSON.stringify(
              vectorSearchResult?.filter((v) => v.type !== "image") ?? ""
            ),
            chat ? chat.context : null
          ),
          messages: coreMessages,
          onFinish: async ({ text }) => {
            await Promise.all([
              saveMessages([
                {
                  chatid: id,
                  content: text,
                  role: "assistant",
                  annotations: [annotations],
                },
              ]),
              saveChatContext(id, chatContext),
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
      onError: (err) => {
        console.error(err);
        const baseUrl =
          process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
        fetch(`${baseUrl}/api/error`, {
          method: "POST",
          body: JSON.stringify({
            chatid: id,
            content: temp,
            role: "assistant",
            annotations: [annotations],
            chatContext,
          }),
        }).catch((err) => {
          console.error(err);
        });
        return String(err);
      },
    });
  } catch (err) {
    console.log(err);
    await Promise.all([
      saveMessages([
        {
          chatid: id,
          content: temp,
          role: "assistant",
          annotations: [annotations],
        },
      ]),
      saveChatContext(id, chatContext),
    ]);
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

const SystemPrompt = (searchedContent: string, chatContext: Json | null) => `
You are a helpful AI assistant specialized in answering questions about climate change based on scienttific reports like IPCC or UNEP etc. Your primary objectives are:

Key guidelines:
- STRICTLY use the provided context as your primary source of information.
-The provided context is based on the previous user query and the current query.
- TRY to HIGHLIGHT the important numbers and information with BOLD.
- TRY to answer the related information from the retrieved context if you cannot give a direct answer to the question.
- Focus solely on climate change-related questions.
- If a query is outside the scope of climate change politely explain that you cannot assist with the specific question.
-DO NOT incorporate any links in the response.

When responding:
- If the questions demand comparisons or tabular data respond with tables.
- Use citations or quote the specific sections that inform your answer.
- CRITICAL NUMERICAL DATA INSTRUCTION: If the retrieved content contains any numerical data (such as percentages, temperatures, years, quantities, or statistical figures), you MUST:
  1. Identify all numerical values in the retrieved context
  2. Intentionally incorporate these specific numbers into your response
  3. Provide context for these numbers directly from the source material
  4. Ensure the numbers are used accurately and in their original context

Note: The following content is retrieved through a semantic similarity search, meaning these are the most contextually relevant excerpts from scientifc reports based on the user's query. The retrieved content may not be a complete representation of all available information.

[RETRIEVED CONTENT FOR PREVIOUS MESSAGES]

${chatContext}

[RETRIEVED CONTENT FOR THIS MESSAGE]

${searchedContent}
`;
