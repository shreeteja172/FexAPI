import { faker } from "@faker-js/faker";
import { createServer } from "node:http";
import type { ServerResponse } from "node:http";
import type { FexapiField, FexapiRoute } from "./schema";
import type {
  FexapiRuntimeConfig,
  FexapiSchemaDefinitions,
  FexapiSchemaFieldDefinition,
} from "./types/config";
import { ui } from "./cli/ui";

export type ServerOptions = {
  host?: string;
  port?: number;
  apiSpec?: GeneratedApiSpec;
  runtimeConfig?: FexapiRuntimeConfig;
  schemaDefinitions?: FexapiSchemaDefinitions;
  logRequests?: boolean;
};

export type GeneratedApiSpec = {
  port: number;
  routes: FexapiRoute[];
};

const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = 4000;

const sendJson = (
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
  options: { cors: boolean; delay: number },
) => {
  const send = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.cors) {
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Methods"] =
        "GET,POST,PUT,PATCH,DELETE,OPTIONS";
      headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization";
    }

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(payload));
  };

  if (options.delay > 0) {
    setTimeout(send, options.delay);
    return;
  }

  send();
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

const resolveFakerMethod = (path: string): (() => unknown) | undefined => {
  const pathParts = path.split(".").filter(Boolean);
  let current: unknown = faker;

  for (const pathPart of pathParts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[pathPart];
  }

  if (typeof current !== "function") {
    return undefined;
  }

  return current as () => unknown;
};

const createValueFromSchemaFieldDefinition = (
  fieldDefinition: FexapiSchemaFieldDefinition,
): unknown => {
  if (fieldDefinition.faker) {
    const fakerMethod = resolveFakerMethod(fieldDefinition.faker);
    if (fakerMethod) {
      return fakerMethod();
    }
  }

  switch (fieldDefinition.type) {
    case "number": {
      const min =
        typeof fieldDefinition.min === "number" ? fieldDefinition.min : 1;
      const max =
        typeof fieldDefinition.max === "number" ? fieldDefinition.max : 10000;

      return faker.number.int({
        min: Math.min(min, max),
        max: Math.max(min, max),
      });
    }
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
    case "string":
    default:
      return faker.lorem.words({ min: 1, max: 4 });
  }
};

const createRecordFromSchemaDefinition = (
  schemaDefinition: Record<string, FexapiSchemaFieldDefinition>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  for (const [fieldName, fieldDefinition] of Object.entries(schemaDefinition)) {
    result[fieldName] = createValueFromSchemaFieldDefinition(fieldDefinition);
  }

  return result;
};

const toCollectionKey = (routePath: string): string => {
  const segments = routePath.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment) {
    return "data";
  }

  return lastSegment.replace(/[^a-zA-Z0-9_]/g, "_");
};

const createRecordFromSchemaName = (
  schemaName: string,
  schemaDefinitions: FexapiSchemaDefinitions,
): Record<string, unknown> => {
  const normalizedSchemaName = schemaName.trim().toLowerCase();

  const customSchemaDefinition = schemaDefinitions[normalizedSchemaName];
  if (customSchemaDefinition) {
    return createRecordFromSchemaDefinition(customSchemaDefinition);
  }

  return {
    id: faker.string.uuid(),
    type: normalizedSchemaName || "record",
    value: faker.lorem.words({ min: 1, max: 4 }),
    createdAt: faker.date.recent({ days: 7 }).toISOString(),
  };
};

const getCountOverrideFromUrl = (
  urlText: string | undefined,
): number | undefined => {
  if (!urlText) {
    return undefined;
  }

  const url = new URL(urlText, "http://localhost");
  const rawCount = url.searchParams.get("count");

  if (rawCount === null) {
    return undefined;
  }

  const parsedCount = Number(rawCount);
  if (!Number.isFinite(parsedCount)) {
    return undefined;
  }

  return Math.min(Math.max(Math.floor(parsedCount), 1), 50);
};

