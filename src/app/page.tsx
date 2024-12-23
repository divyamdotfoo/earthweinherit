import { HeroQuestions } from "@/components/hero-questions";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
export default async function Page() {
  // const data = await getCarbonTempSeaIce();
  return (
    <div className="relative min-h-screen w-full">
      {/* container one */}
      <div className="sticky top-0 z-0 w-full h-fit">
        <div className="py-6 mx-auto">
          <Navbar />
          <p className="font-anton max-w-7xl mx-auto md:text-2xl italic tracking-wider md:leading-9 px-4 xl:px-0">
            Human influence has been the dominant cause of the observed warming
            since the mid-20th century. Yet, we often remain unaware, uncurious,
            and silent. <br /> It's time to break the cycle—
            <span className="">ask questions that matter</span>.
          </p>
          <HeroQuestions />
        </div>
        <div className=" flex items-center justify-end px-4">
          <Link
            href={"https://github.com/divyamdotfoo/earthweinherit"}
            target="_blank"
          >
            {" "}
            <svg
              width={24}
              height={24}
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Link>
        </div>
      </div>
      {/* container two */}
      {/* <div className="min-h-screen sticky top-16 z-10 bg-white text-accent-foreground rounded-t-[28px] w-full">
        <div className=" flex max-w-7xl mx-auto py-6 px-4 xl:px-0 border">
          <div className=" basis-1/3"></div>
          <div className=" basis-2/3">
            <CarbonTempSeaIce data={data} />
          </div>
        </div>
      </div>
      <div className="min-h-screen sticky top-16 z-10 bg-muted text-accent-foreground rounded-t-[28px] w-full"></div> */}
    </div>
  );
}
