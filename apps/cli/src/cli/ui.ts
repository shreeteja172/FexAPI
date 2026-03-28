const shouldUseColor = (): boolean => {
  return Boolean(process.stdout.isTTY);
};

const colorEnabled = shouldUseColor();
const interactive = Boolean(process.stdout.isTTY);

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
};

const SPINNER_FRAMES = ["-", "\\", "|", "/"];

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
    process.stdout.write(`\r${ui.cyan(frame)} ${ui.bold(text)}`);
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
      console.log(`${ui.green("ok")} ${finalText}`);
    },
    fail: (finalText: string) => {
      clearInterval(timer);
      clearCurrentLine();
      console.log(`${ui.red("err")} ${finalText}`);
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
  const contentRows = [{ label: "", value: title }, ...rows];

  const maxLabel = Math.max(...contentRows.map((row) => row.label.length));
  const maxValue = Math.max(...contentRows.map((row) => row.value.length));
  const cardWidth = Math.max(40, maxLabel + maxValue + 7);

  const border = `+${"-".repeat(cardWidth - 2)}+`;
  console.log(ui.gray(border));

  const titleText = ui.bold(ui.cyan(title));
  const titleLine = `| ${titleText}${" ".repeat(Math.max(0, cardWidth - 4 - title.length))} |`;
  console.log(titleLine);
  console.log(ui.gray(`|${"-".repeat(cardWidth - 2)}|`));

  for (const row of rows) {
    const label = row.label.padEnd(maxLabel, " ");
    const value = row.value;
    const spaces = " ".repeat(
      Math.max(1, cardWidth - 4 - label.length - 3 - value.length),
    );
    console.log(`| ${ui.dim(label)} : ${ui.bold(value)}${spaces}|`);
  }

  console.log(ui.gray(border));
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
  console.log(`${ui.blue("info")} ${message}`);
};

export const logSuccess = (message: string): void => {
  console.log(`${ui.green("ok  ")} ${message}`);
};

export const logWarn = (message: string): void => {
  console.log(`${ui.yellow("warn")} ${message}`);
};

export const logError = (message: string): void => {
  console.error(`${ui.red("err ")} ${message}`);
};

export const logStep = (message: string): void => {
  console.log(`${ui.cyan("->")} ${message}`);
};

export const formatCommand = (command: string): string => {
  return ui.bold(command);
};
