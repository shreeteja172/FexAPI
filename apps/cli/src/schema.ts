export type FexapiPrimitiveType =
  | "number"
  | "string"
  | "boolean"
  | "date"
  | "uuid"
  | "email"
  | "url"
  | "name"
  | "phone";

export type FexapiFieldType =
  | FexapiPrimitiveType
  | `${FexapiPrimitiveType}[]`
  | "array"
  | "object";

export type FexapiField = {
  name: string;
  type: FexapiFieldType;
  fields?: FexapiField[];
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

const PRIMITIVE_TYPES: FexapiPrimitiveType[] = [
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

const VALID_TYPES: FexapiFieldType[] = [
  ...PRIMITIVE_TYPES,
  ...(PRIMITIVE_TYPES.map((t) => `${t}[]`) as NonNullable<FexapiFieldType>[]),
];

const VALID_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

const DEFAULT_PORT = 4000;
const ROUTE_FORMAT_ERROR_MESSAGE =
  "Invalid route definition. Expected format: " +
  "METHOD /endpoint: field:type,field:type (or multiline fields under METHOD /endpoint:)";

const FIELD_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

const isPortLine = (line: string): boolean => /^port\s*:/i.test(line.trim());

const stripInlineComment = (line: string): string => {
  const commentIndex = line.indexOf("#");
  if (commentIndex === -1) {
    return line.trim();
  }

  return line.slice(0, commentIndex).trim();
};

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

const parseTokens = (
  tokens: string[],
  startIndex: number,
  endChar?: string,
): { fields: FexapiField[]; nextIndex: number; error?: string } => {
  const fields: FexapiField[] = [];
  const seenFieldNames = new Set<string>();

  let i = startIndex;
  while (i < tokens.length) {
    const token = tokens[i]!;

    if (endChar && token === endChar) {
      return { fields, nextIndex: i + 1 };
    }

    if (token === "]" || token === "}") {
      return {
        fields: [],
        nextIndex: i,
        error: `Unexpected closing character "${token}" without matching open.`,
      };
    }

    const parts = token.split(":");
    if (parts.length !== 2) {
      return {
        fields: [],
        nextIndex: i,
        error: `Invalid field "${token}". Expected format name:type.`,
      };
    }

    const rawName = parts[0]?.trim() || "";
    const rawType = parts[1]?.trim().toLowerCase() || "";

    if (!rawName) {
      return {
        fields: [],
        nextIndex: i,
        error: `Invalid field "${token}". Missing field name.`,
      };
    }

    if (!FIELD_NAME_PATTERN.test(rawName)) {
      return {
        fields: [],
        nextIndex: i,
        error: `Invalid field name "${rawName}". Use letters, numbers, and underscore only.`,
      };
    }

    if (!rawType) {
      return {
        fields: [],
        nextIndex: i,
        error: `Invalid field "${token}". Missing field type.`,
      };
    }

    let field: FexapiField;

    if (rawType === "[" || rawType === "{") {
      const isArray = rawType === "[";
      const expectedEnd = isArray ? "]" : "}";
      const nested = parseTokens(tokens, i + 1, expectedEnd);

      if (nested.error) {
        return { fields: [], nextIndex: nested.nextIndex, error: nested.error };
      }

      if (
        nested.nextIndex > tokens.length ||
        tokens[nested.nextIndex - 1] !== expectedEnd
      ) {
        return {
          fields: [],
          nextIndex: nested.nextIndex,
          error: `Unclosed ${isArray ? "array" : "object"} for field "${rawName}". Expected "${expectedEnd}".`,
        };
      }

      field = {
        name: rawName,
        type: isArray ? "array" : "object",
        fields: nested.fields,
      };
      i = nested.nextIndex;
    } else {
      if (!VALID_TYPES.includes(rawType as FexapiFieldType)) {
        return {
          fields: [],
          nextIndex: i,
          error: `Unknown type "${rawType}" in field "${rawName}". Valid types: ${VALID_TYPES.join(", ")}`,
        };
      }

      field = {
        name: rawName,
        type: rawType as FexapiFieldType,
      };
      i++;
    }

    if (seenFieldNames.has(field.name)) {
      return {
        fields: [],
        nextIndex: i,
        error: `Duplicate field "${field.name}".`,
      };
    }

    seenFieldNames.add(field.name);
    fields.push(field);
  }

  if (endChar) {
    return {
      fields: [],
      nextIndex: i,
      error: `Unclosed structure. Expected "${endChar}".`,
    };
  }

  return { fields, nextIndex: i };
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

  if (!VALID_METHODS.has(method)) {
    return {
      error: `Unsupported HTTP method "${method}" for route ${method} ${path}. Valid methods: ${Array.from(VALID_METHODS).join(", ")}`,
    };
  }

  const tokens: string[] = [];
  for (const rawFieldLine of rawFields) {
    for (const part of rawFieldLine.split(",")) {
      const trimmedPart = stripInlineComment(part);
      if (trimmedPart) {
        tokens.push(trimmedPart);
      }
    }
  }

  const parsed = parseTokens(tokens, 0);
  if (parsed.error) {
    return { error: parsed.error + ` (in route ${method} ${path})` };
  }

  if (parsed.fields.length === 0) {
    return { error: `Route ${method} ${path} has no valid fields.` };
  }

  return { method, path, fields: parsed.fields };
};

export const parseFexapiSchema = (
  schemaText: string,
): { schema?: FexapiSchema; errors: string[] } => {
  let port = DEFAULT_PORT;
  const routes: FexapiRoute[] = [];
  const errors: string[] = [];

  const lines = schemaText.split(/\r?\n/);
  const seenRoutes = new Set<string>();

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const trimmedLine = stripInlineComment(rawLine);

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
      errors.push(`${ROUTE_FORMAT_ERROR_MESSAGE} (line ${index + 1})`);
      continue;
    }

    const routeKey = `${header.method} ${header.path}`;
    if (seenRoutes.has(routeKey)) {
      errors.push(
        `Duplicate route definition: ${routeKey} (line ${index + 1})`,
      );
      continue;
    }

    const rawFields: string[] = [];
    const inlineFields = stripInlineComment(header.inlineFields);
    if (inlineFields) {
      rawFields.push(inlineFields);
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
        const normalizedFieldLine = stripInlineComment(
          lookaheadTrimmedLine.replace(/^-+\s*/, ""),
        );
        if (normalizedFieldLine) {
          rawFields.push(normalizedFieldLine);
        }
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
      errors.push(`${parsedRoute.error} (line ${index + 1})`);
      continue;
    }

    seenRoutes.add(routeKey);
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
