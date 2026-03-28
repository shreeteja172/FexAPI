import { formatCommand, printBanner, printSpacer, ui } from "./ui";

export const printHelp = () => {
  printBanner();
  printSpacer();
  console.log(ui.bold("Usage"));
  console.log(`  ${formatCommand("fexapi init [--force]")}`);
  console.log(`  ${formatCommand("fexapi generate")}`);
  console.log(`  ${formatCommand("fexapi format")}`);
  console.log(
    `  ${formatCommand("fexapi dev [--watch] [--host <host>] [--port <number>] [--log]")}`,
  );
  console.log(
    `  ${formatCommand("fexapi serve [--host <host>] [--port <number>] [--log]")}`,
  );
  console.log(
    `  ${formatCommand("fexapi run [--host <host>] [--port <number>] [--log]")}`,
  );
  console.log(
    `  ${formatCommand("fexapi [--host <host>] [--port <number>] [--log]")}`,
  );
  console.log(`  ${formatCommand("fexapi --help")}`);
  printSpacer();

  console.log(ui.bold("Examples"));
  console.log(`  ${formatCommand("fexapi init")}`);
  console.log(`  ${formatCommand("fexapi init --force")}`);
  console.log(`  ${formatCommand("fexapi generate")}`);
  console.log(`  ${formatCommand("fexapi format")}`);
  console.log(`  ${formatCommand("fexapi dev --watch")}`);
  console.log(`  ${formatCommand("fexapi dev --watch --log")}`);
  console.log(`  ${formatCommand("fexapi serve --log")}`);
  console.log(
    `  ${formatCommand("fexapi serve --host 127.0.0.1 --port 5000")}`,
  );
  console.log(`  ${formatCommand("fexapi --port 4000")}`);
  printSpacer();

  console.log(ui.bold("Package Manager Usage"));
  console.log(`  ${formatCommand("npx fexapi init")}`);
  console.log(`  ${formatCommand("pnpm dlx fexapi init")}`);
  console.log(`  ${formatCommand("yarn dlx fexapi init")}`);
  printSpacer();

  console.log(ui.bold("fexapi init creates"));
  console.log(`  ${ui.dim("fexapi.config.json")}`);
  console.log(`  ${ui.dim("fexapi.config.js")}`);
  console.log(`  ${ui.dim("fexapi/schema.fexapi")}`);
  console.log(`  ${ui.dim("fexapi/schemas/*.yaml (optional, via wizard)")}`);
  printSpacer();

  console.log(ui.bold("Init wizard asks"));
  console.log(`  ${ui.dim("What port? (default: 3000)")}`);
  console.log(`  ${ui.dim("Enable CORS? (Y/n)")}`);
  console.log(`  ${ui.dim("Generate sample schemas? (Y/n)")}`);
  printSpacer();

  console.log(ui.bold("Then run"));
  console.log(`  ${ui.dim("# edit fexapi/schema.fexapi")}`);
  console.log(`  ${formatCommand("fexapi generate")}`);
  console.log(`  ${formatCommand("fexapi run")}`);
  printSpacer();

  console.log(ui.bold("Generate output"));
  console.log(`  ${ui.dim("fexapi/generated.api.json")}`);
  console.log(`  ${ui.dim("fexapi/migrations/schema.json")}`);
};
