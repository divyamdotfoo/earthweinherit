"use client";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Copy,
  Infinity,
  PlusIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Chats } from "@/supabase/queries";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toDataURL as QR } from "qrcode";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Cookie from "js-cookie";

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
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
    <>
      {/* desktop */}
      <div
        className={cn(
          "hidden md:flex p-4 transition-all  flex-col justify-between gap-20 duration-300 ease-out border-r border-border h-screen sticky top-0 overflow-y-auto bg-zinc-800 shrink-0 overflow-hidden",
          open ? " w-[280px]" : " w-[90px]"
        )}
      >
        <div>
          <div className="">
            <div className=" flex items-center w-full justify-between pb-2">
              <h1 className=" text-xl font-bold text-center">IPCC</h1>
              {open && (
                <button onClick={() => setOpen(false)}>
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
                open
                  ? " w-full rounded-md justify-start"
                  : " w-12 rounded-full justify-center"
              )}
            >
              <PlusIcon className=" text-inherit w-5 h-5" />
              {open && (
                <span className=" block animate-fadeIn">Start new chat</span>
              )}
            </button>
          </div>

          {open ? (
            isLoading && chats.length === 0 ? (
              <div className=" py-6">Loading ....</div>
            ) : (
              <div className=" flex flex-col items-center w-full gap-1 py-6">
                {chats.map((c) => (
                  <Link
                    key={c.id}
                    href={`/chat/${c.id}`}
                    className={cn(
                      "p-2 text-sm rounded-md hover:bg-background/30 transition-all w-64",
                      pathname.split("/").at(-1) === c.id && "bg-background/30"
                    )}
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            )
          ) : null}
        </div>

        <div className=" flex flex-col items-center gap-3 w-full">
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className=" p-4 rounded-full flex items-center justify-center bg-background/20"
            >
              <ArrowRightFromLine className=" text-inherit w-6 h-6 stroke-[2.4px]" />
            </button>
          )}

          <SyncChats open={open} mutate={mutate} chats={chats} />
        </div>
      </div>

      {/* mobile */}
    </>
  );
}

function SyncChats({
  open,
  mutate,
  chats,
}: {
  open: boolean;
  mutate: () => void;
  chats: Chats;
}) {
  const [code, setCode] = useState<string | undefined>(undefined);
  const pathname = usePathname();
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
          `${window.location.origin}/chat?id=${user}`,
          { scale: 8 },
          (err, url) => setQr(url)
        );
      }
    }
  }, [chats]);

  useEffect(() => {
    const id = searchParams.get("id");
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
              "flex items-center justify-center md:gap-2 h-12 bg-background/40 p-2 ",
              open ? " w-fit py-2 px-5 rounded-3xl" : "w-12 p-2 rounded-full"
            )}
          >
            <Infinity className=" w-6 h-6 text-inherit" />
            {open && (
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
                  router.push("/chat");
                  router.refresh();
                  mutate();
                  setDialog(false);
                }}
                className=" w-full bg-white p-2 rounded-md text-black font-semibold"
              >
                Sync this
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

export function BottomNav() {
  return (
    <div className=" p-4 h-20 bg-secondary w-full md:hidden fixed bottom-0">
      bottom nav
    </div>
  );
}
