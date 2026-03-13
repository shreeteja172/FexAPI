import { faker } from "@faker-js/faker";
import { createServer } from "node:http";
import type { ServerResponse } from "node:http";

export type ServerOptions = {
  host?: string;
  port?: number;
};

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4000;

const sendJson = (
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
) => {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
};

const createMockUser = () => {
  return {
    id: faker.string.uuid(),
    fullName: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    avatarUrl: faker.image.avatar(),
  };
};

const createMockPost = () => {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs({ min: 1, max: 3 }),
    createdAt: faker.date.recent({ days: 14 }).toISOString(),
  };
};

const getCountFromUrl = (urlText: string | undefined, fallback = 5): number => {
  if (!urlText) {
    return fallback;
  }

  const url = new URL(urlText, "http://localhost");
  const rawCount = Number(url.searchParams.get("count") ?? fallback);

  if (!Number.isFinite(rawCount)) {
    return fallback;
  }

  return Math.min(Math.max(Math.floor(rawCount), 1), 50);
};

export const startServer = ({
  host = DEFAULT_HOST,
  port = DEFAULT_PORT,
}: ServerOptions = {}) => {
  const server = createServer((request, response) => {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

    if (request.method === "GET" && pathname === "/health") {
      sendJson(response, 200, {
        ok: true,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (request.method === "GET" && pathname === "/users") {
      const count = getCountFromUrl(request.url, 8);
      sendJson(response, 200, {
        users: Array.from({ length: count }, createMockUser),
      });
      return;
    }

    if (request.method === "GET" && pathname === "/posts") {
      const count = getCountFromUrl(request.url, 5);
      sendJson(response, 200, {
        posts: Array.from({ length: count }, createMockPost),
      });
      return;
    }

    sendJson(response, 404, {
      message: "Route not found",
      availableRoutes: [
        "GET /health",
        "GET /users?count=10",
        "GET /posts?count=5",
      ],
    });
  });

  server.listen(port, host, () => {
    console.log(`Mock API running at http://${host}:${port}`);
  });

  return server;
};
