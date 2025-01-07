import { Navbar } from "@/components/navbar";

export default function NotFound() {
  return (
    <div className=" w-full bg-background text-foreground font-primary py-6">
      <Navbar />
      <div className=" flex w-full min-h-96 items-center justify-center">
        <p className=" text-[156px] h-[140px] overflow-y-hidden flex items-center gap-1 font-extrabold">
          <span className="block animate-staggered translate-y-full delay-500">
            4
          </span>
          <span className="block animate-staggered delay-700 translate-y-full">
            0
          </span>
          <span className="block animate-staggered delay-1000 translate-y-full">
            4
          </span>
        </p>
      </div>
    </div>
  );
}
