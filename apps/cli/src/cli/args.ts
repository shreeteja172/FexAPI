const findDuplicateFlags = (args: string[], flags: string[]): string[] => {
  return flags.filter(
    (flag) => args.filter((value) => value === flag).length > 1,
  );
};

export const parseInitOptions = (
  initArgs: string[],
): { force: boolean } | { error: string } => {
  const validFlags = new Set(["--force"]);
  const invalidFlags = initArgs.filter(
    (value) => value.startsWith("-") && !validFlags.has(value),
  );

  if (invalidFlags.length > 0) {
    return { error: `Unknown option(s): ${invalidFlags.join(", ")}` };
  }

  const positionalArgs = initArgs.filter((value) => !value.startsWith("-"));
  if (positionalArgs.length > 0) {
    return { error: `Unexpected argument(s): ${positionalArgs.join(", ")}` };
  }

  return { force: initArgs.includes("--force") };
};

export const parseGenerateOptions = (
  generateArgs: string[],
): { error?: string } => {
  const invalidFlags = generateArgs.filter((value) => value.startsWith("-"));

  if (invalidFlags.length > 0) {
    return { error: `Unknown option(s): ${invalidFlags.join(", ")}` };
  }

  const positionalArgs = generateArgs.filter((value) => !value.startsWith("-"));
  if (positionalArgs.length > 0) {
    return { error: `Unexpected argument(s): ${positionalArgs.join(", ")}` };
  }

  return {};
};

export const parseFormatOptions = (
  formatArgs: string[],
): { error?: string } => {
  const invalidFlags = formatArgs.filter((value) => value.startsWith("-"));

  if (invalidFlags.length > 0) {
    return { error: `Unknown option(s): ${invalidFlags.join(", ")}` };
  }

  const positionalArgs = formatArgs.filter((value) => !value.startsWith("-"));
  if (positionalArgs.length > 0) {
    return { error: `Unexpected argument(s): ${positionalArgs.join(", ")}` };
  }

  return {};
};

export const parseServeOptions = (
  serveArgs: string[],
): { host: string; port?: number; logEnabled: boolean } | { error: string } => {
  const duplicateFlags = findDuplicateFlags(serveArgs, [
    "--host",
    "--port",
    "--log",
  ]);
  if (duplicateFlags.length > 0) {
    return { error: `Duplicate option(s): ${duplicateFlags.join(", ")}` };
  }

  const getFlagValue = (
    flagName: "--host" | "--port",
  ): string | { error: string } | undefined => {
    const index = serveArgs.indexOf(flagName);

    if (index === -1) {
      return undefined;
    }

    const value = serveArgs[index + 1];
    if (!value || value.startsWith("-")) {
      return { error: `Missing value for ${flagName}` };
    }

    return value;
  };

  const unknownFlags = serveArgs.filter(
    (value) =>
      value.startsWith("-") &&
      value !== "--host" &&
      value !== "--port" &&
      value !== "--log",
  );
  if (unknownFlags.length > 0) {
    return { error: `Unknown option(s): ${unknownFlags.join(", ")}` };
  }

  const hostValue = getFlagValue("--host");
  if (hostValue && typeof hostValue !== "string") {
    return hostValue;
  }

  const portValue = getFlagValue("--port");
  if (portValue && typeof portValue !== "string") {
    return portValue;
  }

  const consumedIndexes = new Set<number>();
  serveArgs.forEach((value, index) => {
    if (value === "--log") {
      consumedIndexes.add(index);
    }
    if ((value === "--host" || value === "--port") && serveArgs[index + 1]) {
      consumedIndexes.add(index);
      consumedIndexes.add(index + 1);
    }
  });

  const positionalArgs = serveArgs.filter(
    (_value, index) => !consumedIndexes.has(index),
  );
  if (positionalArgs.length > 0) {
    return { error: `Unexpected argument(s): ${positionalArgs.join(", ")}` };
  }

  const host = hostValue ?? "127.0.0.1";
  const port = portValue ? Number(portValue) : undefined;

  if (
    port !== undefined &&
    (!Number.isInteger(port) || port < 1 || port > 65535)
  ) {
    return { error: `Invalid port: ${portValue ?? ""}`.trim() };
  }

  return { host, port, logEnabled: serveArgs.includes("--log") };
};

export const parseDevOptions = (
  devArgs: string[],
):
  | { host: string; port?: number; watchEnabled: boolean; logEnabled: boolean }
  | { error: string } => {
  const duplicateFlags = findDuplicateFlags(devArgs, [
    "--host",
    "--port",
    "--watch",
    "--log",
  ]);
  if (duplicateFlags.length > 0) {
    return { error: `Duplicate option(s): ${duplicateFlags.join(", ")}` };
  }

  const getFlagValue = (
    flagName: "--host" | "--port",
  ): string | { error: string } | undefined => {
    const index = devArgs.indexOf(flagName);

    if (index === -1) {
      return undefined;
    }

    const value = devArgs[index + 1];
    if (!value || value.startsWith("-")) {
      return { error: `Missing value for ${flagName}` };
    }

    return value;
  };

  const unknownFlags = devArgs.filter(
    (value) =>
      value.startsWith("-") &&
      value !== "--host" &&
      value !== "--port" &&
      value !== "--watch" &&
      value !== "--log",
  );
  if (unknownFlags.length > 0) {
    return { error: `Unknown option(s): ${unknownFlags.join(", ")}` };
  }

  const hostValue = getFlagValue("--host");
  if (hostValue && typeof hostValue !== "string") {
    return hostValue;
  }

  const portValue = getFlagValue("--port");
  if (portValue && typeof portValue !== "string") {
    return portValue;
  }

  const consumedIndexes = new Set<number>();
  devArgs.forEach((value, index) => {
    if (value === "--watch" || value === "--log") {
      consumedIndexes.add(index);
    }
    if ((value === "--host" || value === "--port") && devArgs[index + 1]) {
      consumedIndexes.add(index);
      consumedIndexes.add(index + 1);
    }
  });

  const positionalArgs = devArgs.filter(
    (_value, index) => !consumedIndexes.has(index),
  );
  if (positionalArgs.length > 0) {
    return { error: `Unexpected argument(s): ${positionalArgs.join(", ")}` };
  }

  const host = hostValue ?? "127.0.0.1";
  const port = portValue ? Number(portValue) : undefined;

  if (
    port !== undefined &&
    (!Number.isInteger(port) || port < 1 || port > 65535)
  ) {
    return { error: `Invalid port: ${portValue ?? ""}`.trim() };
  }

  return {
    host,
    port,
    watchEnabled: devArgs.includes("--watch"),
    logEnabled: devArgs.includes("--log"),
  };
};
