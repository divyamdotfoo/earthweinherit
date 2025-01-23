import { Chat } from "@/components/chat";
import { Suspense } from "react";
export default async function Page() {
  return (
    <Suspense>
      <Chat initialMessages={[]} />
    </Suspense>
  );
}
