"use client";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Copy,
  Infinity,
  PanelLeft,
  PenBox,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Chats } from "@/supabase/queries";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toDataURL as QR } from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Cookie from "js-cookie";
import { deleteChat } from "@/actions";

export function Sidebar({
  fallbackChats,
  isMobile,
}: {
  fallbackChats: Chats;
  isMobile: boolean;
}) {
  const [openSidebar, setSidebarOpen] = useState(!isMobile);
  const pathname = usePathname();
  const router = useRouter();
  const [openDeleteChat, setOpenDeleteChat] = useState(false);
  const [toDeleteChatId, setToDeleteChatId] = useState("");
  const {
    data: chats,
    isLoading,
    mutate,
  } = useSWR(
    "/api/history",
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Fetching history failed");
      }
      const data = await res.json();
      return data?.data as Chats;
    },
    {
      fallbackData: fallbackChats,
    }
  );

  useEffect(() => {
    mutate();
  }, [mutate, pathname]);

  return (
    <>
      {/* desktop */}
      <div
        className={cn(
          "flex  absolute transition-all z-30  flex-col justify-between gap-20 duration-300 ease-out border-r border-border h-screen md:sticky top-0 overflow-y-auto bg-chat-sidebar  shrink-0 overflow-hidden",
          openSidebar
            ? "w-[280px] p-4"
            : "md:w-[90px] w-0 overflow-hidden p-0 md:p-4"
        )}
      >
        <div>
          <div>
            <div className=" flex items-center w-full justify-between pb-4">
              <h1 className=" text-xl font-bold text-center">IPCC</h1>
              {openSidebar && (
                <button onClick={() => setSidebarOpen(false)}>
                  <ArrowLeftFromLine className=" text-inherit w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                router.push("/chat");
                router.refresh();
              }}
              className={cn(
                "flex items-center h-12 bg-background/20 hover:bg-background/30  rounded-md gap-3 p-2",
                openSidebar
                  ? " w-full rounded-md justify-start"
                  : " w-12 rounded-full justify-center"
              )}
            >
              <PlusIcon className=" text-inherit w-5 h-5" />
              {openSidebar && (
                <span className=" block animate-fadeIn">Start new chat</span>
              )}
            </button>
          </div>

          {openSidebar ? (
            isLoading && chats.length === 0 ? (
              <div className=" flex flex-col w-full py-6 gap-4">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className=" w-64 rounded-md bg-stone-700 h-8 animate-pulse"
                    ></div>
                  ))}
              </div>
            ) : (
              <div className=" flex flex-col items-center w-full gap-2 py-6">
                {chats.map((c) => (
                  <ChatItem
                    onClick={() => {
                      if (isMobile) {
                        console.log("mobile");
                        setSidebarOpen(false);
                      }
                    }}
                    chat={c}
                    pathname={pathname}
                    key={c.id}
                    onDelete={() => {
                      setOpenDeleteChat(true);
                      setToDeleteChatId(c.id);
                    }}
                  />
                ))}
              </div>
            )
          ) : null}
        </div>

        <div className=" flex flex-col items-center gap-3 w-full">
          {!openSidebar && (
            <button
              onClick={() => setSidebarOpen(true)}
              className=" p-4 rounded-full flex items-center justify-center bg-background/20"
            >
              <ArrowRightFromLine className=" text-inherit w-6 h-6 stroke-[2.4px]" />
            </button>
          )}

          <SyncChats sidebarOpen={openSidebar} mutate={mutate} chats={chats} />
        </div>
      </div>

      {/* mobile */}

      {!openSidebar && (
        <div className=" fixed z-50 animate-fadeIn bg-transparent top-0 inset-x-0 md:hidden flex w-full justify-between p-4">
          <button onClick={() => setSidebarOpen(true)}>
            <PanelLeft className=" w-5 h-5 text-white" />
          </button>
          <h1 className=" text-xl font-semibold">IPCC</h1>
          <button
            onClick={() => {
              router.push("/chat");
              router.refresh();
            }}
          >
            <PenBox className=" w-5 h-5 text-white" />
          </button>
        </div>
      )}

      <DeleteChatDialog
        open={openDeleteChat}
        onOpenChange={setOpenDeleteChat}
        id={toDeleteChatId}
        mutate={mutate}
      />
    </>
  );
}

