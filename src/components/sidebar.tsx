"use client";
import {
  Copy,
  CopyCheck,
  Infinity,
  PanelLeftClose,
  PanelRightClose,
  PenBoxIcon,
} from "lucide-react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { Chats } from "@/supabase/queries";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toDataURL as QR } from "qrcode";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Cookie from "js-cookie";
import { ToolTip } from "./ui/tooltip";
import useSWR from "swr";
import Link from "next/link";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import { HoverLink } from "./navbar";

export function Sidebar() {
  const { setSidebar, sidebarOpen, isSheetOpen, setSheetOpen } = useSidebar();
  const router = useRouter();

  return (
    <>
      <div
        className={cn(
          "md:flex flex-col gap-6 hidden absolute transition-all z-30 duration-300 ease-out border-r border-border  h-screen md:sticky top-0 overflow-y-auto bg-secondary shrink-0 overflow-hidden",
          sidebarOpen
            ? "w-[280px] p-4"
            : "md:w-[90px] w-0 overflow-hidden p-0 md:p-4"
        )}
      >
        <div
          className={cn(
            " flex items-center justify-between w-full",
            sidebarOpen ? " flex-row" : " flex-col gap-4"
          )}
        >
          {sidebarOpen ? (
            <ToolTip content="Hide menu">
              <button
                onClick={() => setSidebar(false)}
                className=" bg-accent text-accent-foreground p-1 flex items-center justify-center rounded-md"
              >
                <PanelLeftClose className=" w-5 h-5 text-inherit" />
              </button>
            </ToolTip>
          ) : (
            <ToolTip content="Show menu">
              <button
                onClick={() => setSidebar(true)}
                className=" bg-accent text-accent-foreground p-1 flex items-center justify-center rounded-md"
              >
                <PanelRightClose className=" w-6 h-6 text-inherit" />
              </button>
            </ToolTip>
          )}

          {sidebarOpen && (
            <HoverLink href={"/"}>
              <h1 className="font-bold tracking-tighter whitespace-nowrap">
                Earth we Inherit
              </h1>
            </HoverLink>
          )}
          <ToolTip content="New chat">
            <button
              onClick={() => {
                router.push("/chat");
                router.refresh();
              }}
              className=" bg-primary text-primary-foreground rounded-md p-1 flex items-center justify-center"
            >
              <PenBoxIcon className=" w-4 h-4 text-inherit stroke-[1.5px]" />
            </button>
          </ToolTip>
        </div>

        <SidebarItems />
      </div>

      {/* mobile */}

      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side={"left"}
          className=" bg-background p-3 h-screen overflow-y-hidden"
        >
          <SheetTitle
            suppressHydrationWarning
            asChild
            className="font-bold tracking-tighter whitespace-nowrap underline pb-5 block"
          >
            <Link href={"/"}>Earth we Inherit</Link>
          </SheetTitle>
          <SheetDescription
            suppressHydrationWarning
            asChild
            className=" sr-only"
          >
            Solving climate crisis with AI.
          </SheetDescription>

          <SidebarItems />
        </SheetContent>
      </Sheet>
    </>
  );
}

export function SidebarItems() {
  const pathname = usePathname();
  const { sidebarOpen, setSheetOpen } = useSidebar();
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
      fallbackData: [],
    }
  );

  useEffect(() => {
    mutate();
  }, [mutate, pathname]);

  return (
    <div className=" lg:h-[90%] h-[85%] flex flex-col items-start justify-between gap-5">
      <div className=" h-full overflow-y-auto">
        {sidebarOpen ? (
          chats.length === 0 && isLoading ? (
            <div className=" flex flex-col w-full gap-4">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className=" w-64 rounded-md bg-muted h-8 animate-pulse"
                  ></div>
                ))}
            </div>
          ) : chats.length === 0 ? (
            <p className=" absolute top-1/2 w-full left-10 font-medium text-lg ">
              No chats yet.
            </p>
          ) : (
            <div className=" flex flex-col items-center w-full gap-2 pb-10">
              {chats.map((c) => (
                <Link
                  onClick={() => {
                    setSheetOpen(false);
                  }}
                  key={c.id}
                  className={cn(
                    "text-sm font-primary relative rounded-md transition-all w-64 text-ellipsis text-secondary-foreground font-medium px-2 py-1 block overflow-hidden whitespace-nowrap",
                    pathname.split("/").at(-1) === c.id
                      ? " bg-accent text-accent-foreground hover:opacity-90"
                      : " hover:bg-accent hover:text-accent-foreground"
                  )}
                  href={`/chat/${c.id}`}
                >
                  {c.title}
                </Link>
              ))}
            </div>
          )
        ) : null}
      </div>
      <SyncChats chats={chats} mutate={mutate} sidebarOpen={sidebarOpen} />
    </div>
  );
}

