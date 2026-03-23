import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

export const findClosestPackageJson = (
  startDirectory: string,
): string | undefined => {
  let currentDirectory = startDirectory;

  while (true) {
    const candidate = join(currentDirectory, "package.json");
    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDirectory = dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      return undefined;
    }

    currentDirectory = parentDirectory;
  }
};

export const resolveProjectRoot = (): string | undefined => {
  const packageJsonPath = findClosestPackageJson(process.cwd());
  if (!packageJsonPath) {
    return undefined;
  }

  return dirname(packageJsonPath);
};
