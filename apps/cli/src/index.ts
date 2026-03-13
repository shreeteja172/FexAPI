import { startServer } from "./server";

const args = process.argv.slice(2);

const hasHelpFlag = args.includes("--help") || args.includes("-h");

if (hasHelpFlag) {
  console.log("mockit-cli");
  console.log("Usage: mockit [--host <host>] [--port <number>]");
  console.log("Example: mockit --host 127.0.0.1 --port 5000");
  process.exit(0);
}

const getFlagValue = (flagName: string): string | undefined => {
  const index = args.indexOf(flagName);
  if (index === -1 || index >= args.length - 1) {
    return undefined;
  }

  return args[index + 1];
};

const host = getFlagValue("--host") ?? "127.0.0.1";
const rawPort = getFlagValue("--port");
const port = Number(rawPort ?? 4000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`Invalid port: ${rawPort}`);
  process.exit(1);
}

const server = startServer({ host, port });

const shutdown = () => {
  server.close((error) => {
    if (error) {
      console.error("Error while shutting down server", error);
      process.exit(1);
    }

    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
