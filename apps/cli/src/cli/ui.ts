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
const ANSI_REGEX = /\u001b\[[0-9;]*m/g;

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
    console.log(ui.gray(`--- ${title} ---`));
    for (const row of rows) {
      console.log(`${ui.dim(row.label)}: ${row.value}`);
    }
    console.log(ui.gray("---------------"));
    return;
  }

  const safeRows = rows.map((row) => ({
    label: row.label,
    value: row.value,
  }));

  const cardWidth = terminalWidth - 2;
  const innerWidth = cardWidth - 2;
  const labelWidth = Math.min(
    20,
    Math.max(10, ...safeRows.map((row) => visibleLength(row.label))),
  );
  const valueSpace = Math.max(8, innerWidth - 3 - labelWidth - 3);

  const topBorder = `┌${"─".repeat(innerWidth)}┐`;
  const divider = `├${"─".repeat(innerWidth)}┤`;
  const bottomBorder = `└${"─".repeat(innerWidth)}┘`;
  console.log(ui.gray(topBorder));

  const renderedTitle = truncateText(title, innerWidth - 2);
  const titlePadding = " ".repeat(
    Math.max(0, innerWidth - 2 - visibleLength(renderedTitle)),
  );
  console.log(`│ ${ui.bold(ui.cyan(renderedTitle))}${titlePadding} │`);
  console.log(ui.gray(divider));

  for (const row of safeRows) {
    const rawValue = stripAnsi(row.value);
    const value = truncateText(rawValue, valueSpace);
    const label = row.label.padEnd(labelWidth, " ");
    const styledValue = styleCardValue(value);
    const spaces = " ".repeat(
      Math.max(
        1,
        innerWidth - 3 - visibleLength(label) - 3 - visibleLength(value),
      ),
    );
    console.log(`│ ${ui.dim(label)} ${ui.gray("::")} ${styledValue}${spaces}│`);
  }

  console.log(ui.gray(bottomBorder));
};

export const printGroupHeader = (title: string): void => {
  const terminalWidth = getTerminalWidth();
  const marker = ui.gray("──");
  const text = ` ${ui.bold(title)} `;
  const lineLength = Math.max(0, terminalWidth - visibleLength(title) - 4);
  const left = marker;
  const right = ui.gray("─".repeat(Math.max(0, lineLength - 2)));
  console.log(`${left}${text}${right}`);
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
