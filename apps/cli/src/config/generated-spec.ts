import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { GENERATED_SPEC_RELATIVE_PATH } from "../constants";
import type { GeneratedApiSpec } from "../server";

export const loadGeneratedApiSpec = (
  projectRoot: string,
): GeneratedApiSpec | undefined => {
  const generatedPath = join(projectRoot, GENERATED_SPEC_RELATIVE_PATH);

  if (!existsSync(generatedPath)) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(readFileSync(generatedPath, "utf-8")) as {
      port?: unknown;
      routes?: unknown;
    };

    if (typeof parsed.port !== "number" || !Array.isArray(parsed.routes)) {
      return undefined;
    }

    return {
      port: parsed.port,
      routes: parsed.routes as GeneratedApiSpec["routes"],
    };
  } catch {
    return undefined;
  }
};
