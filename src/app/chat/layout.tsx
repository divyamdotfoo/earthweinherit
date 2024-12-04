import { Sidebar } from "@/components/sidebar";
import { Suspense } from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:flex w-full items-start">
      <Suspense>
        <Sidebar />
      </Suspense>
      {children}
    </div>
  );
}
