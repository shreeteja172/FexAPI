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

  return { force: initArgs.includes("--force") };
};

export const parseGenerateOptions = (
  generateArgs: string[],
): { error?: string } => {
  const invalidFlags = generateArgs.filter((value) => value.startsWith("-"));

  if (invalidFlags.length > 0) {
    return { error: `Unknown option(s): ${invalidFlags.join(", ")}` };
  }

  return {};
};

export const parseServeOptions = (
  serveArgs: string[],
): { host: string; port?: number; logEnabled: boolean } | { error: string } => {
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
  | { host: string; port?: number; watchEnabled: boolean }
  | { error: string } => {
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
      value !== "--watch",
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

  const host = hostValue ?? "127.0.0.1";
  const port = portValue ? Number(portValue) : undefined;

  if (
    port !== undefined &&
    (!Number.isInteger(port) || port < 1 || port > 65535)
  ) {
    return { error: `Invalid port: ${portValue ?? ""}`.trim() };
  }

  return { host, port, watchEnabled: devArgs.includes("--watch") };
};
