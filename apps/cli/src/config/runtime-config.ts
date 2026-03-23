import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { FexapiRouteConfig, FexapiRuntimeConfig } from "../types/config";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const normalizePath = (value: string): string => {
  return value.startsWith("/") ? value : `/${value}`;
};

export const loadFexapiRuntimeConfig = (
  projectRoot: string,
): FexapiRuntimeConfig | undefined => {
  const configPath = join(projectRoot, "fexapi.config.js");

  if (!existsSync(configPath)) {
    return undefined;
  }

  try {
    const source = readFileSync(configPath, "utf-8");
    const moduleShim: { exports: unknown } = { exports: {} };
    const exportsShim: Record<string, unknown> = {};
    const executeModule = new Function("module", "exports", source);
    executeModule(moduleShim, exportsShim);

    const rawConfig = moduleShim.exports;
    if (!isRecord(rawConfig)) {
      console.error("Invalid fexapi.config.js: expected an object export.");
      return undefined;
    }

    const normalizedConfig: FexapiRuntimeConfig = {};

    if (rawConfig.port !== undefined) {
      if (
        typeof rawConfig.port !== "number" ||
        !Number.isInteger(rawConfig.port) ||
        rawConfig.port < 1 ||
        rawConfig.port > 65535
      ) {
        console.error(
          "Invalid fexapi.config.js: `port` must be an integer between 1 and 65535.",
        );
      } else {
        normalizedConfig.port = rawConfig.port;
      }
    }

    if (rawConfig.cors !== undefined) {
      if (typeof rawConfig.cors !== "boolean") {
        console.error(
          "Invalid fexapi.config.js: `cors` must be true or false.",
        );
      } else {
        normalizedConfig.cors = rawConfig.cors;
      }
    }

    if (rawConfig.delay !== undefined) {
      if (
        typeof rawConfig.delay !== "number" ||
        !Number.isFinite(rawConfig.delay) ||
        rawConfig.delay < 0
      ) {
        console.error(
          "Invalid fexapi.config.js: `delay` must be a non-negative number.",
        );
      } else {
        normalizedConfig.delay = Math.floor(rawConfig.delay);
      }
    }

    if (rawConfig.routes !== undefined) {
      if (!isRecord(rawConfig.routes)) {
        console.error("Invalid fexapi.config.js: `routes` must be an object.");
      } else {
        const normalizedRoutes: Record<string, FexapiRouteConfig> = {};

        for (const [pathKey, routeValue] of Object.entries(rawConfig.routes)) {
          if (!isRecord(routeValue)) {
            console.error(
              `Invalid fexapi.config.js route at ${pathKey}: expected an object with count and schema.`,
            );
            continue;
          }

          const schemaValue = routeValue.schema;
          if (
            typeof schemaValue !== "string" ||
            schemaValue.trim().length === 0
          ) {
            console.error(
              `Invalid fexapi.config.js route at ${pathKey}: schema must be a non-empty string.`,
            );
            continue;
          }

          const countValue = routeValue.count;
          const normalizedCount =
            typeof countValue === "number" &&
            Number.isInteger(countValue) &&
            countValue > 0
              ? countValue
              : 10;

          normalizedRoutes[normalizePath(pathKey)] = {
            count: normalizedCount,
            schema: schemaValue.trim(),
          };
        }

        normalizedConfig.routes = normalizedRoutes;
      }
    }

    return normalizedConfig;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to load fexapi.config.js: ${message}`);
    return undefined;
  }
};
