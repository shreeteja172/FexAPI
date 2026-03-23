import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { GENERATED_SPEC_RELATIVE_PATH } from "../constants";
import { detectProject, getSchemaTemplate } from "../project/detect";
import { findClosestPackageJson } from "../project/paths";

export const initializeProject = ({ force }: { force: boolean }): number => {
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

  mkdirSync(fexapiDirectoryPath, { recursive: true });

  const configExists = existsSync(configPath);
  const schemaExists = existsSync(schemaPath);

  const config = {
    framework: detectedProject.primaryFramework,
    frameworks: detectedProject.frameworks,
    tooling: detectedProject.tooling,
    schemaPath: "fexapi/schema.fexapi",
    generatedPath: GENERATED_SPEC_RELATIVE_PATH,
    createdAt: new Date().toISOString(),
  };

  if (!configExists || force) {
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
  }

  if (!schemaExists || force) {
    writeFileSync(
      schemaPath,
      `${getSchemaTemplate(detectedProject.primaryFramework)}\n`,
      "utf-8",
    );
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

  if (detectedProject.primaryFramework === "unknown") {
    console.log(
      "No known framework dependency found. Update fexapi.config.json and schema.fexapi if needed.",
    );
  }

  return 0;
};