export const startServer = ({
  host = DEFAULT_HOST,
  port = DEFAULT_PORT,
  apiSpec,
  runtimeConfig,
  schemaDefinitions = {},
  logRequests = false,
}: ServerOptions = {}) => {
  const corsEnabled = runtimeConfig?.cors ?? false;
  const responseDelay = runtimeConfig?.delay ?? 0;
  const configuredRoutes = runtimeConfig?.routes ?? {};
  const availableConfiguredRoutes = Object.keys(configuredRoutes).map(
    (path) => `GET ${path}`,
  );
  const availableSchemaRoutes = apiSpec
    ? apiSpec.routes.map((route) => `${route.method} ${route.path}`)
    : [];
  const availableRoutes = [
    ...new Set([...availableConfiguredRoutes, ...availableSchemaRoutes]),
  ];

  const server = createServer((request, response) => {
    const requestStartedAt = Date.now();
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

    if (logRequests) {
      response.on("finish", () => {
        const method = request.method ?? "UNKNOWN";
        const durationMs = Date.now() - requestStartedAt;
        const statusCode = response.statusCode;
        const statusLabel =
          statusCode >= 500
            ? ui.red(String(statusCode))
            : statusCode >= 400
              ? ui.yellow(String(statusCode))
              : ui.green(String(statusCode));
        const methodLabel =
          method === "GET"
            ? ui.cyan(method)
            : method === "POST"
              ? ui.green(method)
              : method === "DELETE"
                ? ui.red(method)
                : ui.blue(method);
        console.log(
          `${ui.gray("req")} ${methodLabel} ${pathname} ${statusLabel} ${ui.dim(`(${durationMs}ms)`)}`,
        );
      });
    }

    if (corsEnabled && request.method === "OPTIONS") {
      response.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      });
      response.end();
      return;
    }

    if (apiSpec) {
      const matchedRoute = apiSpec.routes.find(
        (route) => route.method === request.method && route.path === pathname,
      );

      if (matchedRoute) {
        const method = request.method ?? "GET";

        if (method === "GET") {
          const count = getCountOverrideFromUrl(request.url) ?? 5;
          const payloadKey = toCollectionKey(matchedRoute.path);

          sendJson(
            response,
            200,
            {
              [payloadKey]: Array.from({ length: count }, () =>
                createRecordFromRoute(matchedRoute),
              ),
            },
            { cors: corsEnabled, delay: responseDelay },
          );
          return;
        }

        if (method === "DELETE") {
          sendJson(
            response,
            200,
            { message: `Deleted resource at ${matchedRoute.path}` },
            { cors: corsEnabled, delay: responseDelay },
          );
          return;
        }
        const bodyChunks: Buffer[] = [];
        request.on("data", (chunk: Buffer) => bodyChunks.push(chunk));
        request.on("end", () => {
          let requestBody: Record<string, unknown> = {};
          try {
            const raw = Buffer.concat(bodyChunks).toString("utf-8");
            if (raw.trim()) {
              requestBody = JSON.parse(raw) as Record<string, unknown>;
            }
          } catch {
            requestBody = {};
          }

          const generatedRecord = createRecordFromRoute(matchedRoute);
          const merged = { ...generatedRecord, ...requestBody };
          const statusCode = method === "POST" ? 201 : 200;

          sendJson(response, statusCode, merged, {
            cors: corsEnabled,
            delay: responseDelay,
          });
        });
        return;
      }
    }

    if (request.method === "GET") {
      const configuredRoute = configuredRoutes[pathname];
      if (configuredRoute) {
        const count =
          getCountOverrideFromUrl(request.url) ?? configuredRoute.count;
        const payloadKey = toCollectionKey(pathname);
        sendJson(
          response,
          200,
          {
            [payloadKey]: Array.from({ length: count }, () =>
              createRecordFromSchemaName(
                configuredRoute.schema,
                schemaDefinitions,
              ),
            ),
          },
          { cors: corsEnabled, delay: responseDelay },
        );
        return;
      }
    }

    sendJson(
      response,
      404,
      {
        message: "Route not found",
        availableRoutes,
      },
      { cors: corsEnabled, delay: responseDelay },
    );
  });

  server.listen(port, host, () => {
    console.log(
      `${ui.green("ready")} Mock API running at ${ui.bold(`http://${host}:${port}`)}`,
    );
  });

  return server;
};
