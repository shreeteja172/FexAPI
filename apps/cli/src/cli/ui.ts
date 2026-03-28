const shouldUseColor = (): boolean => {
  return Boolean(process.stdout.isTTY);
};

const colorEnabled = shouldUseColor();

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
  blue: (text: string): string => paint("94", text),
  green: (text: string): string => paint("32", text),
  yellow: (text: string): string => paint("33", text),
  red: (text: string): string => paint("31", text),
  gray: (text: string): string => paint("90", text),
};

export const printBanner = (): void => {
  console.log(ui.bold(ui.cyan("fexapi")) + ui.gray("  mock api toolkit"));
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
