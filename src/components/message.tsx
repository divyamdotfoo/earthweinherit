"use client";

import { Message } from "ai";
import { Markdown } from "./markdown";
import { ImageIcon, SparklesIcon } from "lucide-react";
import { cn, filterUniqueBasedOn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

type MessageAnnotationSource = {
  report: string;
  url: string;
  img: string | null;
}[];

export const PreviewMessage = ({
  message,
  allMessages,
}: {
  message: Message;
  allMessages: Message[];
}) => {
  if (message.role === "user")
    return (
      <div className=" to-muted bg-secondary from-secondary from-50% self-start font-mono rounded-2xl shadow-sm w-fit p-3 selection:bg-white selection:text-foreground">
        {message.content && (
          <div className="flex flex-col gap-4">
            <Markdown>{message.content as string}</Markdown>
          </div>
        )}
      </div>
    );

  if (message.role === "assistant") {
    const sources =
      message.annotations &&
      !!message.annotations.length &&
      // @ts-expect-error
      (message.annotations[0]?.sources as MessageAnnotationSource);
    return (
      <div className=" self-start w-full">
        {sources && sources.length > 0 && (
          <div className=" pb-6">
            <p className=" pb-2 font-mono text-primary font-bold">Sources</p>
            <div className=" flex items-stretch gap-3 flex-wrap">
              {filterUniqueBasedOn(
                sources.filter((s) => s.url),
                "url"
              )
                .slice(0, 3)
                .map((s, idx) => (
                  <Link
                    href={s.url ?? ""}
                    key={s.url}
                    target="_blank"
                    className={cn(
                      "bg-accent text-accent-foreground transition-all shrink-0 max-w-40 md:max-w-48 text-pretty font-mono p-2 rounded-lg border-[0.3px] border-border hover:shadow-sm relative",
                      idx > 1 ? "hidden sm:block" : ""
                    )}
                  >
                    <p className=" text-xs font-medium pb-8">{s.report}</p>
                    <div className=" flex items-center gap-2 absolute bottom-2">
                      <IpccLogoForSources />
                      <p className=" text-sm">IPCC</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {sources &&
          sources
            .filter((s) => s.img)
            .slice(0, 1)
            .map((s) => (
              <div
                key={s.img}
                className=" w-full sm:min-h-56 md:min-h-80 min-h-40 mb-10 overflow-hidden outline-none border-none bg-secondary relative rounded-md"
              >
                <ImageIcon className=" absolute -z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                <Image
                  src={s.img ?? ""}
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

export const ThinkingMessage = () => {
  return (
    <div className="flex items-center justify-center gap-2 self-start">
      <SparklesIcon className=" text-white rounded-full w-7 h-7 p-1 stroke-[1.3px] bg-primary" />
      <div className=" flex items-center">
        <p className="text-sm pr-1">Thinking</p>
        <p className=" font-bold animate-bounce">.</p>
        <p className=" font-bold animate-bounce delay-100">.</p>
        <p className=" font-bold animate-bounce delay-150">.</p>
      </div>
    </div>
  );
};

function IpccLogoForSources() {
  return (
    <Image
      alt="ipcc logo"
      width={40}
      height={40}
      className=" rounded-full w-5 h-5"
      src={
        "data:image/vnd.microsoft.icon;base64,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"
      }
    />
  );
}
