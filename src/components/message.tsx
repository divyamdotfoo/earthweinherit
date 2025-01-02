import { Message } from "ai";
import { Markdown } from "./markdown";
import { ImageIcon, SparklesIcon } from "lucide-react";
import { cn, filterUniqueBasedOn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

type Annotations = {
  report: string;
  url: string;
  similarity: number;
  source: string;
  sourceImg: string;
  img: string | null;
}[];

export const PreviewMessage = ({ message }: { message: Message }) => {
  if (message.role === "user")
    return (
      <div className=" to-muted bg-gradient-to-b from-secondary from-50% self-start font-mono rounded-2xl shadow-sm w-fit p-3 selection:bg-white selection:text-foreground">
        {message.content && (
          <div className="flex flex-col gap-4">
            <p>{message.content as string}</p>
          </div>
        )}
      </div>
    );

  if (message.role === "assistant") {
    const annotations =
      message.annotations && message.annotations.length
        ? (message.annotations[0] as Annotations)
        : null;

    console.log(annotations);
    return (
      <div className=" self-start w-full">
        <Sources annotations={annotations} />
        {annotations &&
          annotations.length &&
          annotations
            .filter((anno) => anno.img)
            .slice(0, 1)
            .map((anno) => (
              <div
                key={anno.img}
                className=" w-full sm:min-h-56 md:min-h-80 min-h-40 mb-10 overflow-hidden outline-none border-none bg-secondary relative rounded-md"
              >
                <ImageIcon className=" absolute -z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                <Image
                  src={anno.img ?? ""}
                  width={800}
                  height={1000}
                  alt="image from ipcc reports"
                  className=" w-full h-auto rounded-md z-50"
                />
              </div>
            ))}

        <div className="flex flex-col gap-2 w-full">
          {message.content && (
            <div className="flex flex-col gap-4 px-2 sm:px-0 selection:bg-primary selection:text-primary-foreground">
              <Markdown>{message.content as string}</Markdown>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export function Sources({
  annotations,
}: {
  annotations: Annotations | null | undefined;
}) {
  if (!annotations) return null;

  return (
    <div className=" pb-6">
      <p className=" pb-2 font-mono text-primary font-bold">Sources</p>
      <div className="flex items-stretch gap-3 flex-wrap">
        {filterUniqueBasedOn(
          annotations.filter((a) => !a.img && a.url),
          "url"
        )
          .sort((a, b) => a.similarity - b.similarity)
          .slice(0, 4)
          .map((source, idx) => (
            <Link
              href={source.url ?? ""}
              key={source.url}
              target="_blank"
              className={cn(
                "bg-accent text-accent-foreground transition-all shrink-0 max-w-40 md:max-w-48 text-pretty font-mono p-2 rounded-lg border-[0.3px] border-border hover:shadow-sm relative",
                idx > 1 ? "hidden sm:block" : "",
                idx > 2 ? "hidden lg:block" : ""
              )}
            >
              <p className=" text-xs font-medium pb-8">{source.report}</p>
              <div className=" flex items-center gap-2 absolute bottom-2">
                <img src={source.sourceImg} className=" w-5 h-5 rounded-full" />
                <p className=" text-sm">{source.source}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export const ThinkingMessage = () => {
  return (
    <div className="flex items-center justify-center gap-2 self-start ">
      <SparklesIcon className=" text-white rounded-full w-7 h-7 p-1 stroke-[1.3px] bg-primary" />
      <div className="h-9 overflow-hidden pt-1">
        <div
          className=" flex items-center animate-textUpOut"
          style={{
            animationDelay: "2000ms",
          }}
        >
          <p className="text-sm pr-1">Analyzing input </p>
          <p className=" font-bold animate-bounce">.</p>
          <p className=" font-bold animate-bounce delay-100">.</p>
          <p className=" font-bold animate-bounce delay-150">.</p>
        </div>

        <div
          className=" flex items-center animate-textUpIn opacity-0"
          style={{
            animationDelay: "2100ms",
          }}
        >
          <p className="text-sm pr-1">Generating insights </p>
          <p className=" font-bold animate-bounce">.</p>
          <p className=" font-bold animate-bounce delay-100">.</p>
          <p className=" font-bold animate-bounce delay-150">.</p>
        </div>
      </div>
    </div>
  );
};
