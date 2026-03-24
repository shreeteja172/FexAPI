import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { GENERATED_SPEC_RELATIVE_PATH } from "../constants";
import { detectProject, getSchemaTemplate } from "../project/detect";
import { findClosestPackageJson } from "../project/paths";

const DEFAULT_INIT_PORT = 3000;

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
        '    "/users": { count: 25, schema: "user" },',
        '    "/posts": { count: 40, schema: "post" },',
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
  "email:",
  "  type: email",
  "  faker: internet.email",
  "avatarUrl:",
  "  type: url",
  "  faker: image.avatar",
].join("\n");

const SAMPLE_POST_SCHEMA = [
  "id:",
  "  type: uuid",
  "title:",
  "  type: string",
  "  faker: lorem.sentence",
  "body:",
  "  type: string",
  "  faker: lorem.paragraph",
  "createdAt:",
  "  type: date",
].join("\n");

export const initializeProject = async ({
  force,
}: {
  force: boolean;
}): Promise<number> => {
  const packageJsonPath = findClosestPackageJson(process.cwd());

  if (!packageJsonPath) {
    console.error(
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
  const schemasDirectoryPath = join(projectRoot, "schemas");
  const userSchemaPath = join(schemasDirectoryPath, "user.yaml");
  const postSchemaPath = join(schemasDirectoryPath, "post.yaml");

  const wizardAnswers = await askInitWizardQuestions();

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
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
  }

  if (!schemaExists || force) {
    writeFileSync(
      schemaPath,
      `${getSchemaTemplate(detectedProject.primaryFramework, wizardAnswers.port)}\n`,
      "utf-8",
    );
  }

  const runtimeConfigExists = existsSync(runtimeConfigPath);
  if (!runtimeConfigExists || force) {
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
      writeFileSync(userSchemaPath, `${SAMPLE_USER_SCHEMA}\n`, "utf-8");
      userSchemaStatus = userSchemaExists ? "overwritten" : "created";
    } else {
      userSchemaStatus = "exists";
    }

    const postSchemaExists = existsSync(postSchemaPath);
    if (!postSchemaExists || force) {
      writeFileSync(postSchemaPath, `${SAMPLE_POST_SCHEMA}\n`, "utf-8");
      postSchemaStatus = postSchemaExists ? "overwritten" : "created";
    } else {
      postSchemaStatus = "exists";
    }
  }

  console.log(`Initialized Fexapi in ${projectRoot}`);
  console.log(`Detected framework: ${detectedProject.primaryFramework}`);
  console.log(`Detected frameworks: ${detectedProject.frameworks.join(", ")}`);
  if (detectedProject.tooling.length > 0) {
    console.log(`Detected tooling: ${detectedProject.tooling.join(", ")}`);
  }

  if (configExists && !force) {
    console.log(`Exists ${configPath}`);
  } else if (configExists && force) {
    console.log(`Overwritten ${configPath}`);
  } else {
    console.log(`Created ${configPath}`);
  }

  if (schemaExists && !force) {
    console.log(`Exists ${schemaPath}`);
  } else if (schemaExists && force) {
    console.log(`Overwritten ${schemaPath}`);
  } else {
    console.log(`Created ${schemaPath}`);
  }

  if (runtimeConfigExists && !force) {
    console.log(`Exists ${runtimeConfigPath}`);
  } else if (runtimeConfigExists && force) {
    console.log(`Overwritten ${runtimeConfigPath}`);
  } else {
    console.log(`Created ${runtimeConfigPath}`);
  }

  if (wizardAnswers.generateSampleSchemas) {
    if (userSchemaStatus === "exists") {
      console.log(`Exists ${userSchemaPath}`);
    } else if (userSchemaStatus === "overwritten") {
      console.log(`Overwritten ${userSchemaPath}`);
    } else if (userSchemaStatus === "created") {
      console.log(`Created ${userSchemaPath}`);
    }

    if (postSchemaStatus === "exists") {
      console.log(`Exists ${postSchemaPath}`);
    } else if (postSchemaStatus === "overwritten") {
      console.log(`Overwritten ${postSchemaPath}`);
    } else if (postSchemaStatus === "created") {
      console.log(`Created ${postSchemaPath}`);
    }
  } else {
    console.log("Sample schemas were skipped.");
  }

  if (detectedProject.primaryFramework === "unknown") {
    console.log(
      "No known framework dependency found. Update fexapi.config.json and schema.fexapi if needed.",
    );
  }

  return 0;
};
