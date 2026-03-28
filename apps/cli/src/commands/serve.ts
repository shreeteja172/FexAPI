import type { Server } from "node:http";
import { logError, logInfo, logWarn } from "../cli/ui";
import { GENERATED_SPEC_RELATIVE_PATH } from "../constants";
import { loadGeneratedApiSpec } from "../config/generated-spec";
import { loadFexapiRuntimeConfig } from "../config/runtime-config";
import { loadSchemaDefinitions } from "../config/schema-definitions";
import { resolveProjectRoot } from "../project/paths";
import { startServer } from "../server";

export const createProjectServer = ({
  host,
  port,
  logEnabled = false,
}: {
  host: string;
  port?: number;
  logEnabled?: boolean;
}): Server | undefined => {
  const projectRoot = resolveProjectRoot();

  if (!projectRoot) {
    logError(
      "Could not find package.json in this directory or parent directories.",
    );
    return undefined;
  }

  const runtimeConfig = projectRoot
    ? loadFexapiRuntimeConfig(projectRoot)
    : undefined;
  const schemaDefinitions = projectRoot
    ? loadSchemaDefinitions(projectRoot)
    : {};
  const generatedSpec = projectRoot
    ? loadGeneratedApiSpec(projectRoot)
    : undefined;

  const effectivePort =
    port ?? runtimeConfig?.port ?? generatedSpec?.port ?? 4000;

  if (runtimeConfig?.routes && Object.keys(runtimeConfig.routes).length > 0) {
    logInfo(
      `Using routes from fexapi.config.js (${Object.keys(runtimeConfig.routes).length})`,
    );
  }

  if (Object.keys(schemaDefinitions).length > 0) {
    logInfo(
      `Loaded custom schemas from fexapi/schemas (${Object.keys(schemaDefinitions).length})`,
    );
  }

  if (
    generatedSpec &&
    !(runtimeConfig?.routes && Object.keys(runtimeConfig.routes).length > 0)
  ) {
    logInfo(
      `Using generated schema routes (${generatedSpec.routes.length}) from ${GENERATED_SPEC_RELATIVE_PATH}`,
    );
  } else if (
    !runtimeConfig?.routes ||
    Object.keys(runtimeConfig.routes).length === 0
  ) {
    logWarn(
      "No generated schema found. Run `fexapi generate` to serve schema-defined endpoints.",
    );
  }

  return startServer({
    host,
    port: effectivePort,
    apiSpec: generatedSpec,
    runtimeConfig,
    schemaDefinitions,
    logRequests: logEnabled,
  });
};

export const serveProject = ({
  host,
  port,
  logEnabled,
}: {
  host: string;
  port?: number;
  logEnabled?: boolean;
}): number => {
  const server = createProjectServer({ host, port, logEnabled });

  if (!server) {
    return 1;
  }

  const shutdown = () => {
    server.close((error) => {
      if (error) {
        logError(`Error while shutting down server: ${String(error)}`);
        process.exit(1);
      }

      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return 0;
};
