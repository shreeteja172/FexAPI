"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "./code-block";

type StackSample = {
  id: string;
  label: string;
  language: string;
  filename: string;
  summary: string;
  code: string;
};

const samples: [StackSample, ...StackSample[]] = [
  {
    id: "react",
    label: "React",
    language: "tsx",
    filename: "src/lib/api.ts",
    summary:
      "Point your React app to FexAPI with a single env variable and call typed endpoints immediately.",
    code: `const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function getUsers(count = 5) {
  const res = await fetch(\`\${API_URL}/users?count=\${count}\`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createUser(payload: { name: string; email: string }) {
  const res = await fetch(\`\${API_URL}/users\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}`,
  },
  {
    id: "next",
    label: "Next.js",
    language: "ts",
    filename: "app/lib/fexapi.ts",
    summary:
      "Use FexAPI from server components and route handlers while your real backend is still under development.",
    code: `const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getProjects() {
  const res = await fetch(\`\${API_URL}/projects\`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(payload: { name: string }) {
  const res = await fetch(\`\${API_URL}/projects\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}`,
  },
  {
    id: "node",
    label: "Node.js",
    language: "js",
    filename: "scripts/mock-check.js",
    summary:
      "Run integration checks and local scripts against FexAPI using native Node fetch.",
    code: `const API_URL = process.env.API_URL ?? "http://localhost:4000";

async function run() {
  const usersRes = await fetch(\`\${API_URL}/users?count=2\`);
  const users = await usersRes.json();

  const createRes = await fetch(\`\${API_URL}/users\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Ari", email: "ari@demo.dev" }),
  });
  const created = await createRes.json();

  console.log({ users, created });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});`,
  },
  {
    id: "express",
    label: "Express",
    language: "ts",
    filename: "src/server.ts",
    summary:
      "Proxy mock routes through your Express app to preserve auth and middleware behavior.",
    code: `import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(
  "/mock",
  createProxyMiddleware({
    target: "http://localhost:4000",
    changeOrigin: true,
    pathRewrite: { "^/mock": "" },
  }),
);

app.listen(3001, () => {
  console.log("Gateway listening on http://localhost:3001");
});`,
  },
  {
    id: "vue",
    label: "Vue",
    language: "ts",
    filename: "src/composables/useUsers.ts",
    summary:
      "Connect Vue composables directly to FexAPI so feature work continues before backend endpoints are ready.",
    code: `import { ref } from "vue";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useUsers() {
  const users = ref([]);
  const loading = ref(false);

  const fetchUsers = async () => {
    loading.value = true;
    const res = await fetch(\`\${API_URL}/users?count=8\`);
    users.value = await res.json();
    loading.value = false;
  };

  return { users, loading, fetchUsers };
}`,
  },
];

function toLines(code: string) {
  return code
    .split("\n")
    .map((line) => [{ text: line, className: "text-[#dbe3f4]" }]);
}

export function UsageStackShowcase() {
  const initialSample = samples[0];

  const [activeId, setActiveId] = useState(initialSample.id);

  const activeSample = useMemo(
    () => samples.find((sample) => sample.id === activeId) ?? initialSample,
    [activeId, initialSample],
  );

  return (
    <div className="rounded-[20px] border border-white/10 bg-[#0c0f15] p-4 shadow-[0_24px_44px_-32px_rgba(0,0,0,0.7)] sm:rounded-2xl sm:p-5">
      <div className="grid gap-2 sm:flex sm:flex-wrap">
        {samples.map((sample) => {
          const active = sample.id === activeSample.id;
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => setActiveId(sample.id)}
              className={`w-full rounded-lg px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors sm:w-auto ${
                active
                  ? "bg-white text-[#0a0c10]"
                  : "border border-white/10 bg-transparent text-white/60 hover:border-white/20 hover:text-white"
              }`}
            >
              {sample.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[0.92rem] leading-7 text-white/72 sm:mt-5 sm:text-sm">
        {activeSample.summary}
      </p>

      <CodeBlock
        language={activeSample.language}
        filename={activeSample.filename}
        lines={toLines(activeSample.code)}
        className="mt-5"
      />
    </div>
  );
}
