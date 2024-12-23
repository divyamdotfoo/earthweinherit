import { Chat } from "@/components/chat";
import { getChatById, getMessagesByChatId } from "@/supabase/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ChatIdPage({ params }: { params: any }) {
  const { id } = (await params) as { id: string };
  const chat = await getChatById(id);

  if (!chat) {
    notFound();
  }

  const messages = await getMessagesByChatId(id);

  return (
    <Suspense>
      <Chat id={id} initialMessages={messages} title={chat.title} />;
    </Suspense>
  );
}
