import { existsSync, watch } from "node:fs";
import type { FSWatcher } from "node:fs";
import { join, relative } from "node:path";
import { logError, logInfo } from "../cli/ui";
import { resolveProjectRoot } from "../project/paths";
import { createProjectServer, serveProject } from "./serve";

const WATCH_DEBOUNCE_MS = 150;

const normalizePath = (pathValue: string): string => {
  return pathValue.replace(/\\/g, "/").toLowerCase();
};

const isWatchedPath = (projectRoot: string, changedPath: string): boolean => {
  const relativePath = normalizePath(relative(projectRoot, changedPath));

  if (relativePath === "fexapi.config.js") {
    return true;
  }

  if (relativePath.startsWith("fexapi/")) {
    return true;
  }

  return (
    relativePath.startsWith("fexapi/schemas/") &&
    (relativePath.endsWith(".yaml") || relativePath.endsWith(".yml"))
  );
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

  const restartServer = async (reason: string) => {
    if (!currentServer) {
      return;
    }

    if (restartInProgress) {
      restartQueued = true;
      return;
    }

    restartInProgress = true;

    logInfo(`[watch] change detected (${reason})`);
    await new Promise<void>((resolve) => {
      currentServer?.close(() => {
        resolve();
      });
    });

    currentServer = createProjectServer({ host, port, logEnabled });

    restartInProgress = false;

    if (restartQueued) {
      restartQueued = false;
      await restartServer("queued changes");
    }
  };

  const scheduleRestart = (reason: string) => {
    if (restartTimer) {
      clearTimeout(restartTimer);
    }

    restartTimer = setTimeout(() => {
      void restartServer(reason);
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
        scheduleRestart("unknown file");
        return;
      }

      const changedPath = join(watchTarget, file.toString());

      if (isWatchedPath(projectRoot, changedPath)) {
        scheduleRestart(relative(projectRoot, changedPath));
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

    await new Promise<void>((resolve) => {
      currentServer?.close(() => resolve());
    });

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
