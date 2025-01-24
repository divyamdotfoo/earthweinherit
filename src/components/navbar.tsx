import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { CSSProperties, HTMLAttributeAnchorTarget } from "react";

export function Navbar() {
  return (
    <div className="pt-6 md:pt-8 w-full pb-3 font-secondary lg:sticky lg:top-0 z-50 bg-background selection:bg-white">
      <div className=" max-w-screen-xxl mx-auto relative flex items-start md:items-center flex-col gap-2 md:gap-0 md:flex-row justify-between w-full px-4">
        <div className=" absolute -top-3 h-[1px] bg-foreground animate-fillWidth"></div>
        <Link href={"/"}>
          <h1 className=" text-xl font-extrabold">Earth we Inherit</h1>
        </Link>
        <div className=" flex items-center md:gap-8 gap-4 text-sm sm:text-base md:text-lg font-medium">
          <HoverLink
            style={{
              animationDelay: "800ms",
            }}
            className=" animate-fadeIn opacity-0"
            href={"/chat"}
          >
            Explore
          </HoverLink>

          <HoverLink
            style={{
              animationDelay: "1000ms",
            }}
            className=" animate-fadeIn opacity-0"
            href={"/#resources"}
          >
            Resources
          </HoverLink>
        </div>
      </div>
    </div>
  );
}

interface HoverLinkProps extends LinkProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
  style?: CSSProperties;
}

export function HoverLink({
  children,
  className,
  style,
  color = "#000",
  target = "_parent",
  ...props
}: HoverLinkProps) {
  return (
    <Link
      target={target}
      {...props}
      className={cn("relative inline-block group", className)}
      style={style}
    >
      {children}
      <span
        className="absolute bottom-0 left-1/2 w-0 h-[2px] transition-all duration-300 transform -translate-x-1/2 group-hover:w-full"
        style={{
          backgroundColor: color,
        }}
      ></span>
    </Link>
  );
}
