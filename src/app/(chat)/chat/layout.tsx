import { Sidebar, SidebarItems, SidebarProvider } from "@/components/sidebar";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getChatsByUser } from "@/supabase/queries";
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const user = cookieStore.get("user");

  return (
    <SidebarProvider>
      <div className="md:flex w-full items-start">
        <Sidebar>
          <Suspense fallback={<SidebarItemsSkeleton />}>
            <SidebarLoader user={user?.value} />
          </Suspense>
        </Sidebar>

        {children}
      </div>
    </SidebarProvider>
  );
}

async function SidebarLoader({ user }: { user: string | undefined }) {
  const fallbackChatItems = user ? await getChatsByUser(user) : [];
  return <SidebarItems fallbackChats={fallbackChatItems} />;
}

function SidebarItemsSkeleton() {
  return (
    <div className=" flex flex-col w-full gap-4">
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className=" w-64 rounded-md bg-muted h-8 animate-pulse"
          ></div>
        ))}
    </div>
  );
}
