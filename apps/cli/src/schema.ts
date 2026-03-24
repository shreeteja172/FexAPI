export type FexapiFieldType =
  | "number"
  | "string"
  | "boolean"
  | "date"
  | "uuid"
  | "email"
  | "url"
  | "name"
  | "phone";

export type FexapiField = {
  name: string;
  type: FexapiFieldType;
};

export type FexapiRoute = {
  method: string;
  path: string;
  fields: FexapiField[];
};

export type FexapiSchema = {
  port: number;
  routes: FexapiRoute[];
};

const VALID_TYPES: FexapiFieldType[] = [
  "number",
  "string",
  "boolean",
  "date",
  "uuid",
  "email",
  "url",
  "name",
  "phone",
];

const DEFAULT_PORT = 4000;
const ROUTE_FORMAT_ERROR_MESSAGE =
  "Invalid route definition. Expected format: " +
  "METHOD /endpoint: field:type,field:type";

const parseField = (rawField: string): FexapiField | { error: string } => {
  const [rawName, rawType] = rawField.split(":");
  const name = rawName?.trim();
  const type = rawType?.trim().toLowerCase();

  if (!name) {
    return { error: `Invalid field "${rawField}". Missing field name.` };
  }

  if (!type) {
    return { error: `Invalid field "${rawField}". Missing field type.` };
  }

  if (!VALID_TYPES.includes(type as FexapiFieldType)) {
    return {
      error: `Unknown type "${type}" in field "${name}". Valid types: ${VALID_TYPES.join(
        ", ",
      )}`,
    };
  }

  return {
    name,
    type: type as FexapiFieldType,
  };
};

const parseRoute = (line: string): FexapiRoute | { error: string } => {
  const separatorIndex = line.indexOf(":");

  if (separatorIndex === -1) {
    return { error: ROUTE_FORMAT_ERROR_MESSAGE };
  }

  const rawLeft = line.slice(0, separatorIndex);
  const rawFields = line.slice(separatorIndex + 1);

  if (!rawLeft || !rawFields) {
    return { error: ROUTE_FORMAT_ERROR_MESSAGE };
  }

  const [rawMethod, rawPath] = rawLeft.trim().split(/\s+/, 2);
  const method = rawMethod?.toUpperCase();
  const path = rawPath?.trim();

  if (!method || !path) {
    return {
      error:
        "Invalid route definition. Missing METHOD or /endpoint before ':'.",
    };
  }

  if (!path.startsWith("/")) {
    return { error: `Route path must start with '/': ${path}` };
  }

  const fields: FexapiField[] = [];
  for (const part of rawFields.split(",")) {
    const trimmedPart = part.trim();
    if (!trimmedPart) {
      continue;
    }

    const parsedField = parseField(trimmedPart);
    if ("error" in parsedField) {
      return { error: parsedField.error };
    }

    fields.push(parsedField);
  }

  if (fields.length === 0) {
    return { error: `Route ${method} ${path} has no valid fields.` };
  }

  return { method, path, fields };
};

export const parseFexapiSchema = (
  schemaText: string,
): { schema?: FexapiSchema; errors: string[] } => {
  let port = DEFAULT_PORT;
  const routes: FexapiRoute[] = [];
  const errors: string[] = [];

  const lines = schemaText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  for (const line of lines) {
    if (line.toLowerCase().startsWith("port:")) {
      const rawPort = line.slice(line.indexOf(":") + 1).trim();
      const parsedPort = Number(rawPort);

      if (
        !Number.isInteger(parsedPort) ||
        parsedPort < 1 ||
        parsedPort > 65535
      ) {
        errors.push(`Invalid port value: ${rawPort}`);
      } else {
        port = parsedPort;
      }

      continue;
    }

    const parsedRoute = parseRoute(line);
    if ("error" in parsedRoute) {
      errors.push(parsedRoute.error);
      continue;
    }

    routes.push(parsedRoute);
  }

  if (routes.length === 0) {
    errors.push("No routes defined in schema.fexapi.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    schema: {
      port,
      routes,
    },
    errors: [],
  };
};
