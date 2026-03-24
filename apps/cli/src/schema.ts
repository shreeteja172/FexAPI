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
  "METHOD /endpoint: field:type,field:type (or multiline fields under METHOD /endpoint:)";

const isPortLine = (line: string): boolean => /^port\s*:/i.test(line.trim());

const parseRouteHeader = (
  line: string,
):
  | {
      method: string;
      path: string;
      inlineFields: string;
    }
  | undefined => {
  const separatorIndex = line.indexOf(":");

  if (separatorIndex === -1) {
    return undefined;
  }

  const rawLeft = line.slice(0, separatorIndex);
  const rawFields = line.slice(separatorIndex + 1);
  const [rawMethod, rawPath] = rawLeft.trim().split(/\s+/, 2);
  const method = rawMethod?.toUpperCase();
  const path = rawPath?.trim();

  if (!method || !path || !path.startsWith("/")) {
    return undefined;
  }

  return {
    method,
    path,
    inlineFields: rawFields,
  };
};

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

const parseRoute = ({
  method,
  path,
  rawFields,
}: {
  method: string;
  path: string;
  rawFields: string[];
}): FexapiRoute | { error: string } => {
  if (!method || !path) {
    return { error: ROUTE_FORMAT_ERROR_MESSAGE };
  }

  const fields: FexapiField[] = [];
  for (const rawFieldLine of rawFields) {
    for (const part of rawFieldLine.split(",")) {
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

  const lines = schemaText.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const trimmedLine = rawLine.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    if (isPortLine(trimmedLine)) {
      const rawPort = trimmedLine.slice(trimmedLine.indexOf(":") + 1).trim();
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

    const header = parseRouteHeader(trimmedLine);
    if (!header) {
      errors.push(ROUTE_FORMAT_ERROR_MESSAGE);
      continue;
    }

    const rawFields: string[] = [];
    if (header.inlineFields.trim()) {
      rawFields.push(header.inlineFields);
    }

    let lookaheadIndex = index + 1;
    while (lookaheadIndex < lines.length) {
      const lookaheadRawLine = lines[lookaheadIndex] ?? "";
      const lookaheadTrimmedLine = lookaheadRawLine.trim();

      if (!lookaheadTrimmedLine || lookaheadTrimmedLine.startsWith("#")) {
        lookaheadIndex += 1;
        continue;
      }

      if (
        isPortLine(lookaheadTrimmedLine) ||
        parseRouteHeader(lookaheadTrimmedLine)
      ) {
        break;
      }

      if (/^\s+/.test(lookaheadRawLine)) {
        rawFields.push(lookaheadTrimmedLine.replace(/^-+\s*/, ""));
        lookaheadIndex += 1;
        continue;
      }

      break;
    }

    const parsedRoute = parseRoute({
      method: header.method,
      path: header.path,
      rawFields,
    });

    if ("error" in parsedRoute) {
      errors.push(parsedRoute.error);
      continue;
    }

    routes.push(parsedRoute);
    index = lookaheadIndex - 1;
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
