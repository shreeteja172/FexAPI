import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { GENERATED_SPEC_RELATIVE_PATH } from "../constants";
import {
  formatDuration,
  formatCommand,
  logError,
  logInfo,
  logSuccess,
  logWarn,
  nowMs,
  printSpacer,
  printSummaryCard,
  startSpinner,
  ui,
} from "../cli/ui";
import { detectProject, getSchemaTemplate } from "../project/detect";
import { findClosestPackageJson } from "../project/paths";

const DEFAULT_INIT_PORT = 4000;

type InitWizardAnswers = {
  port: number;
  cors: boolean;
  generateSampleSchemas: boolean;
};

const parseYesNo = (
  value: string,
  defaultValue: boolean,
): boolean | undefined => {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return defaultValue;
  }

  if (normalized === "y" || normalized === "yes") {
    return true;
  }

  if (normalized === "n" || normalized === "no") {
    return false;
  }

  return undefined;
};

const askInitWizardQuestions = async (): Promise<InitWizardAnswers> => {
  if (!input.isTTY || !output.isTTY) {
    return {
      port: DEFAULT_INIT_PORT,
      cors: true,
      generateSampleSchemas: true,
    };
  }

  const questionInterface = createInterface({ input, output });

  try {
    let port = DEFAULT_INIT_PORT;

    while (true) {
      const answer = await questionInterface.question(
        `What port? (default: ${DEFAULT_INIT_PORT}) `,
      );

      if (!answer.trim()) {
        break;
      }

      const parsedPort = Number(answer.trim());
      if (
        Number.isInteger(parsedPort) &&
        parsedPort >= 1 &&
        parsedPort <= 65535
      ) {
        port = parsedPort;
        break;
      }

      console.log("Please enter a valid port (1-65535).\n");
    }

    let cors = true;
    while (true) {
      const answer = await questionInterface.question("Enable CORS? (Y/n) ");
      const parsed = parseYesNo(answer, true);

      if (parsed !== undefined) {
        cors = parsed;
        break;
      }

      console.log("Please answer with Y/Yes or N/No.\n");
    }

    let generateSampleSchemas = true;
    while (true) {
      const answer = await questionInterface.question(
        "Generate sample schemas? (Y/n) ",
      );
      const parsed = parseYesNo(answer, true);

      if (parsed !== undefined) {
        generateSampleSchemas = parsed;
        break;
      }

      console.log("Please answer with Y/Yes or N/No.\n");
    }

    console.log("");

    return {
      port,
      cors,
      generateSampleSchemas,
    };
  } finally {
    questionInterface.close();
  }
};

const getRuntimeConfigTemplate = ({
  port,
  cors,
  includeSampleRoutes,
}: {
  port: number;
  cors: boolean;
  includeSampleRoutes: boolean;
}): string => {
  const routeSection = includeSampleRoutes
    ? [
        "  routes: {",
        '    "/users": { count: 10, schema: "user" },',
        '    "/posts": { count: 20, schema: "post" },',
        "  },",
      ]
    : [];

  return [
    "module.exports = {",
    `  port: ${port},`,
    `  cors: ${cors},`,
    "  delay: 0,",
    ...routeSection,
    "};",
  ].join("\n");
};

const SAMPLE_USER_SCHEMA = [
  "id:",
  "  type: uuid",
  "fullName:",
  "  type: name",
  "  faker: person.fullName",
  "username:",
  "  type: string",
  "  faker: internet.username",
  "email:",
  "  type: email",
  "  faker: internet.email",
  "avatarUrl:",
  "  type: url",
  "  faker: image.avatar",
  "bio:",
  "  type: string",
  "  faker: lorem.sentence",
  "isActive:",
  "  type: boolean",
  "joinedAt:",
  "  type: date",
].join("\n");

const SAMPLE_POST_SCHEMA = [
  "id:",
  "  type: uuid",
  "title:",
  "  type: string",
  "  faker: lorem.sentence",
  "body:",
  "  type: string",
  "  faker: lorem.paragraphs",
  "authorId:",
  "  type: uuid",
  "published:",
  "  type: boolean",
  "likes:",
  "  type: number",
  "  min: 0",
  "  max: 500",
  "createdAt:",
  "  type: date",
].join("\n");

