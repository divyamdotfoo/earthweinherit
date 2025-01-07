"use client";
import { useInView } from "@/hooks/use-in-view";
import React, { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

/**
 * Renders an animated underline effect for its child content.
 *
 * @param {number} [delay] in ms.
 */
export function Underline({
  children,
  color,
  iterations = 1,
  strokeWidth = 2,
  delay = 0,
  viewThreshold = 0.4,
  className,
}: {
  children: React.ReactNode;
  color: string;
  viewThreshold?: number;
  strokeWidth?: number;
  iterations?: number;
  delay?: number;
  className?: string;
}) {
  const elRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elRef, {
    once: true,
    threshold: viewThreshold,
  });
  useEffect(() => {
    if (isInView && elRef.current) {
      const ann = annotate(elRef.current, {
        type: "underline",
        strokeWidth: strokeWidth,
        color: color,
        iterations: iterations,
        multiline: true,
      });
      setTimeout(() => {
        ann.show();
      }, delay);
    }
  }, [isInView]);

  return (
    <span className={className} ref={elRef}>
      {children}
    </span>
  );
}
