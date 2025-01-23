import { cn } from "@/lib/utils";
import Link from "next/link";

export function HeroQuestions() {
  const questions = [
    "What evidence proves climate change exists?",
    "Why are polar regions warming faster?",
    "How do humans cause climate change?",
    "Where is climate change most visible?",
    "Why is methane a strong greenhouse gas?",
    "What is a low-carbon industry transition?",
    "Impacts of melting permafrost?",
    "Can removing CO2 reverse climate change?",
    "What are tipping points in climate systems?",
    "How to improve irrigation systems?",
    "Steps to decarbonize the energy system?",
    "How do forests regulate temperatures globally?",
    "How much will sea levels rise?",
    "What is the role of clouds?",
    "Can melting ice sheets be reversed?",
    "Can humans adapt to global warming?",
    "How will climate change in 20 years?",
    "What are carbon budgets?",
    "How to decarbonize transportation systems?",
    "How can agriculture cut methane emissions?",
    "Does climate change increase disease risk?",
    "How does climate risk vary by temperature?",
    "What are climate thresholds?",
    "Why are cities global warming hotspots?",
    "Can oceans store excess carbon effectively?",
    "Is climate change increasing wildfires?",
    "How does urbanization worsen climate risks?",
    "Key risks for cities and vulnerable groups?",
    "Options to reduce industrial carbon emissions?",
    "Are climate models becoming more accurate?",
    "Key risks across Asia's sub-regions?",
    "Why are coastal cities climate change risks?",
    "Is international climate cooperation effective?",
    "Is the Mediterranean a climate change hotspot?",
    "What is climate-resilient development?",
    "Are emissions still rising or falling?",
    "Will the Gulf Stream shut down soon?",
    "What can people do to limit warming?",
    "How does climate change worsen droughts?",
    "How do wetlands store carbon effectively?",
    "What emissions come from building operations?",
    "Strategies to fight climate change effectively?",
    "What is the role of renewable energy?",
    "How does overfishing affect climate systems?",
    "Can reforestation help mitigate climate change?",
    "How do coral reefs respond to warming?",
    "What role does education play in action?",
    "What is sustainable urban planning?",
    "Can artificial intelligence aid climate action?",
    "What's the link between climate and migration?",
    "How does air pollution impact global warming?",
    "What policies promote sustainable living?",
  ];

  return (
    <div className=" overflow-x-hidden w-full pt-6 px-0 md:px-4 relative">
      <div className=" hidden md:block absolute left-0 inset-y-0 w-8 blur-lg bg-gradient-to-r from-accent to-secondary z-20"></div>
      <div className=" hidden md:block absolute right-0 inset-y-0 w-8 blur-lg bg-gradient-to-r from-accent to-secondary z-20"></div>

      {Array(6)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 md:gap-6 flex-nowrap py-3 md:py-4 animate-scroll"
          >
            {questions.slice(i * 8, i * 8 + 9).map((q, idx) => (
              <Link
                href={`/chat?q=${q}`}
                key={q.toLowerCase().replaceAll(" ", "_")}
                className={cn(
                  "px-3 py-2 rounded-lg border-[0.6px] border-transparent hover:border-primary bg-gradient-to-b animate-fadeIn from-25% from-secondary to-muted shadow-sm  shrink-0 text-nowrap transition-all hover:shadow-lg opacity-0 text-sm md:text-base"
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