function SyncChats({
  sidebarOpen,
  mutate,
  chats,
}: {
  sidebarOpen: boolean;
  mutate: () => void;
  chats: Chats;
}) {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [isCopied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [otherCode, setOtherCode] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSheetOpen, setSyncChat, syncChatOpen } = useSidebar();

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

      <Dialog
        open={syncChatOpen}
        onOpenChange={(z) => {
          setSyncChat(z);
          setCopied(false);
        }}
      >
        <DialogTrigger asChild>
          <button
            onClick={() => setSheetOpen(false)}
            className={cn(
              "flex items-center justify-center gap-2 h-12 bg-accent text-accent-foreground p-2 ",
              sidebarOpen
                ? " w-fit py-2 px-5 rounded-3xl"
                : "w-12 p-2 rounded-full"
            )}
          >
            <Infinity className=" w-6 h-6 text-inherit" />
            {sidebarOpen && (
              <span className="font-medium whitespace-nowrap">Sync chats</span>
            )}
          </button>
        </DialogTrigger>
        <DialogContent className=" w-80 sm:w-96">
          <DialogTitle>Sync chats across devices</DialogTitle>
          {code && qr ? (
            <div className=" flex flex-col gap-3 w-full">
              <div className="p-2 rounded-md bg-secondary w-full flex items-center justify-between">
                <p className=" ">{code}</p>
                <button
                  onClick={() => {
                    setCopied(true);

                    window.navigator.clipboard.writeText(code ?? "");
                  }}
                >
                  {isCopied ? (
                    <CopyCheck className=" w-4 h-4 text-primary" />
                  ) : (
                    <Copy className=" w-4 h-4 text-inherit" />
                  )}
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
                className=" bg-accent text-accent-foreground focus:outline-none  ring-border focus:ring-2 w-full p-2 rounded-md placeholder:text-xs placeholder:font-medium"
                placeholder="Enter code to sync this device with other"
              />
              <button
                onClick={() => {
                  if (!otherCode.trim().length) return;
                  Cookie.set("user", otherCode, { expires: 365 });
                  setSyncChat(false);
                  router.push("/chat");
                  router.refresh();
                  mutate();
                }}
                className=" w-full bg-primary text-primary-foreground p-2 hover:opacity-95 transition-all rounded-md font-semibold"
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

type SidebarMobileContext = {
  isSheetOpen: boolean;
  setSheetOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
  setSidebar: Dispatch<SetStateAction<boolean>>;
  syncChatOpen: boolean;
  setSyncChat: Dispatch<SetStateAction<boolean>>;
};
const SidebarMobileContext = createContext<SidebarMobileContext | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [sidebarOpen, setSidebar] = useState(true);
  const [syncChatOpen, setSyncChat] = useState(false);
  return (
    <SidebarMobileContext.Provider
      value={{
        isSheetOpen,
        setSheetOpen,
        setSidebar,
        sidebarOpen,
        setSyncChat,
        syncChatOpen,
      }}
    >
      {children}
    </SidebarMobileContext.Provider>
  );
}

export const useSidebar = () => {
  const ctx = useContext(SidebarMobileContext);
  if (!ctx) throw new Error("ctx error");
  return ctx;
};
