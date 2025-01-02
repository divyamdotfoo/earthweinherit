import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      className="prose markdown prose-table:border-b prose-table:border-spacing-0 prose-td:px-3 prose-table:border-separate prose-td:border-l prose-th:text-center prose-th:pt-2 prose-th:border prose-th:bg-primary prose-th:text-primary-foreground
       prose-li:marker:text-black prose-p:animate-chat prose-p:opacity-0 prose-li:animate-chat prose-li:opacity-0
      "
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
