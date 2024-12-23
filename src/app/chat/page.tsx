import { Chat } from "@/components/chat";
import { Suspense } from "react";
export default async function Page() {
  const id = crypto.randomUUID();
  return (
    <Suspense>
      <Chat initialMessages={[]} />
    </Suspense>
  );
}
