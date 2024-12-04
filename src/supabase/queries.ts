import "server-only";

import { supa } from "@/supabase/db";
import { JSONValue, Message } from "ai";
import { customAlphabet } from "nanoid";

export async function getChatsByUser(user: string) {
  const { data: chats, error } = await supa
    .from("chat")
    .select("*")
    .eq("userid", user);
  if (error) return [];
  return chats;
}

export type Chats = Awaited<ReturnType<typeof getChatsByUser>>;

export async function getChatById(chatId: string) {
  try {
    const { data, error } = await supa.from("chat").select().eq("id", chatId);
    if (error) throw new Error();
    return data[0];
  } catch (error) {
    console.error("DB fails, when getting chat from id", error);
    throw error;
  }
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
    const { data, error } = await supa
      .from("chat")
      .insert({ id, title, userid: user });
    if (error) throw new Error();
  } catch (err) {
    console.error("DB fails, when creating new chat");
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

export async function checkAndCreateUser(user: string | undefined) {
  if (user) return user;
  const userId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUYWXYZ123456789", 10)(10);

  await supa.from("user").insert({ id: userId });

  return userId;
}
