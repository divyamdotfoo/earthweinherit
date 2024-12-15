import Link from "next/link";

export default function Page() {
  return (
    <div className=" flex flex-col items-center">
      <h1 className="text-8xl font-mono font-bold text-center py-20">
        Earth we Inherit
      </h1>
      <Link
        className=" bg-primary text-primary-foreground text-lg px-6 py-2 rounded-lg"
        href={"/chat"}
      >
        Go to chat
      </Link>
    </div>
  );
}
