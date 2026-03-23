import { faker } from "@faker-js/faker";
import { createServer } from "node:http";
import type { ServerResponse } from "node:http";
import type { FexapiField, FexapiRoute } from "./schema";

export type ServerOptions = {
  host?: string;
  port?: number;
  apiSpec?: GeneratedApiSpec;
};

export type GeneratedApiSpec = {
  port: number;
  routes: FexapiRoute[];
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

const createValueFromField = (field: FexapiField): unknown => {
  switch (field.type) {
    case "number":
      return faker.number.int({ min: 1, max: 10000 });
    case "string":
      return faker.lorem.words({ min: 1, max: 4 });
    case "boolean":
      return faker.datatype.boolean();
    case "date":
      return faker.date.recent({ days: 30 }).toISOString();
    case "uuid":
      return faker.string.uuid();
    case "email":
      return faker.internet.email();
    case "url":
      return faker.internet.url();
    case "name":
      return faker.person.fullName();
    case "phone":
      return faker.phone.number();
    default:
      return faker.lorem.word();
  }
};

const createRecordFromRoute = (route: FexapiRoute): Record<string, unknown> => {
  return route.fields.reduce<Record<string, unknown>>((record, field) => {
    record[field.name] = createValueFromField(field);
    return record;
  }, {});
};

const toCollectionKey = (routePath: string): string => {
  const segments = routePath.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment) {
    return "data";
  }

  return lastSegment.replace(/[^a-zA-Z0-9_]/g, "_");
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
  apiSpec,
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

    if (apiSpec) {
      const matchedRoute = apiSpec.routes.find(
        (route) => route.method === request.method && route.path === pathname,
      );

      if (matchedRoute) {
        const count = getCountFromUrl(request.url, 5);
        const payloadKey = toCollectionKey(matchedRoute.path);

        sendJson(response, 200, {
          [payloadKey]: Array.from({ length: count }, () =>
            createRecordFromRoute(matchedRoute),
          ),
        });
        return;
      }
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
      availableRoutes: apiSpec
        ? [
            "GET /health",
            ...apiSpec.routes.map((route) => `${route.method} ${route.path}`),
          ]
        : ["GET /health", "GET /users?count=10", "GET /posts?count=5"],
    });
  });

  server.listen(port, host, () => {
    console.log(`Mock API running at http://${host}:${port}`);
  });

  return server;
};
