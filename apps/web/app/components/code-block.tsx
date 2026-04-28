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
      className={`overflow-hidden rounded-[20px] border border-white/10 bg-[#0f1115] ${className}`}
      role="region"
      aria-label={`${filename} code sample`}
    >
      <div className="flex flex-col gap-2 border-b border-white/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <span className="font-mono text-[11px] text-[#8f97a8] sm:text-xs">
          {filename}
        </span>
        <span className="self-start rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#8f97a8] sm:self-auto sm:text-[11px]">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto p-3 sm:p-4">
        <code className="font-mono text-[0.76rem] leading-6 text-[#e9ecf2] sm:text-sm sm:leading-7">
          {lines.map(renderLine)}
        </code>
      </pre>
    </div>
  );
}
