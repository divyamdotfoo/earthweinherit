import { Navbar } from "@/components/navbar";

export default function NotFound() {
  return (
    <div className=" w-full bg-background text-foreground font-mono py-6">
      <Navbar />
      <div className=" flex w-full min-h-96 items-center justify-center">
        <p className=" text-[156px] flex items-center gap-1 font-extrabold">
          <span className="block animate-staggered delay-150 opacity-0">4</span>
          <span className="block animate-staggered delay-200 opacity-0">0</span>
          <span className="block animate-staggered delay-300 opacity-0">4</span>
        </p>
      </div>
    </div>
  );
}