export const initializeProject = async ({
  force,
}: {
  force: boolean;
}): Promise<number> => {
  const initStartedAtMs = nowMs();
  const packageJsonPath = findClosestPackageJson(process.cwd());

  if (!packageJsonPath) {
    logError(
      "Could not find package.json in this directory or parent directories.",
    );
    return 1;
  }

  const projectRoot = dirname(packageJsonPath);
  const detectedProject = detectProject(packageJsonPath, projectRoot);
  const fexapiDirectoryPath = join(projectRoot, "fexapi");
  const schemaPath = join(fexapiDirectoryPath, "schema.fexapi");
  const configPath = join(projectRoot, "fexapi.config.json");
  const runtimeConfigPath = join(projectRoot, "fexapi.config.js");
  const schemasDirectoryPath = join(projectRoot, "fexapi", "schemas");
  const userSchemaPath = join(schemasDirectoryPath, "user.yaml");
  const postSchemaPath = join(schemasDirectoryPath, "post.yaml");

  const wizardAnswers = await askInitWizardQuestions();

  const initSpinner = startSpinner("Scaffolding fexapi project files");

  mkdirSync(fexapiDirectoryPath, { recursive: true });

  const configExists = existsSync(configPath);
  const schemaExists = existsSync(schemaPath);

  const config = {
    framework: detectedProject.primaryFramework,
    frameworks: detectedProject.frameworks,
    tooling: detectedProject.tooling,
    schemaPath: "fexapi/schema.fexapi",
    generatedPath: GENERATED_SPEC_RELATIVE_PATH,
    defaultPort: wizardAnswers.port,
    corsEnabled: wizardAnswers.cors,
    sampleSchemasGenerated: wizardAnswers.generateSampleSchemas,
    createdAt: new Date().toISOString(),
  };

  if (!configExists || force) {
    initSpinner.update("Writing fexapi.config.json");
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
  }

  if (!schemaExists || force) {
    initSpinner.update("Writing fexapi/schema.fexapi");
    writeFileSync(
      schemaPath,
      `${getSchemaTemplate(detectedProject.primaryFramework, wizardAnswers.port)}\n`,
      "utf-8",
    );
  }

  const runtimeConfigExists = existsSync(runtimeConfigPath);
  if (!runtimeConfigExists || force) {
    initSpinner.update("Writing fexapi.config.js");
    writeFileSync(
      runtimeConfigPath,
      `${getRuntimeConfigTemplate({
        port: wizardAnswers.port,
        cors: wizardAnswers.cors,
        includeSampleRoutes: wizardAnswers.generateSampleSchemas,
      })}\n`,
      "utf-8",
    );
  }

  let userSchemaStatus: "created" | "overwritten" | "exists" | "skipped" =
    "skipped";
  let postSchemaStatus: "created" | "overwritten" | "exists" | "skipped" =
    "skipped";

  if (wizardAnswers.generateSampleSchemas) {
    mkdirSync(schemasDirectoryPath, { recursive: true });

    const userSchemaExists = existsSync(userSchemaPath);
    if (!userSchemaExists || force) {
      initSpinner.update("Writing sample user schema");
      writeFileSync(userSchemaPath, `${SAMPLE_USER_SCHEMA}\n`, "utf-8");
      userSchemaStatus = userSchemaExists ? "overwritten" : "created";
    } else {
      userSchemaStatus = "exists";
    }

    const postSchemaExists = existsSync(postSchemaPath);
    if (!postSchemaExists || force) {
      initSpinner.update("Writing sample post schema");
      writeFileSync(postSchemaPath, `${SAMPLE_POST_SCHEMA}\n`, "utf-8");
      postSchemaStatus = postSchemaExists ? "overwritten" : "created";
    } else {
      postSchemaStatus = "exists";
    }
  }

  initSpinner.succeed("Project scaffolding complete");

  logSuccess(`Initialized fexapi in ${projectRoot}`);
  logInfo(`Detected framework: ${detectedProject.primaryFramework}`);
  logInfo(`Detected frameworks: ${detectedProject.frameworks.join(", ")}`);
  if (detectedProject.tooling.length > 0) {
    logInfo(`Detected tooling: ${detectedProject.tooling.join(", ")}`);
  }

  printSpacer();

  if (configExists && !force) {
    logWarn(`Exists ${configPath}`);
  } else if (configExists && force) {
    logSuccess(`Overwritten ${configPath}`);
  } else {
    logSuccess(`Created ${configPath}`);
  }

  if (schemaExists && !force) {
    logWarn(`Exists ${schemaPath}`);
  } else if (schemaExists && force) {
    logSuccess(`Overwritten ${schemaPath}`);
  } else {
    logSuccess(`Created ${schemaPath}`);
  }

  if (runtimeConfigExists && !force) {
    logWarn(`Exists ${runtimeConfigPath}`);
  } else if (runtimeConfigExists && force) {
    logSuccess(`Overwritten ${runtimeConfigPath}`);
  } else {
    logSuccess(`Created ${runtimeConfigPath}`);
  }

  if (wizardAnswers.generateSampleSchemas) {
    if (userSchemaStatus === "exists") {
      logWarn(`Exists ${userSchemaPath}`);
    } else if (userSchemaStatus === "overwritten") {
      logSuccess(`Overwritten ${userSchemaPath}`);
    } else if (userSchemaStatus === "created") {
      logSuccess(`Created ${userSchemaPath}`);
    }

    if (postSchemaStatus === "exists") {
      logWarn(`Exists ${postSchemaPath}`);
    } else if (postSchemaStatus === "overwritten") {
      logSuccess(`Overwritten ${postSchemaPath}`);
    } else if (postSchemaStatus === "created") {
      logSuccess(`Created ${postSchemaPath}`);
    }
  } else {
    logWarn("Sample schemas were skipped.");
  }

  if (detectedProject.primaryFramework === "unknown") {
    logWarn(
      "No known framework dependency found. Update fexapi.config.json and schema.fexapi if needed.",
    );
  }

  printSpacer();
  const createdFiles = [
    !configExists || force,
    !schemaExists || force,
    !runtimeConfigExists || force,
    userSchemaStatus === "created" || userSchemaStatus === "overwritten",
    postSchemaStatus === "created" || postSchemaStatus === "overwritten",
  ].filter(Boolean).length;

  printSummaryCard("Init Summary", [
    {
      label: "framework",
      value: detectedProject.primaryFramework,
    },
    {
      label: "port",
      value: ui.cyan(String(wizardAnswers.port)),
    },
    {
      label: "cors",
      value: wizardAnswers.cors ? ui.green("enabled") : ui.gray("disabled"),
    },
    {
      label: "sample schemas",
      value: wizardAnswers.generateSampleSchemas
        ? ui.green("enabled")
        : ui.gray("disabled"),
    },
    {
      label: "files changed",
      value: ui.bold(String(createdFiles)),
    },
    {
      label: "time",
      value: ui.bold(formatDuration(initStartedAtMs)),
    },
  ]);

  printSpacer();
  logInfo(
    `Next: ${formatCommand("fexapi generate")} then ${formatCommand("fexapi serve")}`,
  );

  return 0;
};
