import { existsSync, watch } from "node:fs";
import type { FSWatcher } from "node:fs";
import { join, relative } from "node:path";
import { logError, logInfo, logSuccess, logWarn, printSpacer } from "../cli/ui";
import { resolveProjectRoot } from "../project/paths";
import { generateFromSchema } from "./generate";
import { createProjectServer, serveProject } from "./serve";

const WATCH_DEBOUNCE_MS = 150;
const GENERATED_SPEC_PATH = "fexapi/generated.api.json";
const GENERATED_SPEC_SUPPRESS_MS = 1200;

const normalizePath = (pathValue: string): string => {
  return pathValue.replace(/\\/g, "/").toLowerCase();
};

const getWatchReaction = (
  projectRoot: string,
  changedPath: string,
):
  | {
      shouldRestart: true;
      shouldRegenerate: boolean;
      reason: string;
    }
  | undefined => {
  const relativePath = normalizePath(relative(projectRoot, changedPath));

  if (relativePath === "fexapi.config.js") {
    return {
      shouldRestart: true,
      shouldRegenerate: false,
      reason: "fexapi.config.js changed",
    };
  }

  if (relativePath === "fexapi/schema.fexapi") {
    return {
      shouldRestart: true,
      shouldRegenerate: true,
      reason: "schema.fexapi changed",
    };
  }

  if (
    relativePath.startsWith("fexapi/schemas/") &&
    (relativePath.endsWith(".yaml") || relativePath.endsWith(".yml"))
  ) {
    return {
      shouldRestart: true,
      shouldRegenerate: true,
      reason: "custom schema definition changed",
    };
  }

  if (relativePath === GENERATED_SPEC_PATH) {
    return {
      shouldRestart: true,
      shouldRegenerate: false,
      reason: "generated.api.json changed",
    };
  }

  if (relativePath.startsWith("fexapi/")) {
    return {
      shouldRestart: true,
      shouldRegenerate: false,
      reason: `file changed (${relativePath})`,
    };
  }

  return undefined;
};

export const runDevCommand = ({
  host,
  port,
  watchEnabled,
  logEnabled,
}: {
  host: string;
  port?: number;
  watchEnabled: boolean;
  logEnabled: boolean;
}): number => {
  if (!watchEnabled) {
    return serveProject({ host, port, logEnabled });
  }

  const projectRoot = resolveProjectRoot();

  if (!projectRoot) {
    logError(
      "Could not find package.json in this directory or parent directories.",
    );
    return 1;
  }

  let currentServer = createProjectServer({ host, port, logEnabled });
  if (!currentServer) {
    return 1;
  }

  logInfo("Watch mode enabled. Restarting on config/schema changes...");

  let restartTimer: NodeJS.Timeout | undefined;
  let restartQueued = false;
  let restartInProgress = false;
  let pendingReasons = new Set<string>();
  let pendingRegeneration = false;
  let suppressGeneratedSpecUntilMs = 0;

  const collectPendingWatchChanges = ({
    reason,
    shouldRegenerate,
  }: {
    reason: string;
    shouldRegenerate: boolean;
  }): void => {
    pendingReasons.add(reason);
    if (shouldRegenerate) {
      pendingRegeneration = true;
    }
  };

  const restartServer = async ({
    reason,
    shouldRegenerate,
  }: {
    reason: string;
    shouldRegenerate: boolean;
  }) => {
    if (restartInProgress) {
      restartQueued = true;
      collectPendingWatchChanges({ reason, shouldRegenerate });
      return;
    }

    restartInProgress = true;

    logInfo(`[watch] change detected (${reason})`);

    if (shouldRegenerate) {
      printSpacer();
      logInfo("[watch] regenerating generated.api.json from schema changes...");
      const generationExitCode = generateFromSchema();

      if (generationExitCode !== 0) {
        logError("[watch] generation failed; keeping previous server state.");
        logWarn(
          "Fix schema errors and save again. Watch mode will retry automatically.",
        );
        restartInProgress = false;

        if (restartQueued) {
          restartQueued = false;
          const queuedReasons = Array.from(pendingReasons);
          const queuedRegeneration = pendingRegeneration;
          pendingReasons = new Set<string>();
          pendingRegeneration = false;
          await restartServer({
            reason: queuedReasons.join(", ") || "queued changes",
            shouldRegenerate: queuedRegeneration,
          });
        }

        return;
      }

      suppressGeneratedSpecUntilMs = Date.now() + GENERATED_SPEC_SUPPRESS_MS;
    }

    if (currentServer) {
      await new Promise<void>((resolve) => {
        currentServer?.close(() => {
          resolve();
        });
      });
    }

    currentServer = createProjectServer({ host, port, logEnabled });

    if (currentServer) {
      logSuccess("[watch] server reloaded");
    } else {
      logError(
        "[watch] server reload failed; waiting for next change to retry.",
      );
    }

    restartInProgress = false;

    if (restartQueued) {
      restartQueued = false;
      const queuedReasons = Array.from(pendingReasons);
      const queuedRegeneration = pendingRegeneration;
      pendingReasons = new Set<string>();
      pendingRegeneration = false;
      await restartServer({
        reason: queuedReasons.join(", ") || "queued changes",
        shouldRegenerate: queuedRegeneration,
      });
    }
  };

  const scheduleRestart = ({
    reason,
    shouldRegenerate,
  }: {
    reason: string;
    shouldRegenerate: boolean;
  }) => {
    collectPendingWatchChanges({ reason, shouldRegenerate });

    if (restartTimer) {
      clearTimeout(restartTimer);
    }

    restartTimer = setTimeout(() => {
      const reasons = Array.from(pendingReasons);
      const requiresRegeneration = pendingRegeneration;
      pendingReasons = new Set<string>();
      pendingRegeneration = false;

      void restartServer({
        reason: reasons.join(", ") || reason,
        shouldRegenerate: requiresRegeneration,
      });
    }, WATCH_DEBOUNCE_MS);
  };

  const activeWatchers: FSWatcher[] = [];

  const watchTargets = [join(projectRoot, "fexapi"), projectRoot];

  for (const watchTarget of watchTargets) {
    if (!existsSync(watchTarget)) {
      continue;
    }

    const watcher = watch(watchTarget, { recursive: true }, (_event, file) => {
      if (!file) {
        scheduleRestart({ reason: "unknown file", shouldRegenerate: false });
        return;
      }

      const changedPath = join(watchTarget, file.toString());
      const normalizedRelativePath = normalizePath(
        relative(projectRoot, changedPath),
      );

      if (
        normalizedRelativePath === GENERATED_SPEC_PATH &&
        Date.now() < suppressGeneratedSpecUntilMs
      ) {
        return;
      }

      const watchReaction = getWatchReaction(projectRoot, changedPath);

      if (watchReaction?.shouldRestart) {
        scheduleRestart({
          reason: watchReaction.reason,
          shouldRegenerate: watchReaction.shouldRegenerate,
        });
      }
    });

    activeWatchers.push(watcher);
  }

  const cleanupAndExit = async () => {
    if (restartTimer) {
      clearTimeout(restartTimer);
      restartTimer = undefined;
    }

    for (const watcher of activeWatchers) {
      watcher.close();
    }

    if (currentServer) {
      await new Promise<void>((resolve) => {
        currentServer?.close(() => resolve());
      });
    }

    process.exit(0);
  };

  process.on("SIGINT", () => {
    void cleanupAndExit();
  });

  process.on("SIGTERM", () => {
    void cleanupAndExit();
  });

  return 0;
};
