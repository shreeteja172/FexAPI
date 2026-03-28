import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const shouldUseColor = (): boolean => {
  return Boolean(process.stdout.isTTY);
};

const colorEnabled = shouldUseColor();
const interactive = Boolean(process.stdout.isTTY);
const DEFAULT_TERMINAL_WIDTH = 80;

const paint = (code: string, text: string): string => {
  if (!colorEnabled) {
    return text;
  }

  return `\u001b[${code}m${text}\u001b[0m`;
};

export const ui = {
  bold: (text: string): string => paint("1", text),
  dim: (text: string): string => paint("2", text),
  cyan: (text: string): string => paint("36", text),
  magenta: (text: string): string => paint("35", text),
  blue: (text: string): string => paint("94", text),
  green: (text: string): string => paint("32", text),
  yellow: (text: string): string => paint("33", text),
  red: (text: string): string => paint("31", text),
  gray: (text: string): string => paint("90", text),
  white: (text: string): string => paint("97", text),
};

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const ANSI_REGEX = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");

const stripAnsi = (text: string): string => text.replace(ANSI_REGEX, "");

const visibleLength = (text: string): number => stripAnsi(text).length;

const getTerminalWidth = (): number => {
  const columns = process.stdout.columns;
  if (!columns || Number.isNaN(columns)) {
    return DEFAULT_TERMINAL_WIDTH;
  }

  return Math.max(40, columns);
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  if (maxLength <= 1) {
    return text.slice(0, maxLength);
  }

  return `${text.slice(0, maxLength - 1)}…`;
};

const styleCardValue = (value: string): string => {
  const normalized = value.trim().toLowerCase();

  if (
    normalized === "changed" ||
    normalized === "enabled" ||
    normalized === "running"
  ) {
    return ui.green(ui.bold(value));
  }

  if (normalized === "cached" || normalized === "disabled") {
    return ui.gray(value);
  }

  if (normalized === "stopped" || normalized === "failed") {
    return ui.red(ui.bold(value));
  }

  return ui.white(ui.bold(value));
};

const clearCurrentLine = (): void => {
  if (!interactive) {
    return;
  }

  process.stdout.write("\r\u001b[2K");
};

type SpinnerController = {
  update: (text: string) => void;
  succeed: (text: string) => void;
  fail: (text: string) => void;
  stop: () => void;
};

export const startSpinner = (initialText: string): SpinnerController => {
  if (!interactive) {
    logStep(initialText);
    return {
      update: (text: string) => logStep(text),
      succeed: (text: string) => logSuccess(text),
      fail: (text: string) => logError(text),
      stop: () => undefined,
    };
  }

  let text = initialText;
  let frameIndex = 0;

  const render = () => {
    const frame = SPINNER_FRAMES[frameIndex % SPINNER_FRAMES.length] ?? "-";
    frameIndex += 1;
    process.stdout.write(`\r${ui.cyan(frame)} ${ui.white(ui.bold(text))}`);
  };

  render();
  const timer = setInterval(render, 80);

  return {
    update: (nextText: string) => {
      text = nextText;
    },
    succeed: (finalText: string) => {
      clearInterval(timer);
      clearCurrentLine();
      console.log(`${ui.green("✓")} ${ui.white(finalText)}`);
    },
    fail: (finalText: string) => {
      clearInterval(timer);
      clearCurrentLine();
      console.log(`${ui.red("✕")} ${ui.white(finalText)}`);
    },
    stop: () => {
      clearInterval(timer);
      clearCurrentLine();
    },
  };
};

export const nowMs = (): number => Date.now();

export const formatDuration = (startMs: number): string => {
  const elapsedMs = Date.now() - startMs;

  if (elapsedMs < 1000) {
    return `${elapsedMs}ms`;
  }

  return `${(elapsedMs / 1000).toFixed(2)}s`;
};

