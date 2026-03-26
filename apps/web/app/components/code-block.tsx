import { ReactNode } from "react";

type Token = {
  text: string;
  className?: string;
};

type CodeBlockProps = {
  language: string;
  filename: string;
  lines: Token[][];
  className?: string;
};

export function CodeBlock({
  language,
  filename,
  lines,
  className = "",
}: CodeBlockProps) {
  const renderLine = (line: Token[], index: number): ReactNode => (
    <div
      key={`${filename}-${index}`}
      className="grid grid-cols-[2rem_1fr] gap-4"
    >
      <span className="select-none text-right text-[#5f6673]">{index + 1}</span>
      <span>
        {line.map((token, tokenIndex) => (
          <span
            key={`${filename}-${index}-${tokenIndex}`}
            className={token.className}
          >
            {token.text}
          </span>
        ))}
      </span>
    </div>
  );

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0f1115] ${className}`}
      role="region"
      aria-label={`${filename} code sample`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-mono text-xs text-[#8f97a8]">{filename}</span>
        <span className="rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#8f97a8]">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm leading-7 text-[#e9ecf2]">
          {lines.map(renderLine)}
        </code>
      </pre>
    </div>
  );
}
