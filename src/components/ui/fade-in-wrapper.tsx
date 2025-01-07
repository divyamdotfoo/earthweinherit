"use client";

import { useInView } from "@/hooks/use-in-view";
import { useRef } from "react";

/**
 *
 * @param [delay] in seconds
 * @returns
 */
export function FadeInWrapper({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <div
      className={isInView ? "animate-fadeIn opacity-0" : " opacity-0"}
      ref={ref}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
