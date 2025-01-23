import "server-only";

import { supa } from "@/supabase/db";
import { JSONValue, Message } from "ai";
import { customAlphabet } from "nanoid";
import { Database } from "./types";
import { filterUniqueBasedOn } from "@/lib/utils";
export async function getChatsByUser(user: string) {
  const { data: chats, error } = await supa
    .from("chat")
    .select("*")
    .eq("userid", user)
    .order("createdat", { ascending: false });
  if (error) return [];
  return chats;
}

export type Chats = Awaited<ReturnType<typeof getChatsByUser>>;

export async function getChatById(chatId: string) {
  const { data } = await supa.from("chat").select().eq("id", chatId);
  return data ? data[0] : null;
}

export async function createChat({
  id,
  title,
  user,
}: {
  id: string;
  title: string;
  user: string;
}) {
  try {
    await supa.from("chat").insert({ id, title, userid: user });
  } catch (err) {
    console.error("DB fails, when creating new chat");
    console.log(err);
    throw err;
  }
}

export async function getMessagesByChatId(id: string): Promise<Message[]> {
  try {
    const { data, error } = await supa
      .from("message")
      .select("*")
      .eq("chatid", id)
      .order("createdat", { ascending: true });

    if (error) throw new Error();
    return data.map((d) => ({
      content: d.content,
      id: d.id,
      role: d.role as Message["role"],
      annotations: (d.annotations as unknown as JSONValue[]) ?? [],
    }));
  } catch (error) {
    console.error("DB fails, when getting message from chat id", error);
    throw error;
  }
}

export async function saveMessages(
  messages: {
    chatid: string;
    content: string;
    role: Message["role"];
    annotations?: JSONValue;
  }[]
) {
  await supa.from("message").insert(messages);
}

export async function saveChatContext(chatId: string, context: ChatContext) {
  const prevContextData = await supa
    .from("chat")
    .select("context")
    .eq("id", chatId);

  console.log(prevContextData.data);
  const prevContext =
    Array.isArray(prevContextData.data) && prevContextData.data[0].context
      ? (prevContextData.data[0].context as ChatContext)
      : [];

  const ctx = filterUniqueBasedOn([...prevContext, ...context], "id");
  await supa.from("chat").update({ context: ctx }).eq("id", chatId);
}

export async function checkOrCreateUser(user: string | undefined) {
  if (user) return user;
  const userId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUYWXYZ123456789", 10)(10);

  await supa.from("user").insert({ id: userId });

  return userId;
}

/**
 * @description returns normalised data for carbon-conc, mean-temp, mean-sea, ice-extent
 */
export async function getCarbonTempSeaIceNormalised() {
  const [{ data: carbon }, { data: temp }, { data: sea }, { data: ice }] =
    await Promise.all([
      supa.from("carbon_conc").select("*").order("year", { ascending: true }),
      supa.from("mean_temp").select("*").order("year", { ascending: true }),
      supa.from("mean_sea").select("*").order("year", { ascending: true }),
      supa.from("ice_extent").select("*").order("year", { ascending: true }),
    ]);
  if (!carbon || !temp || !sea || !ice) throw new Error();
  const data = [];
  for (let i = 0; i < 45; i++) {
    data.push({
      year: 1980 + i,
      carbon: carbon[i] ? carbon[i].normalized : null,
      sea: sea[i] ? sea[i].normalized : null,
      temp: temp[i] ? temp[i].normalized : null,
      ice: ice[i] ? ice[i].normalized : null,
    });
  }
  return data;
}

export type CarbonTempSeaIceNormalised = Awaited<
  ReturnType<typeof getCarbonTempSeaIceNormalised>
>;

export async function getCarbonTempSeaIce() {
  const [{ data: carbon }, { data: temp }, { data: sea }, { data: ice }] =
    await Promise.all([
      supa.from("carbon_conc").select("*").order("year", { ascending: true }),
      supa.from("mean_temp").select("*").order("year", { ascending: true }),
      supa.from("mean_sea").select("*").order("year", { ascending: true }),
      supa.from("ice_extent").select("*").order("year", { ascending: true }),
    ]);
  if (!carbon || !temp || !sea || !ice) throw new Error();
  return { carbon, temp, sea, ice };
}

export type CarbonTempSeaIce = Awaited<ReturnType<typeof getCarbonTempSeaIce>>;
export type SingleChartData = CarbonTempSeaIce["carbon"];

export type Annotations = Pick<
  Database["public"]["Functions"]["search"]["Returns"][number],
  "img" | "report_name" | "report_url" | "source" | "source_img" | "similarity"
>[];

export type ChatContext = Pick<
  Database["public"]["Functions"]["search"]["Returns"][number],
  "content" | "similarity" | "id"
>[];
