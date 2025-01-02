"use client";
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { useChat } from "ai/react";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSWRConfig } from "swr";
import { PreviewMessage, ThinkingMessage } from "./message";
import {
  ArrowUp,
  ChevronDown,
  LucideShare,
  PanelRightClose,
  PenBoxIcon,
  StopCircleIcon,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ToolTip } from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { deleteChat, getChatById } from "@/actions";
import { useSidebar } from "./sidebar";
import Link from "next/link";

export function Chat({
  id,
  initialMessages,
  title,
}: {
  id?: string;
  initialMessages: Array<Message>;
  title?: string;
}) {
  const { mutate } = useSWRConfig();
  const [chatId, setChatId] = useState(id ?? crypto.randomUUID());
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
    body: { id: chatId },
    initialMessages,
    onFinish: () => {
      mutate("/api/history");
    },
  });

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/chat") setMessages([]);
  }, [pathname]);

  const router = useRouter();
  // const [messagesContainerRef, messagesEndRef] =
  //   useScrollToBottom<HTMLDivElement>();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);
  const questions = useMemo(
    () => [
      "How do we estimate global emissions from cities?",
      "How is climate change related to agriculture?",
      "What can every person do to limit warming to 1.5°C?",
      "Is climate change caused by human activity?",
    ],
    [id]
  );

  const { setSheetOpen } = useSidebar();
  return (
    <div className=" relative w-full">
      <div className="w-full h-dvh overflow-y-scroll sm:px-10 px-5">
        <div className=" flex sticky top-0 z-50 bg-background md:bg-transparent items-center justify-between pt-3 pb-3 md:pb-0 border-b border-border md:border-none ">
          <button
            onClick={() => setSheetOpen(true)}
            className=" bg-accent text-accent-foreground p-1 rounded-md md:hidden"
          >
            <PanelRightClose className=" w-5 h-5" />
          </button>
          <ChatTitle id={id} title={title} />
          <ToolTip content="New chat">
            <button
              onClick={() => {
                router.push("/chat");
                router.refresh();
              }}
              className=" bg-primary md:hidden text-primary-foreground rounded-md p-1 flex items-center justify-center"
            >
              <PenBoxIcon className=" w-4 h-4 text-inherit stroke-[1.5px]" />
            </button>
          </ToolTip>
        </div>
        <div
          // ref={messagesContainerRef}
          className={cn(
            "flex flex-col min-w-0 max-w-[700px] mx-auto gap-6 animate-jumpIn",
            messages.length === 0 ? "" : "pt-8 pb-40 flex-1"
          )}
        >
          {messages.map((message, index) => (
            <PreviewMessage key={message.id} message={message} />
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && (
              <ThinkingMessage />
            )}

          <div ref={messagesEndRef} className="shrink-0 min-w-[24px] h-24" />
        </div>
        <ChatInput
          questions={questions}
          chatId={chatId}
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
  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (window && window.innerHeight > 768) {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
    const question = searchParams.get("q");
    if (question && question.length) {
      sendUserMessage(question);
    }
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-10 w-full transition-all left-1/2 -translate-x-1/2  max-w-[840px] mx-auto fixed md:absolute",
        messages.length === 0
          ? "bottom-1/2 translate-y-[55%] lg:translate-y-1/3 px-5 sm:px-10 "
          : "bottom-0 px-0 sm:px-10"
      )}
    >
      {messages.length === 0 && (
        <h2 className=" text-xl sm:text-2xl lg:text-3xl font-medium font-mono">
          Ask questions that Matter!
        </h2>
      )}

      <div
        className={cn(
          " bg-accent border border-border items-center flex flex-col transition-all pb-2 px-4  w-full max-h-52",
          messages.length === 0
            ? "rounded-xl"
            : " rounded-t-xl shadow-sm border-b-0"
        )}
      >
        <textarea
          ref={textareaRef}
          placeholder="Ask anything about climate change"
          name="input-begin"
          className=" bg-transparent font-mono placeholder:text-sm md:placeholder:text-base placeholder:font-mono block border-none  transition-all outline-none pt-4 m-0 focus:outline-none w-full resize-none min-h-[40px] placeholder:tracking-tighter"
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
          <ToolTip content="Send">
            <button
              onClick={() => sendUserMessage()}
              disabled={!input.length}
              className="p-2 rounded-full bg-primary text-primary-foreground w-fit self-end disabled:opacity-50"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.3px] text-inherit" />
            </button>
          </ToolTip>
        )}
      </div>
      {messages.length === 0 && (
        <div className=" w-full grid md:grid-cols-2 grid-cols-1 gap-4 text-sm sm:text-base font-mono text-secondary-foreground font-medium">
          {questions.map((q) => (
            <button
              key={q}
              onClick={() => sendUserMessage(q)}
              className=" border border-border hover:bg-accent md:p-4 py-4 px-2 text-wrap text-start rounded-md transition-all "
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatTitle({ id, title }: { title?: string; id?: string }) {
  const [chatTitle, setTitle] = useState(title ?? null);
  const [chatId, setId] = useState(id ?? null);
  const [deleteChatModal, setDeleteChatModal] = useState(false);
  const router = useRouter();

  const pathname = usePathname();

  async function getChat(id: string) {
    try {
      const { data, error } = await getChatById(id);
      if (data && data.length) {
        setTitle(data[0].title);
        setId(data[0].id);
      }
    } catch (err) {}
  }

  useEffect(() => {
    const id = pathname.split("/").at(-1);
    if (id)
      setTimeout(() => {
        getChat(id);
      }, 7000);
    else setTitle(null);
  }, [pathname]);

  const { mutate } = useSWRConfig();

  const handleShare = async () => {
    if (navigator) {
      try {
        await navigator.share({
          title: chatTitle ?? "",
          url: window.location.href,
        });
      } catch (e) {}
    }
  };

  if (chatId && chatTitle) {
    return (
      <Popover>
        <PopoverTrigger className="flex items-center gap-2 md:bg-muted px-2 py-1 md:py-2 tracking-tighter font-medium rounded-md text-sm">
          <p className=" text-ellipsis text-nowrap whitespace-nowrap overflow-hidden w-48 sm:w-fit">
            {chatTitle}
          </p>
          <ChevronDown className=" w-4 h-4" />
        </PopoverTrigger>

        <PopoverContent className=" flex flex-col max-w-28 bg-accent text-accent-foreground items-start p-0 font-medium text-sm mt-2 md:mt-0">
          <button
            className=" cursor-pointer w-full hover:bg-background p-2 transition-all text-start flex items-center gap-2"
            onClick={handleShare}
          >
            <span>
              <LucideShare className=" w-3 h-3" />
            </span>
            Share
          </button>
          <div className=" w-full bg-border h-[1px] opacity-60"></div>
          <Dialog open={deleteChatModal} onOpenChange={setDeleteChatModal}>
            <DialogTrigger asChild>
              <button className=" w-full flex items-center gap-2 cursor-pointer hover:bg-background p-2 transition-all text-start">
                <Trash2 className=" w-3 h-3" />
                Delete
              </button>
            </DialogTrigger>
            <DialogContent className="">
              <DialogTitle>Delete chat?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this chat?
              </DialogDescription>

              <div className=" pt-6 flex items-center justify-end gap-6">
                <button
                  className=" rounded-md px-4 py-2 text-white bg-stone-800 hover:bg-stone-700 transition-all"
                  onClick={() => setDeleteChatModal(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (chatId) {
                      setDeleteChatModal(false);
                      router.push("/chat");
                      router.refresh();
                      await deleteChat(chatId);
                      mutate("/api/history");
                    }
                  }}
                  className=" px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-all font-medium"
                >
                  Delete
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <h1 className=" md:hidden text-lg tracking-tighter font-bold">
      <Link href={"/"}>Earth we Inherit</Link>
    </h1>
  );
}
