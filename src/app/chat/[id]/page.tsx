import { Chat } from "@/components/chat";
import { getChatById, getMessagesByChatId } from "@/supabase/queries";
import { notFound } from "next/navigation";

export default async function ChatIdPage({ params }: { params: any }) {
  const { id } = (await params) as { id: string };
  const chat = await getChatById(id);

  if (!chat) {
    notFound();
  }

  const messages = await getMessagesByChatId(id);

  return <Chat id={id} initialMessages={messages} />;
}
