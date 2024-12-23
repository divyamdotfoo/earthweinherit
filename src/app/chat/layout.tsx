import { Sidebar, SidebarProvider } from "@/components/sidebar";
import { Suspense } from "react";
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="md:flex w-full items-start">
        <Suspense>
          <Sidebar />
        </Suspense>
        {children}
      </div>
    </SidebarProvider>
  );
}
