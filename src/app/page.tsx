import { CarbonTempSeaIce } from "@/components/charts/carbon-temp-sea-ice";
import { HeroQuestions } from "@/components/hero-questions";
import { HoverLink, Navbar } from "@/components/navbar";
import { FadeInWrapper } from "@/components/ui/fade-in-wrapper";
import { Underline } from "@/components/ui/underline";
import { getCarbonTempSeaIce } from "@/supabase/queries";
import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
export default async function Page() {
  const data = await getCarbonTempSeaIce();
  return (
    <div className="relative min-h-screen w-full">
      {/* section one */}
      <div className="sticky top-0 z-0 w-full h-fit py-6 selection:bg-white selection:text-black">
        <Navbar />
        <p
          className="font-primary animate-fadeIn font-medium max-w-screen-xxl mx-auto md:text-2xl tracking-wider md:leading-9 px-6 opacity-0"
          style={{
            animationDelay: "1000ms",
          }}
        >
          Human influence has been the dominant cause of the observed warming
          since the mid-20th century. Yet, we often remain unaware, uncurious,
          and silent. <br /> It's time to break the cycle—
          <span className="">ask questions that matter</span>.
        </p>
        <HeroQuestions />
      </div>
      {/* section two */}
      <div
        className="sticky top-16 z-10 bg-white text-accent-foreground rounded-t-3xl w-full animate-sectionUp translate-y-10 opacity-0 selection:bg-background"
        style={{
          animationDelay: "800ms",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <div className=" flex flex-col lg:flex-row max-w-screen-xxl mx-auto py-6 px-6 justify-between">
          <div className="lg:basis-2/5 shrink-0">
            <div className=" w-full flex gap-x-2 xl:gap-x-3 flex-wrap select-none pb-4">
              {"Our Planet is Warming, Our Ice is Vanishing, Our Seas are Rising."
                .split(" ")
                .map((w, idx) => (
                  <div
                    className=" h-6 sm:h-8 md:h-10 xl:h-12 overflow-y-hidden"
                    key={`${w}-${idx}`}
                  >
                    <p
                      className=" font-bold font-primary text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl animate-staggered translate-y-[60px]"
                      style={{
                        animationDelay: `${Math.floor(idx / 3) * 100 + 900}ms`,
                      }}
                    >
                      {w}
                    </p>
                  </div>
                ))}
            </div>
            <div className="max-w-[480px] text-lg font-medium leading-relaxed pb-8">
              <FadeInWrapper delay={0.1}>
                The average global temperature has increased
              </FadeInWrapper>
              <FadeInWrapper delay={0.15}>
                by over <span className="text-red-500">0.08C</span> since the
                pre-industrial era
              </FadeInWrapper>
              <FadeInWrapper delay={0.2}>
                and is increasing faster since{" "}
                <span className="text-red-500">1970</span> than in
              </FadeInWrapper>
              <FadeInWrapper delay={0.25}>
                any other 50-year period over at least the
              </FadeInWrapper>
              <FadeInWrapper delay={0.3}>
                last 2,000 years.{" "}
                <Underline color="black" delay={2000}>
                  As the climate heats up,
                </Underline>
              </FadeInWrapper>
              <FadeInWrapper delay={0.35}>
                <Underline color="black" delay={2000}>
                  rainfall patterns change, evaporation
                </Underline>
              </FadeInWrapper>
              <FadeInWrapper delay={0.4}>
                <Underline color="black" delay={2000}>
                  increases, glaciers melt, and sea levels
                </Underline>
              </FadeInWrapper>
              <FadeInWrapper delay={0.45}>
                <Underline color="black" delay={2000}>
                  rise.
                </Underline>
                {"  "}
                Under current warming trends,
              </FadeInWrapper>
              <FadeInWrapper delay={0.5}>
                <span className="text-red-500">two-thirds</span> of Earth's
                glaciers may vanish by
              </FadeInWrapper>
              <FadeInWrapper delay={0.55}>
                2100. Even if the world follows a low
              </FadeInWrapper>
              <FadeInWrapper delay={0.6}>
                greenhouse gas pathway, the level of sea rises globally will
                continue to rise up to about{" "}
                <span className="text-red-500">0.7 meters</span> by 2100.
              </FadeInWrapper>
            </div>

            <HoverLink
              href={"/"}
              color="var(--primary)"
              className=" text-primary w-fit font-medium flex items-center gap-2"
            >
              <p>See detailed overview</p>
              <ArrowUpRightFromSquare className=" w-3 h-3" />
            </HoverLink>
          </div>
          <div className=" basis-3/5">
            <CarbonTempSeaIce data={data} />
          </div>
        </div>
      </div>
      <div className="min-h-screen sticky top-16 z-10 bg-muted text-accent-foreground rounded-t-3xl w-full"></div>
    </div>
  );
}

function Socials() {
  return (
    <div className=" flex items-center gap-3">
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
  );
}
