import Link from "next/link";

export default function Page() {
  return (
    <div className=" flex flex-col items-center">
      <h1 className="text-8xl font-extrabold text-center py-20">IPCC</h1>
      <Link
        className=" bg-white text-black text-lg px-6 py-2 hover:bg-white/90 rounded-lg"
        href={"/chat"}
      >
        Go to chat
      </Link>
    </div>
  );
}
