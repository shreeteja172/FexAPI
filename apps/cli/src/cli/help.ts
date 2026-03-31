import {
  formatCommand,
  getCliVersion,
  printBanner,
  printSpacer,
  ui,
} from "./ui";

export const printHelp = () => {
  const version = getCliVersion();
  printBanner();
  console.log(ui.dim(`version ${version}`));
  printSpacer();

  console.log(ui.bold("Quick Start"));
  console.log(`  1. ${formatCommand("fexapi init")}`);
  console.log(`  2. ${formatCommand("fexapi generate")}`);
  console.log(`  3. ${formatCommand("fexapi dev --watch")}`);
  printSpacer();

  console.log(ui.bold("Core Commands"));
  const commandRows: Array<{ command: string; description: string }> = [
    {
      command: "fexapi init [--force]",
      description: "Scaffold config + schema files",
    },
    {
      command: "fexapi generate",
      description: "Build fexapi/generated.api.json from schema",
    },
    {
      command: "fexapi dev [--watch] [--log]",
      description: "Start dev server (watch reloads on changes)",
    },
    {
      command: "fexapi serve [--host <host>] [--port <number>] [--log]",
      description: "Run server once (no watch)",
    },
    {
      command: "fexapi format",
      description: "Reformat fexapi/schema.fexapi",
    },
  ];
  const commandColumnWidth = Math.max(
    ...commandRows.map((row) => row.command.length),
  );
  for (const row of commandRows) {
    console.log(
      `  ${formatCommand(row.command.padEnd(commandColumnWidth, " "))} ${ui.dim(row.description)}`,
    );
  }
  printSpacer();

  console.log(ui.bold("Package Manager Dev Watch"));
  console.log(`  ${ui.dim("One-off (no install):")}`);
  console.log(`  ${formatCommand("npx fexapi@latest dev --watch")}`);
  console.log(`  ${formatCommand("pnpm dlx fexapi@latest dev --watch")}`);
  console.log(`  ${formatCommand("npm exec fexapi@latest -- dev --watch")}`);
  console.log(
    `  ${ui.dim("@latest keeps npm/pnpm/yarn/bun on the same CLI version")}`,
  );
  printSpacer();
  console.log(`  ${ui.dim("Project-local (installed dependency):")}`);
  console.log(`  ${formatCommand("pnpm exec fexapi dev --watch")}`);
  console.log(
    `  ${ui.dim("Optional shortcut via scripts: pnpm run mock:dev (if defined)")}`,
  );
  printSpacer();

  console.log(ui.bold("Global Flags"));
  console.log(
    `  ${formatCommand("fexapi --help")} ${ui.dim("Show this help")}`,
  );
  console.log(
    `  ${formatCommand("fexapi --version")} ${ui.dim("Print installed version")}`,
  );
};
