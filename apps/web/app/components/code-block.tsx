type CodeBlockProps = {
  language: string;
  code: string;
};

export function CodeBlock({ language, code }: CodeBlockProps) {
  return (
    <div
      className="codeBlock"
      role="region"
      aria-label={`${language} code sample`}
    >
      <div className="codeHeader">
        <span>{language}</span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
