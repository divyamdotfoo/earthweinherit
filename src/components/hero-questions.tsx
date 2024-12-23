import { cn } from "@/lib/utils";
import Link from "next/link";

export function HeroQuestions() {
  const questions = [
    "What Is the Evidence for Climate Change?",
    "Why are polar regions warming faster?",
    "How do we know humans are causing climate change?",
    "Where Is Climate Change Most Apparent?",
    "Why is methane a potent greenhouse gas?",
    "A low-carbon industry transition?",
    "What are the impacts of melting permafrost?",
    "Can removing CO2 reverse climate change?",
    "What are tipping points in climate systems?",
    "How can irrigation systems be improved?",
    "Important steps to decarbonise the energy system?",
    "How do forests regulate global temperatures?",
    "How much will sea levels rise?",
    "What Is the Role of Clouds in a Warming Climate?",
    "Can melting of the ice sheets be reversed?",
    "Can humans adapt to warming?",
    "How Will the Climate Change Over the Next Twenty Years?",
    "What Are Carbon Budgets?",
    "How can transportation be decarbonized?",
    "How can agriculture lower methane emissions?",
    "How does climate change increase the risk of diseases?",
    "How does climate risk vary with temperature?",
    "What are climatic thresholds?",
    "Why Are Cities Hotspots of Global Warming?",
    "Can oceans store carbon?",
    "Is climate change increasing wildfire?",
    "How does urbanization worsen climate risks?",
    "Key climate risks for cities and vulnerable populations?",
    "Key options to reduce industrial emissions?",
    "Are Climate Models Improving?",
    "Key climate risks across Asia's sub-regions?",
    "Why are coastal cities at risk from climate change?",
    "Is international cooperation working?",
    "Is the Mediterranean Basin a climate change hotspot?",
    "What is a climate resilient development pathway?",
    "Are emissions still increasing or are they falling?",
    "Will the Gulf Stream Shut Down?",
    "What can every person do to limit warming to 1.5°C?",
    "Climate change and droughts?",
    "What is the role of wetlands in carbon storage?",
    "To which GHG emissions do buildings contribute?",
    "Strategies to combat climate change?",
    "What is a carbon footprint?",
  ];
  return (
    <div className=" overflow-x-hidden w-full py-8 px-0 md:px-4 relative">
      <div className=" hidden md:block absolute left-0 inset-y-0 w-8 blur-lg bg-gradient-to-r from-accent to-secondary z-20"></div>
      <div className=" hidden md:block absolute right-0 inset-y-0 w-8 blur-lg bg-gradient-to-r from-accent to-secondary z-20"></div>

      {Array(7)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 md:gap-6 flex-nowrap py-3 md:py-4 animate-scroll"
          >
            {questions.slice(i * 6, i * 6 + 15).map((q, idx) => (
              <Link
                href={`/chat?q=${q}`}
                key={q.toLowerCase().replaceAll(" ", "_")}
                className={cn(
                  "px-3 py-2 rounded-lg border-[0.6px] border-transparent hover:border-primary bg-gradient-to-b animate-fadeIn from-25% from-secondary to-muted shadow-sm  shrink-0 text-nowrap transition-all hover:shadow-lg opacity-0 text-sm md:text-base",
                  `${
                    idx > 5
                      ? "md:hidden"
                      : q.split(" ").length > 6
                      ? "hidden md:block"
                      : ""
                  } `
                )}
                style={{
                  animationDelay: "1000ms",
                }}
              >
                {q}
              </Link>
            ))}
          </div>
        ))}
    </div>
  );
}
