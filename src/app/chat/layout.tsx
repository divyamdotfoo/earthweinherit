import { Sidebar } from "@/components/sidebar";
import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { Chats, getChatsByUser } from "@/supabase/queries";
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const headerList = await headers();
  const user = cookieStore.get("user");
  let fallbackChatItems: Chats = [];
  if (user?.value) {
    const chats = await getChatsByUser(user?.value);
    if (chats.length) {
      fallbackChatItems = chats;
    }
  }

  const userAgent = headerList.get("user-agent") ?? "";
  const isMobile = /Mobi|Android/i.test(userAgent);
  return (
    <div className="md:flex w-full items-start">
      <Suspense>
        <Sidebar isMobile={isMobile} fallbackChats={fallbackChatItems} />
      </Suspense>
      {children}
    </div>
  );
}
