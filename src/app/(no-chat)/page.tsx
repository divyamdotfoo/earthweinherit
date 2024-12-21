import { HeroQuestions } from "@/components/hero-questions";

export default function Page() {
  return (
    <div className=" py-6 mx-auto w-full">
      <p className="font-anton max-w-7xl mx-auto md:text-2xl italic tracking-wider md:leading-9 px-4 xl:px-0">
        Human influence has been the dominant cause of the observed warming
        since the mid-20th century. Yet, we often remain unaware, uncurious, and
        silent. <br /> It's time to break the cycle—
        <span className="">ask questions that matter</span>.
      </p>
      <HeroQuestions />
    </div>
  );
}
