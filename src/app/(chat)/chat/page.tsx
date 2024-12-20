import { Chat } from "@/components/chat";
export default async function Page() {
  const id = crypto.randomUUID();
  return <Chat id={id} initialMessages={[]} />;
}
