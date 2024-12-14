"use client";
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { useChat } from "ai/react";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import { useSWRConfig } from "swr";
import { PreviewMessage, ThinkingMessage } from "./message";
import { ArrowUp, StopCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const { mutate } = useSWRConfig();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
  } = useChat({
    body: { id: id },
    initialMessages,
    onFinish: () => {
      mutate("/api/history");
    },
  });

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/chat") setMessages([]);
  }, [pathname]);

  // const [messagesContainerRef, messagesEndRef] =
  //   useScrollToBottom<HTMLDivElement>();
  const questions = useMemo(
    () => [
      "How do we estimate global emissions from cities?",
      "How is climate change related to agriculture?",
      "What can every person do to limit warming to 1.5°C?",
      "Is climate change caused by human activity?",
    ],
    [id]
  );
  return (
    <div className=" relative w-full bg-neutral-900/70">
      <div className="w-full h-dvh overflow-y-scroll sm:px-10 px-6">
        <div
          // ref={messagesContainerRef}
          className={cn(
            "flex flex-col min-w-0 max-w-[700px] mx-auto gap-6 animate-jumpIn",
            messages.length === 0 ? "" : "md:pt-10 pt-24 pb-40 flex-1"
          )}
        >
          {messages.map((message, index) => (
            <PreviewMessage
              key={message.id}
              message={message}
              allMessages={messages}
            />
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && (
              <ThinkingMessage />
            )}

          {/* <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[48px]"
          /> */}
        </div>
        <ChatInput
          questions={questions}
          chatId={id}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />
      </div>
    </div>
  );
}

//

function ChatInput({
  append,
  chatId,
  input,
  isLoading,
  messages,
  setInput,
  setMessages,
  stop,
  className,
  questions,
}: {
  questions: string[];
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
  };

  const sendUserMessage = (message?: string) => {
    append({
      content: message ?? input,
      role: "user",
    });
    setInput("");
    if (window && window.innerWidth > 768) {
      textareaRef.current?.focus();
    }
    window && window.history.replaceState({}, "", `/chat/${chatId}`);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-10 w-full   transition-all left-1/2 -translate-x-1/2 px-0 sm:px-10 max-w-4xl mx-auto absolute",
        messages.length === 0
          ? "bottom-1/2 translate-y-1/2 lg:translate-y-0 px-6"
          : "bottom-0 "
      )}
    >
      {messages.length === 0 && (
        <h2 className="text-3xl font-medium">What can I help with?</h2>
      )}

      <div
        className={cn(
          "bg-secondary items-center flex flex-col transition-all pb-2 shadow-sm px-4  w-full max-h-52",
          messages.length === 0
            ? "rounded-xl"
            : " rounded-t-xl shadow-sm border-gray-700 border border-b-0"
        )}
      >
        <textarea
          ref={textareaRef}
          autoFocus
          placeholder="Ask anything about climate change"
          name="input-begin"
          className=" bg-transparent placeholder:text-sm md:placeholder:text-base block border-none  transition-all outline-none pt-4 m-0 focus:outline-none w-full resize-none min-h-[40px]"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendUserMessage();
            }
          }}
          rows={1}
        />
        {isLoading ? (
          <button
            className="p-2 rounded-full w-fit self-end bg-black/20 hover:bg-black/30 transition-all "
            onClick={stop}
          >
            <StopCircleIcon className=" w-5 h-5 text-inherit hover:stroke-[2.5px] " />
          </button>
        ) : (
          <button
            onClick={() => sendUserMessage()}
            disabled={!input.length}
            className="p-2 rounded-full w-fit self-end bg-black/20 disabled:opacity-50"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.3px] text-inherit" />
          </button>
        )}
      </div>
      {messages.length === 0 && (
        <div className=" w-full grid md:grid-cols-2 grid-cols-1 gap-4">
          {questions.map((q) => (
            <button
              key={q}
              onClick={() => sendUserMessage(q)}
              className=" bg-secondary text-secondary-foreground text-start md:p-4 py-4 px-2 md:text-sm text-xs  text-wrap hover:bg-secondary/90 rounded-md transition-all hover:shadow-md "
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
