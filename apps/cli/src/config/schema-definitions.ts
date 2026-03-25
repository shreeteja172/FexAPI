import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { parse as parseYaml } from "yaml";
import type {
  FexapiFieldValueType,
  FexapiSchemaDefinition,
  FexapiSchemaDefinitions,
} from "../types/config";

const VALID_TYPES = new Set<FexapiFieldValueType>([
  "number",
  "string",
  "boolean",
  "date",
  "uuid",
  "email",
  "url",
  "name",
  "phone",
]);

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const parseSchemaDefinition = (
  schemaName: string,
  rawValue: unknown,
): FexapiSchemaDefinition | undefined => {
  if (!isRecord(rawValue)) {
    console.error(
      `Invalid fexapi/schemas/${schemaName}.yaml: expected root object of field definitions.`,
    );
    return undefined;
  }

  const result: FexapiSchemaDefinition = {};

  for (const [fieldName, rawFieldConfig] of Object.entries(rawValue)) {
    if (!isRecord(rawFieldConfig)) {
      console.error(
        `Invalid fexapi/schemas/${schemaName}.yaml field \`${fieldName}\`: expected object with type/faker/min/max.`,
      );
      continue;
    }

    const rawType = rawFieldConfig.type;
    if (typeof rawType !== "string") {
      console.error(
        `Invalid fexapi/schemas/${schemaName}.yaml field \`${fieldName}\`: missing string \`type\`.`,
      );
      continue;
    }

    const normalizedType = rawType.trim().toLowerCase() as FexapiFieldValueType;
    if (!VALID_TYPES.has(normalizedType)) {
      console.error(
        `Invalid fexapi/schemas/${schemaName}.yaml field \`${fieldName}\`: unknown type \`${rawType}\`.`,
      );
      continue;
    }

    const minValue = rawFieldConfig.min;
    const maxValue = rawFieldConfig.max;

    result[fieldName] = {
      type: normalizedType,
      faker:
        typeof rawFieldConfig.faker === "string"
          ? rawFieldConfig.faker.trim()
          : undefined,
      min:
        typeof minValue === "number" && Number.isFinite(minValue)
          ? minValue
          : undefined,
      max:
        typeof maxValue === "number" && Number.isFinite(maxValue)
          ? maxValue
          : undefined,
    };
  }

  return Object.keys(result).length > 0 ? result : undefined;
};

export const loadSchemaDefinitions = (
  projectRoot: string,
): FexapiSchemaDefinitions => {
  const schemasDirectoryPath = join(projectRoot, "fexapi", "schemas");

  if (!existsSync(schemasDirectoryPath)) {
    return {};
  }

  const result: FexapiSchemaDefinitions = {};

  for (const entry of readdirSync(schemasDirectoryPath)) {
    const schemaPath = join(schemasDirectoryPath, entry);
    if (!statSync(schemaPath).isFile()) {
      continue;
    }

    const extension = extname(entry).toLowerCase();
    if (extension !== ".yaml" && extension !== ".yml") {
      continue;
    }

    const schemaName = basename(entry, extension).toLowerCase();

    try {
      const source = readFileSync(schemaPath, "utf-8");
      const parsed = parseYaml(source) as unknown;
      const definition = parseSchemaDefinition(schemaName, parsed);
      if (definition) {
        result[schemaName] = definition;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to parse ${schemaPath}: ${message}`);
    }
  }

  return result;
};
