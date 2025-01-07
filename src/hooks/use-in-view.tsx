"use client";
import { useEffect, useState, RefObject } from "react";

interface UseInViewOptions {
  root?: Element | null;
  margin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export function useInView<T extends Element>(
  ref: RefObject<T>,
  options: UseInViewOptions = {}
): boolean {
  const [isInView, setIsInView] = useState(false);
  const [done, setIsDone] = useState(false);
  const { root = null, margin = "0px", threshold = 0, once = false } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (once && isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
        setIsDone(true);
        if (once && done && entry.isIntersecting) {
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin: margin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, root, margin, threshold, once, isInView]);

  return isInView;
}
