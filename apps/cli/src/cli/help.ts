import {
  formatCommand,
  getCliVersion,
  printBanner,
  printSpacer,
  ui,
} from "./ui";

type HelpEntry = readonly [command: string, description: string];
type ShortcutEntry = readonly [command: string, label: string];

const data = {
  commands: [
    ["init [--force]", "create config + schema"],
    ["generate", "build .cache/generated.api.json"],
    ["dev [--watch] [--log]", "start dev server"],
    ["serve [--host <host>] [--port <number>] [--log]", "run once (no watch)"],
    ["format", "format schema"],
  ] as HelpEntry[],
  flags: [
    ["--help", "Show this help"],
    ["--version", "Print installed version"],
  ] as HelpEntry[],
  shortcuts: [
    ["npx fexapi@latest dev --watch", "No install"],
    ["pnpm exec fexapi dev --watch", "Installed in project"],
  ] as ShortcutEntry[],
  quickStart: ["init", "generate", "dev --watch"],
};

const fmt = (cmd: string, desc: string, prefix = "fexapi") =>
  `  ${formatCommand(`${prefix} ${cmd}`)} ${ui.dim(desc)}`;

const section = (title: string, lines: string[]) => {
  console.log(ui.bold(title));
  lines.forEach((l) => console.log(l));
  printSpacer();
};

export const printHelp = () => {
  printBanner();
  console.log(ui.dim(`version ${getCliVersion()}`));
  printSpacer();

  section(
    "Quick Start",
    data.quickStart.map(
      (s, i) => `  ${i + 1}. ${formatCommand(`fexapi ${s}`)}`,
    ),
  );
  section(
    "Commands",
    data.commands.map(([c, d]) => fmt(c, d)),
  );
  section(
    "Dev Watch Shortcuts",
    data.shortcuts.map(
      ([c, d]) => `  ${ui.dim(`${d}:`)}\n  ${formatCommand(c)}`,
    ),
  );
  section(
    "Global Flags",
    data.flags.map(([c, d]) => fmt(c, d, "fexapi")),
  );
};
