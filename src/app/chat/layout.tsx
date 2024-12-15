import { Sidebar, SidebarMobile } from "@/components/sidebar";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Chats, getChatsByUser } from "@/supabase/queries";
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const user = cookieStore.get("user");
  let fallbackChatItems: Chats = [];
  if (user?.value) {
    const chats = await getChatsByUser(user?.value);
    if (chats.length) {
      fallbackChatItems = chats;
    }
  }

  return (
    <SidebarMobile>
      <div className="md:flex w-full items-start">
        <Suspense>
          <Sidebar fallbackChats={fallbackChatItems} />
        </Suspense>
        {children}
      </div>
    </SidebarMobile>
  );
}
