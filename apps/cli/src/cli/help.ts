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
  console.log(`  ${formatCommand("fexapi --version")}`);
  console.log(`  ${formatCommand("fexapi version")}`);
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
    `  ${formatCommand("fexapi serve --host localhost --port 5000")}`,
  );
  console.log(`  ${formatCommand("fexapi --port 4000")}`);
  printSpacer();

  console.log(ui.bold("Package Manager Usage"));
  console.log(`  ${formatCommand("npx fexapi init")}`);
  console.log(`  ${formatCommand("pnpm dlx fexapi init")}`);
  console.log(`  ${formatCommand("yarn dlx fexapi init")}`);
  printSpacer();

  console.log(ui.bold("fexapi init creates"));
  console.log(`  ${ui.dim("fexapi.config.js")}`);
  console.log(`  ${ui.dim("fexapi/schema.fexapi")}`);
  printSpacer();

  console.log(ui.bold("Init wizard asks"));
  console.log(`  ${ui.dim("What port? (default: 4000)")}`);
  console.log(`  ${ui.dim("Enable CORS? (Y/n)")}`);
  printSpacer();

  console.log(ui.bold("Then run"));
  console.log(`  ${ui.dim("# edit fexapi/schema.fexapi")}`);
  console.log(`  ${formatCommand("fexapi generate")}`);
  console.log(`  ${formatCommand("fexapi run")}`);
  printSpacer();

  console.log(ui.bold("Generate output"));
  console.log(`  ${ui.dim("fexapi/generated.api.json")}`);
};