export const printSummaryCard = (
  title: string,
  rows: Array<{ label: string; value: string }>,
): void => {
  const terminalWidth = getTerminalWidth();
  const compactMode = terminalWidth < 64;

  if (compactMode) {
    console.log(ui.gray(`+-- ${title} --+`));
    for (const row of rows) {
      console.log(
        `${ui.dim(row.label)} ${ui.gray("::")} ${styleCardValue(row.value)}`,
      );
    }
    console.log(ui.gray("+----------------+"));
    return;
  }

  const safeRows = rows.map((row) => ({
    label: row.label,
    value: row.value,
  }));

  const maxCardWidth = 96;
  const naturalInnerWidth = Math.max(
    36,
    visibleLength(title) + 2,
    ...safeRows.map(
      (row) => visibleLength(row.label) + visibleLength(row.value) + 7,
    ),
  );
  const cardWidth = Math.max(
    40,
    Math.min(maxCardWidth, terminalWidth - 2, naturalInnerWidth + 2),
  );
  const innerWidth = cardWidth - 2;
  const labelWidth = Math.min(
    20,
    Math.max(10, ...safeRows.map((row) => visibleLength(row.label))),
  );
  const valueSpace = Math.max(8, innerWidth - 7 - labelWidth);

  const renderBoxLine = (content: string): string => {
    const remaining = Math.max(0, innerWidth - 2 - visibleLength(content));
    return `│ ${content}${" ".repeat(remaining)} │`;
  };

  const topBorder = `┌${"─".repeat(innerWidth)}┐`;
  const divider = `├${"─".repeat(innerWidth)}┤`;
  const bottomBorder = `└${"─".repeat(innerWidth)}┘`;
  console.log(ui.gray(topBorder));

  const renderedTitle = truncateText(title, innerWidth - 2);
  console.log(renderBoxLine(ui.bold(ui.cyan(renderedTitle))));
  console.log(ui.gray(divider));

  for (const row of safeRows) {
    const rawValue = stripAnsi(row.value);
    const value = truncateText(rawValue, valueSpace);
    const label = row.label.padEnd(labelWidth, " ");
    const styledValue = styleCardValue(value);
    console.log(
      renderBoxLine(`${ui.dim(label)} ${ui.gray("::")} ${styledValue}`),
    );
  }

  console.log(ui.gray(bottomBorder));
};

export const printGroupHeader = (title: string): void => {
  const terminalWidth = getTerminalWidth();
  const compactMode = terminalWidth < 64;

  if (compactMode) {
    console.log(ui.gray(`-- ${title} --`));
    return;
  }

  const innerWidth = terminalWidth - 2;
  const renderedTitle = truncateText(title, Math.max(1, innerWidth - 6));
  const rawPrefix = `── ${renderedTitle} `;
  const fill = Math.max(0, innerWidth - visibleLength(rawPrefix));

  const prefix = `${ui.gray("── ")}${ui.bold(ui.cyan(renderedTitle))} `;
  console.log(
    `${ui.gray("┌")}${prefix}${ui.gray("─".repeat(fill))}${ui.gray("┐")}`,
  );
};

export const printBanner = (): void => {
  console.log(
    ui.bold(ui.cyan("fexapi")) +
      ui.gray("  ") +
      ui.magenta("mock") +
      ui.gray(" api toolkit"),
  );
};

export const printSpacer = (): void => {
  console.log("");
};

export const logInfo = (message: string): void => {
  console.log(`${ui.blue("•")} ${ui.blue("info")} ${ui.white(message)}`);
};

export const logSuccess = (message: string): void => {
  console.log(`${ui.green("✓")} ${ui.green("ok  ")} ${ui.white(message)}`);
};

export const logWarn = (message: string): void => {
  console.log(`${ui.yellow("!")} ${ui.yellow("warn")} ${ui.white(message)}`);
};

export const logError = (message: string): void => {
  console.error(`${ui.red("✕")} ${ui.red("err ")} ${ui.white(message)}`);
};

export const logStep = (message: string): void => {
  console.log(`${ui.cyan("›")} ${ui.white(message)}`);
};

export const formatCommand = (command: string): string => {
  return ui.bold(command);
};

export const getCliVersion = (): string => {
  const packageCandidates = [
    join(__dirname, "..", "..", "package.json"),
    join(__dirname, "..", "package.json"),
  ];

  for (const packagePath of packageCandidates) {
    if (!existsSync(packagePath)) {
      continue;
    }

    try {
      const packageJson = JSON.parse(readFileSync(packagePath, "utf-8")) as {
        version?: string;
      };

      if (packageJson.version) {
        return packageJson.version;
      }
    } catch {
      continue;
    }
  }

  return "unknown";
};
