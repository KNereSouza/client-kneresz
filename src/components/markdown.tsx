"use client";

import { MarkdownHooks } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose">
      <MarkdownHooks
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        children={content}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-fg underline underline-offset-2 hover:text-accent transition-colors"
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 text-sm" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="border border-border p-4 overflow-x-auto text-xs sm:text-sm">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-muted pl-4 text-muted italic">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt || ""} className="max-w-full h-auto" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 text-left bg-border/30">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2">{children}</td>
          ),
        }}
      />
    </div>
  );
}