export function ChatItem({
  chat,
  pathname,
  onDelete,
  onClick,
}: {
  chat: Chats[0];
  pathname: string;
  onDelete: () => void;
  onClick: () => void;
}) {
  const [isHover, setHover] = useState(false);
  const isActive = pathname.split("/").at(-1) === chat.id;
  return (
    <div
      className={cn(
        "text-sm relative rounded-md transition-all w-64 ",
        isActive ? " bg-chat-item hover:opacity-90" : " hover:bg-chat-item"
      )}
    >
      <Link
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
        className="text-ellipsis w-full p-2 block overflow-hidden whitespace-nowrap"
        href={`/chat/${chat.id}`}
      >
        {chat.title}
      </Link>
      {(isHover || isActive) && (
        <button
          onClick={onDelete}
          className=" absolute rounded-md right-0 top-1/2 -translate-y-1/2 bg-stone-700 text-white transition-all hover:text-red-500 p-2 flex items-center justify-center"
        >
          <Trash2Icon className=" w-4 h-4 text-inherit" />
        </button>
      )}
    </div>
  );
}

export function SyncChats({
  sidebarOpen,
  mutate,
  chats,
}: {
  sidebarOpen: boolean;
  mutate: () => void;
  chats: Chats;
}) {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [qr, setQr] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDialogOpen, setDialog] = useState(false);
  const [otherCode, setOtherCode] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!code) {
      const user = Cookie.get("user");
      setCode(user);
      const canvasEl = canvasRef.current;
      if (canvasEl && user) {
        QR(
          canvasEl,
          `${window.location.origin}/chat?sync=${user}`,
          { scale: 8 },
          (err, url) => setQr(url)
        );
      }
    }
  }, [chats]);

  useEffect(() => {
    const id = searchParams.get("sync");
    if (id) {
      Cookie.set("user", id, { expires: 365 });
      mutate();
    }
  }, [searchParams]);

  return (
    <div className=" w-full">
      <canvas
        className=" hidden"
        width={250}
        height={250}
        ref={canvasRef}
      ></canvas>

      <Dialog open={isDialogOpen} onOpenChange={setDialog}>
        <DialogTrigger asChild>
          <button
            className={cn(
              "flex items-center justify-center gap-2 h-12 bg-background/40 p-2 ",
              sidebarOpen
                ? " w-fit py-2 px-5 rounded-3xl"
                : "w-12 p-2 rounded-full"
            )}
          >
            <Infinity className=" w-6 h-6 text-inherit" />
            {sidebarOpen && (
              <span className="font-medium animate-fadeIn">Sync chats</span>
            )}
          </button>
        </DialogTrigger>
        <DialogContent className=" max-w-xs">
          <DialogTitle>Sync chats across devices</DialogTitle>
          {code && qr ? (
            <div className=" flex flex-col gap-3 w-full">
              <div className="p-2 rounded-md bg-secondary w-full flex items-center justify-between">
                <p className=" ">{code}</p>
                <button
                  onClick={() =>
                    window.navigator.clipboard.writeText(code ?? "")
                  }
                >
                  <Copy className=" w-4 h-4 text-inherit" />
                </button>
              </div>
              <img
                src={qr}
                alt="qr code to sync devices"
                className=" rounded-md"
              />
              <p className=" text-center text-sm">OR</p>
              <input
                type="text"
                value={otherCode}
                onChange={(e) => setOtherCode(e.target.value)}
                spellCheck={false}
                className=" bg-secondary w-full p-2 rounded-md placeholder:text-xs placeholder:font-medium"
                placeholder="Enter code to sync this device with other"
              />
              <button
                onClick={() => {
                  if (!otherCode.trim().length) return;
                  Cookie.set("user", otherCode, { expires: 365 });
                  setDialog(false);
                  router.push("/chat");
                  router.refresh();
                  mutate();
                }}
                className=" w-full bg-white p-2 rounded-md text-black font-semibold"
              >
                Sync
              </button>
            </div>
          ) : (
            <p className=" text-center text-lg min-h-36 w-full flex items-center justify-center">
              Ask questions to sync chats across devices.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function DeleteChatDialog({
  open,
  onOpenChange,
  id,
  mutate,
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  id: string;
  mutate: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Delete chat?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this chat?
        </DialogDescription>

        <div className=" pt-6 flex items-center justify-end gap-6">
          <button
            className=" rounded-md px-4 py-2 text-white bg-stone-800 hover:bg-stone-700 transition-all"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              onOpenChange(false);
              await deleteChat(id);
              mutate();
            }}
            className=" px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-all font-medium"
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
